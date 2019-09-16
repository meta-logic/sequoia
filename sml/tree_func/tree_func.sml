    structure treefuncImpl : TREEFUNC = struct


    structure H = helpersImpl
    structure Dat = datatypesImpl
    structure App = applyunifierImpl
    structure U = unifyImpl


    type conn = Dat.conn
    type form = Dat.form
    type ctx_var = Dat.ctx_var
    type ctx = Dat.ctx
    type ctx_struct = Dat.ctx_struct
    type seq = Dat.seq
    type side = Dat.side
    type rule = Dat.rule
    type sub = Dat.sub
    type rule_name = Dat.rule_name
    type dev_tree = Dat.dev_tree


    
    fun get_tree_height (Dat.DevTree(_,_,_,[])) = 0
        | get_tree_height (Dat.DevTree(_,_,_,prs)) = (List.foldl  Int.max 0 (List.map (get_tree_height) prs)) +1

    fun get_open_prems(Dat.DevTree(id, sq,  Dat.NoRule, pq)) = [Dat.DevTree(id, sq,  Dat.NoRule, pq)]
        | get_open_prems(Dat.DevTree(id, sq, rq, pq)) = List.concat (List.map get_open_prems pq)

    fun closed_tree(Dat.DevTree(id, sq,  Dat.NoRule, pq)) = false
        | closed_tree(Dat.DevTree(id, sq, rq, pq)) = not (List.exists(fn p => not (closed_tree p))pq)

    fun atomic_transform(Dat.Seq(l,c,r)) = 
        let
            fun form_trans (Dat.Atom(a)) = Dat.Atom(a)
                | form_trans (Dat.AtomVar(a)) = Dat.Atom(a)
                | form_trans (Dat.FormVar(a)) = Dat.Atom(a)
                | form_trans (Dat.Form(c, l)) = Dat.Form(c,subforms_trans(l))
            and subforms_trans (nil) = []
                | subforms_trans (x::l) = form_trans(x)::subforms_trans(l)
            fun ctx_struct_trans(Dat.Empty) = Dat.Empty
                | ctx_struct_trans(Dat.Single (Dat.Ctx (vl,fl))) = 
                    Dat.Single (Dat.Ctx (vl,List.map(fn f => form_trans(f))fl))
                | ctx_struct_trans(Dat.Mult (c, Dat.Ctx(vl,fl), rest)) = 
                    Dat.Mult (c, Dat.Ctx(vl,List.map(fn f => form_trans(f))fl), rest)
        in
            Dat.Seq(ctx_struct_trans l, c, ctx_struct_trans r)
        end

    fun get_forms(Dat.Seq (l,_,r)) = 
        let 
            fun get_forms_aux(Dat.Empty) = []
                | get_forms_aux(Dat.Single (Dat.Ctx (_,fl))) = fl
                | get_forms_aux(Dat.Mult (_, Dat.Ctx(_,fl), rest)) = fl @ get_forms_aux(rest)
        in (get_forms_aux l) @ (get_forms_aux r) end

    fun get_ctx_vars(Dat.Seq (l,_,r)) = 
        let 
            fun get_ctx_vars_aux(Dat.Empty) = []
                | get_ctx_vars_aux(Dat.Single (Dat.Ctx (vl,_))) = vl
                | get_ctx_vars_aux(Dat.Mult (_, Dat.Ctx(vl,_), rest)) = vl @ get_ctx_vars_aux(rest)
        in (get_ctx_vars_aux l) @ (get_ctx_vars_aux r) end

    fun filter_bad_subs(sigcons, sequent) =
        let 
            fun bad_sub(Dat.CVs(_, Dat.Ctx(_, [])), _) = false
                | bad_sub(Dat.CVs(v1, Dat.Ctx(_, fl)), sequent) = 
                    List.exists(fn v2 => Dat.ctx_var_eq(v1,v2))(get_ctx_vars sequent)
                | bad_sub(_, _) = false
        in 
            List.filter(fn (sb,_) => not (List.exists(fn s => bad_sub(s,sequent))sb))sigcons
        end

    fun get_premises_of(DevTree(id, _, _, []), sid) = []
        | get_premises_of(DevTree(id, _, _, pq), sid) = 
            if id = sid then List.map(fn DevTree(_, sq, _, _) => sq)pq
            else if not (String.isPrefix id sid) then []
            else List.foldl(fn (branch, premises) => premises @ (get_premises_of(branch,sid)))([])pq

    fun check_rule_of(DevTree(id, _, NoRule, pq), sid) = not (id = sid)
        | check_rule_of(DevTree(id, _, rq, pq), sid) = if id = sid then true 
        else if not (String.isPrefix id sid) then true
        else List.foldl(fn (branch, bools) => bools andalso (check_rule_of(branch,sid)))(true)pq

    fun apply_rule((forms, cons, dt), rule, sid) =
        let 
            fun apply_rule_aux( Dat.DevTree(id, sq,  Dat.NoRule, []), Dat.Rule(name, s, conc, premises), sid) =
                    if id <> sid then [(forms,NONE, Dat.DevTree(id, sq,  Dat.NoRule, []))] else 
                    (case U.Unify_seq(conc, sq) of
                        SOME(sigscons) => 
                            let val new_sigscons = filter_bad_subs(sigscons,sq)
                                val next_ids = List.tabulate(List.length(premises), fn i => Int.toString(i))
                                val formulas = get_forms(conc)
                                val prems_ids = ListPair.zip(premises, next_ids)
                                val new_prems = List.map(fn (p, i) =>  Dat.DevTree(id^i,p, Dat.NoRule,[]))prems_ids
                            in
                                if List.length(new_sigscons) = 0 then [(forms,NONE, Dat.DevTree(id,sq, Dat.NoRule,[]))] else
                                List.map(fn (sg,cn) => let val frm = App.apply_formL_Unifier(formulas,sg) in
                                (forms @ frm,SOME(sg,cn),  Dat.DevTree(id,sq,Dat.RuleName(name),new_prems)) end)new_sigscons
                            end
                        | NONE => [(forms,NONE, Dat.DevTree(id, sq,  Dat.NoRule, []))])
                | apply_rule_aux( Dat.DevTree(id, sq, rq, pq), rule, sid) =
                    if id = sid then [(forms,NONE, Dat.DevTree(id, sq, rq, pq))] else
                    let val new_prems_list = apply_rule_list(pq, rule, sid) in
                    List.map(fn (frm, sgcn, new_p) => (forms @ frm, sgcn,  Dat.DevTree(id, sq, rq, new_p)))new_prems_list end
            and apply_rule_list([], _, _) = []
                | apply_rule_list( Dat.DevTree(id, sq, rq, pq)::prems, rule, sid) = 
                    if not (String.isPrefix id sid) then 
                        let val new_prems_list = apply_rule_list(prems, rule, sid)
                        in List.map(fn (frm, sgcn, ps) => (forms @ frm, sgcn,  Dat.DevTree(id, sq, rq, pq) :: ps))new_prems_list end
                    else 
                        let val all_devs = apply_rule_aux( Dat.DevTree(id, sq, rq, pq), rule, sid)
                        in List.map(fn (frm, sgcn, dv) => (forms @ frm, sgcn, dv :: prems))all_devs end
        in 
            List.map(fn (form, unif, dvt) => case unif of 
                SOME((sg,cn)) => (form, cons @ cn, App.apply_dev_tree_Unifier(dvt, sg))
                | NONE => (form, cons, dvt))(apply_rule_aux(dt, rule, sid))
        end

    fun apply_rule_everywhere((fm,cn,dt), rule) = 
        let val ids = List.map(fn  Dat.DevTree(id,_,_,_)=> id)(get_open_prems dt)
        in
            List.foldl(fn (sid, tree_list) => 
                List.concat(List.map(fn tree => 
                    apply_rule(tree, rule, sid))tree_list))([(fm,cn,dt)])ids
        end

    fun apply_rule_all_ways((fm,cn,dt), rule, at_least_once) = 
        let val ids = List.map(fn  Dat.DevTree(id,_,_,_)=> id)(get_open_prems dt)
            val num = if at_least_once then 1 else 0
            val rng = if at_least_once then 0 else 1
            val (id_sets, _) = 
                ListPair.unzip (List.concat(
                List.tabulate(List.length(ids)+rng, fn i => 
                H.chooseK (ids,i+num,fn(a,b)=>a=b))))
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
        (H.permutations(rule_ls)))

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
