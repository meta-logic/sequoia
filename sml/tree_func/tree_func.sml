structure treefuncImpl : TREEFUNC = struct

    open helpersImpl
    open datatypesImpl
    open applyunifierImpl
    open unifyImpl

    fun get_open_prems(DevTree(id, sq, NoRule, pq)) = [DevTree(id, sq, NoRule, pq)]
        | get_open_prems(DevTree(id, sq, rq, pq)) = List.concat (List.map get_open_prems pq)

    fun closed_tree(DevTree(id, sq, NoRule, pq)) = false
        | closed_tree(DevTree(id, sq, rq, pq)) = not (List.exists(fn p => not (closed_tree p))pq)

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
            fun bad_sub(CVs(_, Ctx(_, [])), _) = false
                | bad_sub(CVs(v1, Ctx(_, fl)), sequent) = 
                    List.exists(fn v2 => ctx_var_eq(v1,v2))(get_ctx_vars sequent)
                | bad_sub(_, _) = false
        in 
            List.filter(fn (sb,_) => not (List.exists(fn s => bad_sub(s,sequent))sb))sigcons
        end

    fun apply_rule((forms, cons, dt), rule, sid) =
        let 
            fun apply_rule_aux(DevTree(id, sq, NoRule, []), Rule(name, s, conc, premises), sid) =
                    if id <> sid then [(forms,NONE,DevTree(id, sq, NoRule, []))] else 
                    (case Unify_seq(conc, sq) of
                        SOME(sigscons) => 
                            let val new_sigscons = filter_bad_subs(sigscons,sq)
                                val next_ids = List.tabulate(List.length(premises), fn i => Int.toString(i))
                                val formulas = get_forms(conc)
                                val prems_ids = ListPair.zip(premises, next_ids)
                                val new_prems = List.map(fn (p, i) => DevTree(id^i,p,NoRule,[]))prems_ids
                            in
                                if List.length(new_sigscons) = 0 then [(forms,NONE,DevTree(id,sq,NoRule,[]))] else
                                List.map(fn (sg,cn) => let val frm = apply_formL_Unifier(formulas,sg) in
                                (forms @ frm,SOME(sg,cn), DevTree(id,sq,RuleName(name),new_prems)) end)new_sigscons
                            end
                        | NONE => [(forms,NONE,DevTree(id, sq, NoRule, []))])
                | apply_rule_aux(DevTree(id, sq, rq, pq), rule, sid) =
                    if id = sid then [(forms,NONE,DevTree(id, sq, rq, pq))] else
                    let val new_prems_list = apply_rule_list(pq, rule, sid) in
                    List.map(fn (frm, sgcn, new_p) => (forms @ frm, sgcn, DevTree(id, sq, rq, new_p)))new_prems_list end
            and apply_rule_list([], _, _) = []
                | apply_rule_list(DevTree(id, sq, rq, pq)::prems, rule, sid) = 
                    if not (String.isPrefix id sid) then 
                        let val new_prems_list = apply_rule_list(prems, rule, sid)
                        in List.map(fn (frm, sgcn, ps) => (forms @ frm, sgcn, DevTree(id, sq, rq, pq) :: ps))new_prems_list end
                    else 
                        let val all_devs = apply_rule_aux(DevTree(id, sq, rq, pq), rule, sid)
                        in List.map(fn (frm, sgcn, dv) => (forms @ frm, sgcn, dv :: prems))all_devs end
        in 
            List.map(fn (form, unif, dvt) => case unif of 
                SOME((sg,cn)) => (form, cons @ cn, apply_dev_tree_Unifier(dvt, sg))
                | NONE => (form, cons, dvt))(apply_rule_aux(dt, rule, sid))
        end

    fun apply_rule_everywhere((fm,cn,dt), rule) = 
        let val ids = List.map(fn DevTree(id,_,_,_)=> id)(get_open_prems dt)
        in
            List.foldl(fn (sid, tree_list) => 
                List.concat(List.map(fn tree => 
                    apply_rule(tree, rule, sid))tree_list))([(fm,cn,dt)])ids
        end

    fun apply_rule_all_ways((fm,cn,dt), rule, at_least_once) = 
        let val ids = List.map(fn DevTree(id,_,_,_)=> id)(get_open_prems dt)
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

end
