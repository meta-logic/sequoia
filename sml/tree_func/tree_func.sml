    (*  Sequoia  Copyright (C) 2020  Zan Naeem, Mohammed Hashim
    This program comes with ABSOLUTELY NO WARRANTY; for details see LICENSE.
    This is free software, and you are welcome to redistribute it
    under certain conditions; see LICENSE for details.
*)

structure treefuncImpl : TREEFUNC = struct


    structure H = helpersImpl
    structure Dat = datatypesImpl
    structure App = applyunifierImpl
    structure U = unifyImpl
    structure E = Equivalence
    structure Latex = latexImpl
    structure Html = htmlImpl
    structure Set = BinarySetFn(StringKey)


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
    type der_tree = Dat.der_tree


    val change_index : int -> unit = U.change_index

    val get_index : unit -> int = U.get_index

    
    fun get_tree_height (Dat.DerTree(_,_,_,[])) = 0
        | get_tree_height (Dat.DerTree(_,_,_,prs)) = (List.foldl  Int.max 0 (List.map (get_tree_height) prs)) +1

    fun get_open_prems(Dat.DerTree(id, sq, NONE, pq)) = [Dat.DerTree(id, sq, NONE, pq)]
        | get_open_prems(Dat.DerTree(id, sq, rq, pq)) = List.concat (List.map get_open_prems pq)

    fun closed_tree(Dat.DerTree(id, sq, NONE, pq)) = false
        | closed_tree(Dat.DerTree(id, sq, rq, pq)) = not (List.exists(fn p => not (closed_tree p))pq)

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

    fun get_form_vars(Dat.Form (_, fl)) = List.concat(List.map(get_form_vars)fl)
        | get_form_vars (f) = [f]

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
            fun bad_sub(Dat.CTXs(_, Dat.Ctx(vl, [])), _) = false
                | bad_sub(Dat.CTXs(v1, Dat.Ctx(_, fl)), sequent) = 
                    List.exists(fn v2 => Dat.ctx_var_eq(v1,v2))(get_ctx_vars sequent)
                | bad_sub(Dat.Fs(a1,_), sequent) = 
                    List.exists(fn a2 => Dat.form_eq(a1,a2))
                    (List.concat(List.map(get_form_vars)(get_forms sequent)))
                | bad_sub _ = false
        in 
            List.filter(fn (sb,_) => not (List.exists(fn s => bad_sub(s,sequent))sb))sigcons
        end
    

    fun get_premises_of(Dat.DerTree(id, _, _, []), sid) = []
        | get_premises_of(Dat.DerTree(id, _, _, pq), sid) = 
            if id = sid then List.map(fn Dat.DerTree(_, sq, _, _) => sq)pq
            else if not (String.isPrefix id sid) then []
            else List.foldl(fn (branch, premises) => premises @ (get_premises_of(branch,sid)))([])pq
    
    exception NotFound

    fun get_seq_of (Dat.DerTree(id,conc,_,[]),sid) = if id = sid then conc else raise NotFound
        | get_seq_of (Dat.DerTree(id,conc,_,pq),sid) = 
            if id = sid then conc
            else if not (String.isPrefix id sid) then raise NotFound
            else let
                    val child = (Option.valOf 
                    (List.find (fn Dat.DerTree(pid,_,_,_) => (String.isPrefix pid sid)) pq) )
                    handle (Option) => raise NotFound
                                
                in
                    get_seq_of (child,sid)
                end

    fun check_rule_of(_,Dat.DerTree(id, _, NONE, pq), sid) = not (id = sid)
        | check_rule_of(cn, Dat.DerTree(id, _, rq, pq), sid) = if id = sid then true 
        else if not (String.isPrefix id sid) then true
        else List.foldl(fn (branch, bools) => bools andalso (check_rule_of(cn, branch,sid)))(true)pq

    (* (List.map (fn Dat.CtxVar(_,x) => x) (get_ctx_vars base))@ (List.concat(List.map tree_to_vars prems)) *)

    fun tree_to_vars' (Dat.DerTree(_,base,_,prems),set) = 
        let
            val new_set = List.foldr tree_to_vars' set prems
            val base_vars = List.map (fn Dat.CtxVar(_,x) => x) (get_ctx_vars base)
        in
            List.foldr Set.add' new_set base_vars
        end

    fun tree_to_vars (tree:Dat.der_tree): string list =  
        let
            val final_set = tree_to_vars' (tree,Set.empty)
        in
            Set.listItems(final_set)
        end


    (*  *)
    fun apply_rule((forms, cons, dt), rule, sid) =
        let 
            fun apply_rule_aux( Dat.DerTree(id, sq, NONE, []), Dat.Rule(name, s, conc, premises), sid) =
                    if id <> sid then [(forms,NONE, Dat.DerTree(id, sq, NONE, []))] else 
                    (case U.Unify_seq(conc, sq) of
                        SOME(sigscons) => 
                            let val formulas = get_forms(conc)
                                val new_sigscons = filter_bad_subs(sigscons,sq)
                                (* val _ = print("[" ^ (String.concatWith (" OR ")(List.map(fn a => "("^(String.concatWith ("; ")a) ^")")
                                        (List.map(fn (a,b) => a)(U.print_sigs_cons (SOME new_sigscons))))) ^ "]")
                                val _ = print ((Int.toString (List.length(sigscons)))^" to "^(Int.toString (List.length(new_sigscons)))^"\n") *)
                                val next_ids = List.tabulate(List.length(premises), fn i => Int.toString(i))
                                val prems_ids = ListPair.zip(premises, next_ids)
                                val new_prems = List.map(fn (p, i) => Dat.DerTree(id^i,p, NONE,[]))prems_ids
                            in
                                if List.length(new_sigscons) = 0 then [(forms,NONE, Dat.DerTree(id,sq, NONE,[]))] else
                                List.map(fn (sg,cn) => let val frm = App.apply_formL_Unifier(formulas,sg) in
                                (forms @ frm,SOME(sg,cn), Dat.DerTree(id,sq,SOME(name),new_prems)) end)new_sigscons
                            end
                        | NONE => [(forms,NONE, Dat.DerTree(id, sq, NONE, []))])
                | apply_rule_aux( Dat.DerTree(id, sq, rq, pq), rule, sid) =
                    if id = sid then [(forms,NONE, Dat.DerTree(id, sq, rq, pq))] else
                    let val new_prems_list = apply_rule_list(pq, rule, sid) in
                    List.map(fn (frm, sgcn, new_p) => (forms @ frm, sgcn,  Dat.DerTree(id, sq, rq, new_p)))new_prems_list end
            and apply_rule_list([], _, _) = []
                | apply_rule_list( Dat.DerTree(id, sq, rq, pq)::prems, rule, sid) = 
                    if not (String.isPrefix id sid) then 
                        let val new_prems_list = apply_rule_list(prems, rule, sid)
                        in List.map(fn (frm, sgcn, ps) => (forms @ frm, sgcn,  Dat.DerTree(id, sq, rq, pq) :: ps))new_prems_list end
                    else 
                        let val all_devs = apply_rule_aux( Dat.DerTree(id, sq, rq, pq), rule, sid)
                        in List.map(fn (frm, sgcn, dv) => (forms @ frm, sgcn, dv :: prems))all_devs end
            (* fun print_seq (Dat.DerTree(_,sq,_,_)) = print(Dat.seq_toString(sq)) *)
        in 
            List.map   (fn (form, unif, dvt) => case unif of 
                SOME((sg,cn)) => (form, (App.apply_constraintL_Unifier (cons,sg)) @ cn, (App.apply_der_tree_Unifier(dvt, sg)))
                | NONE => (form, cons, dvt))   (apply_rule_aux(dt, rule, sid))
        end

    fun apply_rule_everywhere((fm,cn,dt), rule) = 
        let val ids = List.map(fn  Dat.DerTree(id,_,_,_)=> id)(get_open_prems dt)
        in
            List.foldl(fn (sid, tree_list) => 
                List.concat(List.map(fn tree => 
                    apply_rule(tree, rule, sid))tree_list))([(fm,cn,dt)])ids
        end


    
    
    fun apply_rule_all_ways((fm,cn,dt), rule, at_least_once) = 
        let val ids = List.map(fn  Dat.DerTree(id,_,_,_)=> id)(get_open_prems dt)
            val num = if at_least_once then 1 else 0
            val rng = if at_least_once then 0 else 1
            val (id_sets, _) = 
                ListPair.unzip (List.concat(
                List.tabulate(List.length(ids)+rng, fn i => 
                H.chooseK (ids,i+num,fn(a,b)=>a=b))))
            (* val _ = print "\n___________________________________________________\n\n\n"
            val _ = print ("ids: "^(ListFormat.listToString (fn x => x) (ids))^"________\n" ) *)

            fun check_applied (ids_needed, tree) = 
                let
                    val tree_open_ids = List.map(fn  Dat.DerTree(id,_,_,_)=> id) (get_open_prems tree)
                    val res = true
                    val res = List.all (fn id => not (List.exists (fn tree_id => id=tree_id) tree_open_ids)) ids_needed
                in
                    res
                end
            
        in
            List.concat(List.map (fn id_set =>  
                List.filter 
                (fn (_,_,tree) => check_applied(id_set,tree))
                (List.foldl(fn (sid, tree_list) => 
                    List.concat(List.map(fn tree =>
                        apply_rule(tree, rule, sid))tree_list))
                        ([(fm,cn,dt)])id_set) )  (id_sets) )
        end

    fun apply_multiple_rules_all_ways(dt, []) = [dt]
        | apply_multiple_rules_all_ways(dt, rule_ls) = 
        List.concat (List.map(fn perm => 
            List.foldl(fn (rule, tree_ls) => 
                List.concat(List.map(fn tree => apply_rule_all_ways(tree, rule, false))tree_ls)
            )(apply_rule_all_ways(dt, List.hd perm, true))(List.tl perm))
        (H.permutations(rule_ls)))

    fun writeFD fd content = 
        let
            val out = Posix.FileSys.wordToFD (SysWord.fromInt(fd))
            val text = Word8VectorSlice.full (Byte.stringToBytes(content))
            val _ = Posix.IO.writeVec(out,text)
        in () end

    (*taken from: https://stackoverflow.com/questions/33597175/how-to-write-to-a-file-in-sml*)
	fun writeFile filename content =
        let val fd = TextIO.openOut filename
            val _ = TextIO.output (fd, content) handle e => (TextIO.closeOut fd; raise e)
            val _ = TextIO.closeOut fd
        in () end

    fun filter_constraints (cons) = List.filter (fn (_,l1,l2) => not (H.mset_eq(l1,l2,Dat.ctx_var_eq)) ) cons

    fun translate_premises' fd (constraints,tree,rule,id,index) = 
        let val () = change_index(index)
            val new_trees = List.map(fn (_,cn,tr) => (cn, tr))(apply_rule(([],constraints,tree),rule,id))
            val filtered = List.filter(fn (cn, tr) => check_rule_of(cn,tr,id))new_trees
            (* val Dat.DerTree (_,temp_conc,_,_) = tree
            val pre_conc = (get_seq_of(tree,id)) handle (NotFound) => temp_conc
            fun update_cons (cn,tr) = 
                let
                    val tree_conc = (get_seq_of(tr,id)) handle (NotFound) => temp_conc
                    val new_cons = (E.extract_constraints(pre_conc,tree_conc))
                    val new_cons = filter_constraints new_cons
                in
                    (new_cons@cn,tr)
                end *)
        in
            (case filtered of 
            [] => writeFD fd "NOT APPLICABLE"
            | _ => 
                let 
                    (* val filtered = List.map (update_cons) filtered *)
                    val new_premises = List.map(fn (cn, tr) => (cn, Latex.der_tree_toLatex(tr), Html.der_tree_toHtml(tr), tr, get_premises_of(tr,id))) filtered 
                    
                    fun hd (l) = List.hd(l) handle (List.Empty) => ""
                    fun tl (l) = List.tl(l) handle (List.Empty) => []
                in
                    let val new_premises_strings = List.map (fn (cn_list, latex_tree, html_tree, sml_tree, pr_list) => 
                            (List.map (Dat.const_toString) cn_list, List.map (Dat.const_stringify) cn_list, List.map (Dat.seq_toString) pr_list, tree_to_vars(sml_tree), latex_tree, html_tree, Html.der_tree_toHtml2(sml_tree))) new_premises
                        val new_premises_strings2 = List.map (fn (c, z, p, v, l, h, s): (string list * string list * string list * string list * string * string * string) => 
                                "{"^(String.concatWith ("##")c)^"%%["^(String.concatWith (",")z)^"]}@@"^
                                "{"^(String.concatWith ("##")p)^"%%"^l^"%%"^h^"%%"^s^"}@@"^
                                "{"^(String.concatWith ("##")v)^"}@@"^
                                "{"^(Int.toString(get_index()))^"}"
                                )new_premises_strings
                        val final_form = "["^(List.foldl (fn (str1,str2) => str1^" && "^str2) (List.hd(new_premises_strings2)) (List.tl(new_premises_strings2)))^"]"
                    in 
                        writeFD fd final_form
                    end
                end)
        end
    fun update_cut_rule (Dat.Rule(name,side,conc,prems),sub) = 
        let
            val sub_l = sub
            val new_conc = App.apply_seq_Unifier (conc,sub_l)
            val new_prems = List.map (fn prem => App.apply_seq_Unifier (prem,sub_l)) prems
        in
            Dat.Rule(name,side,new_conc,new_prems)
        end

    fun translate_premises_cut' fd (constraints, tree, rule, id , index, sub) = 
        let
            val new_rule = update_cut_rule (rule,sub) 
        in
            translate_premises' fd (constraints,tree,new_rule,id,index)
        end

    fun translate_premises (input) = translate_premises_cut' 3 input

end


