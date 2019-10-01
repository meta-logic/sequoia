structure treefuncImpl : TREEFUNC = struct

    open helpersImpl
    open datatypesImpl
    open applyunifierImpl
    open unifyImpl

    fun get_open_prems(DerTree(id, sq, NoRule, pq)) = [DerTree(id, sq, NoRule, pq)]
        | get_open_prems(DerTree(id, sq, rq, pq)) = List.concat (List.map get_open_prems pq)

    fun closed_tree(DerTree(id, sq, NoRule, pq)) = false
        | closed_tree(DerTree(id, sq, rq, pq)) = not (List.exists(fn p => not (closed_tree p))pq)

    fun atomic_transform(Seq(l,c,r)) = 
        let
            fun form_trans (Atom(a)) = Atom(a)
                | form_trans (AtomVar(a)) = Atom(a)
                | form_trans (FormVar(a)) = Atom(a)
                | form_trans (Form(c, l)) = Form(c,subforms_trans(l))
            and subforms_trans (nil) = []
                | subforms_trans (x::l) = form_trans(x)::subforms_trans(l)
            fun ctx_struct_trans(Empty) = Empty
                | ctx_struct_trans(Single (Ctx (vl,fl))) = 
                    Single (Ctx (vl,List.map(fn f => form_trans(f))fl))
                | ctx_struct_trans(Mult (c, Ctx(vl,fl), rest)) = 
                    Mult (c, Ctx(vl,List.map(fn f => form_trans(f))fl), rest)
        in
            Seq(ctx_struct_trans l, c, ctx_struct_trans r)
        end

    fun get_forms(Seq (l,_,r)) = 
        let 
            fun get_forms_aux(Empty) = []
                | get_forms_aux(Single (Ctx (_,fl))) = fl
                | get_forms_aux(Mult (_, Ctx(_,fl), rest)) = fl @ get_forms_aux(rest)
        in (get_forms_aux l) @ (get_forms_aux r) end

    fun get_ctx_vars(Seq (l,_,r)) = 
        let 
            fun get_ctx_vars_aux(Empty) = []
                | get_ctx_vars_aux(Single (Ctx (vl,_))) = vl
                | get_ctx_vars_aux(Mult (_, Ctx(vl,_), rest)) = vl @ get_ctx_vars_aux(rest)
        in (get_ctx_vars_aux l) @ (get_ctx_vars_aux r) end

    fun filter_bad_subs(sigcons, sequent) =
        let 
            fun bad_sub(CVs(_, Ctx(vl, [])), _) = false
                | bad_sub(CVs(v1, Ctx(_, fl)), sequent) = 
                    List.exists(fn v2 => ctx_var_eq(v1,v2))(get_ctx_vars sequent)
                | bad_sub(Fs(a1,_), sequent) = 
                    List.exists(fn a2 => form_eq(a1,a2))(get_forms sequent)
        in 
            List.filter(fn (sb,_) => not (List.exists(fn s => bad_sub(s,sequent))sb))sigcons
        end

    fun get_premises_of(DerTree(id, _, _, []), sid) = []
        | get_premises_of(DerTree(id, _, _, pq), sid) = 
            if id = sid then List.map(fn DerTree(_, sq, _, _) => sq)pq
            else if not (String.isPrefix id sid) then []
            else List.foldl(fn (branch, premises) => premises @ (get_premises_of(branch,sid)))([])pq

    fun check_rule_of(DerTree(id, _, NoRule, pq), sid) = not (id = sid)
        | check_rule_of(DerTree(id, _, rq, pq), sid) = if id = sid then true 
        else if not (String.isPrefix id sid) then true
        else List.foldl(fn (branch, bools) => bools andalso (check_rule_of(branch,sid)))(true)pq

    fun apply_rule((forms, cons, dt), rule, sid) =
        let 
            fun apply_rule_aux(DerTree(id, sq, NoRule, []), Rule(name, s, conc, premises), sid) =
                    if id <> sid then [(forms,NONE,DerTree(id, sq, NoRule, []))] else 
                    (case Unify_seq(conc, sq) of
                        SOME(sigscons) => 
                            let val new_sigscons = filter_bad_subs(sigscons,sq)
                                val next_ids = List.tabulate(List.length(premises), fn i => Int.toString(i))
                                val formulas = get_forms(conc)
                                val prems_ids = ListPair.zip(premises, next_ids)
                                val new_prems = List.map(fn (p, i) => DerTree(id^i,p,NoRule,[]))prems_ids
                            in
                                if List.length(new_sigscons) = 0 then [(forms,NONE,DerTree(id,sq,NoRule,[]))] else
                                List.map(fn (sg,cn) => let val frm = apply_formL_Unifier(formulas,sg) in
                                (forms @ frm,SOME(sg,cn), DerTree(id,sq,RuleName(name),new_prems)) end)new_sigscons
                            end
                        | NONE => [(forms,NONE,DerTree(id, sq, NoRule, []))])
                | apply_rule_aux(DerTree(id, sq, rq, pq), rule, sid) =
                    if id = sid then [(forms,NONE,DerTree(id, sq, rq, pq))] else
                    let val new_prems_list = apply_rule_list(pq, rule, sid) in
                    List.map(fn (frm, sgcn, new_p) => (forms @ frm, sgcn, DerTree(id, sq, rq, new_p)))new_prems_list end
            and apply_rule_list([], _, _) = []
                | apply_rule_list(DerTree(id, sq, rq, pq)::prems, rule, sid) = 
                    if not (String.isPrefix id sid) then 
                        let val new_prems_list = apply_rule_list(prems, rule, sid)
                        in List.map(fn (frm, sgcn, ps) => (forms @ frm, sgcn, DerTree(id, sq, rq, pq) :: ps))new_prems_list end
                    else 
                        let val all_devs = apply_rule_aux(DerTree(id, sq, rq, pq), rule, sid)
                        in List.map(fn (frm, sgcn, dv) => (forms @ frm, sgcn, dv :: prems))all_devs end
        in 
            List.map(fn (form, unif, dvt) => case unif of 
                SOME((sg,cn)) => (form, cons @ cn, apply_der_tree_Unifier(dvt, sg))
                | NONE => (form, cons, dvt))(apply_rule_aux(dt, rule, sid))
        end

    fun apply_rule_everywhere((fm,cn,dt), rule) = 
        let val ids = List.map(fn DerTree(id,_,_,_)=> id)(get_open_prems dt)
        in
            List.foldl(fn (sid, tree_list) => 
                List.concat(List.map(fn tree => 
                    apply_rule(tree, rule, sid))tree_list))([(fm,cn,dt)])ids
        end

    fun apply_rule_all_ways((fm,cn,dt), rule, at_least_once) = 
        let val ids = List.map(fn DerTree(id,_,_,_)=> id)(get_open_prems dt)
            val num = if at_least_once then 1 else 0
            val rng = if at_least_once then 0 else 1
            val (id_sets, _) = 
                ListPair.unzip (List.concat(
                List.tabulate(List.length(ids)+rng, fn i => 
                chooseK (ids,i+num,fn(a,b)=>a=b))))
        in
            List.concat(List.map(fn id_set => 
                List.foldl(fn (sid, tree_list) => 
                    List.concat(List.map(fn tree =>
                        apply_rule(tree, rule, sid))tree_list))
                        ([(fm,cn,dt)])id_set)(id_sets))
        end

    fun apply_multiple_rules_all_ways(dt, rule_ls) = 
        List.concat (List.map(fn perm => 
            List.foldl(fn (rule, tree_ls) => 
                List.concat(List.map(fn tree => apply_rule_all_ways(tree, rule, false))tree_ls)
            )(apply_rule_all_ways(dt, List.hd perm, true))(List.tl perm))
        (permutations(rule_ls)))

    (*taken from: https://stackoverflow.com/questions/33597175/how-to-write-to-a-file-in-sml*)
	fun writeFile filename content =
        let val fd = TextIO.openOut filename
            val _ = TextIO.output (fd, content) handle e => (TextIO.closeOut fd; raise e)
            val _ = TextIO.closeOut fd
        in () end

    fun translate_premises(tree,rule,id) = 
        let val new_trees = List.map(fn (_,_,tr) => tr)(apply_rule(([],[],tree),rule,id))
            val filtered = List.filter(fn (tr) => check_rule_of(tr,id))new_trees
        in
            (case filtered of 
                [] => writeFile "sml/test.sml" "NOT APPLICABLE"
                | x::rest => 
                    let val new_premises = List.map(fn (tr) => get_premises_of(tr,id)) filtered
                        val new_premises_strings = List.map (fn pr_list => List.map (seq_toString) pr_list) new_premises
                        val new_premises_strings2 = List.map (fn x => "{"^(List.foldl (fn (str1,str2) => str2^" ## "^str1) (List.hd(x)) (List.tl(x)))^"}") new_premises_strings
                        val final_form = "["^(List.foldl (fn (str1,str2) => str2^" && "^str1) (List.hd(new_premises_strings2)) (List.tl(new_premises_strings2)))^"]"
                    in 
                        writeFile "sml/test.sml" final_form
                    end)
        end
    
end
