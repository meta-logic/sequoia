structure StringKey:ORD_KEY =
struct
    type ord_key = string
    val compare = String.compare
end

structure Properties : PROPERTIES =
struct
    structure D = datatypesImpl
    structure Dat = D
    structure H = helpersImpl

    structure T = treefuncImpl
    structure Latex = latexImpl
    structure App = applyunifierImpl
    structure U = unifyImpl
    structure E = Equivalence
    structure Set = SplaySetFn(StringKey);

    type constraint = D.ctx_var * (D.ctx_var list) * (D.ctx_var list)



    val other_fresh = ref 1000000;
    val term_fresh = ref 10000;
    val fresher = ref 1;
    val rule_fresh = fresher
    val var_index = fresher

    fun generic_seq( D.Seq(a, c, b)) =
        let
            fun gen_out(D.Empty) = D.Empty
                | gen_out(D.Single(D.Ctx(vl,fl))) =
                let val () = () in other_fresh := !other_fresh + 1;
                D.Single(D.Ctx([D.CtxVar ("Gamma_{" ^ Int.toString(!other_fresh)^"}")],nil)) end
                | gen_out(D.Mult(con,D.Ctx(vl,fl),rest)) =
                let val () = () in other_fresh := !other_fresh + 1;
                D.Mult(con,D.Ctx([D.CtxVar ("Gamma_{" ^ Int.toString(!other_fresh)^"}")],nil),gen_out rest) end
        in
             D.Seq(gen_out a, c, gen_out b)
        end



    fun fresh'(x:string):string = (x ^"^{p"^ (Int.toString(!var_index)) ^"}")

    val hat::_ = String.explode("^")

    fun remove_hat' (nil) = nil
        |remove_hat' (x::L) = (case (x=hat) of true => [] | false => x::remove_hat'(L))

    fun remove_hat (x) = String.implode(remove_hat'(String.explode(x)))
    (* nuke version *)
    fun fresh(x:string):string = fresh'(remove_hat(x))

    fun string_to_fresh(x) = fresh(x)

    fun update_string (x) = string_to_fresh(x)

    fun ctx_var_to_fresh(D.CtxVar(x)) = D.CtxVar(string_to_fresh(x)) before (fresher := !fresher + 1)

    fun ctx_to_fresh(D.Ctx(ctx_vars,forms)) = D.Ctx(List.map ctx_var_to_fresh ctx_vars,forms)

    fun ctx_struct_to_fresh(D.Empty) = D.Empty
        | ctx_struct_to_fresh (D.Single (ctx)) = D.Single(ctx_to_fresh(ctx))
        | ctx_struct_to_fresh (D.Mult (con,ctx,ctx_struct)) = D.Mult(con,ctx_to_fresh(ctx),ctx_struct_to_fresh(ctx_struct))

    fun seq_to_fresh(D.Seq(ctx_s,con,ctx_s2)) = D.Seq(ctx_struct_to_fresh(ctx_s),con,ctx_struct_to_fresh(ctx_s2))

    

    fun update_ctx_var (Dat.CtxVar(x)) = Dat.CtxVar(update_string(x))

    fun update_form (Dat.Atom(x)) = Dat.Atom(x)
        | update_form (Dat.AtomVar(x)) = Dat.AtomVar(update_string(x))
        | update_form (Dat.FormVar(x)) = Dat.FormVar(update_string(x))
        | update_form (Dat.Form(c,forms)) = Dat.Form(c, List.map update_form forms)

    fun update_ctx (Dat.Ctx(ctx_vars,forms)) = Dat.Ctx(List.map update_ctx_var ctx_vars,List.map update_form forms)

    fun update_ctx_struct (Dat.Empty) = Dat.Empty
        | update_ctx_struct (Dat.Single(ctx)) = Dat.Single(update_ctx(ctx))
        | update_ctx_struct (Dat.Mult(conn,ctx,ctx_strct)) = Dat.Mult(conn,update_ctx(ctx), update_ctx_struct(ctx_strct))

    fun update_seq (Dat.Seq(l,conn,r)) = Dat.Seq(update_ctx_struct(l),conn,update_ctx_struct(r))

    fun update_rule (Dat.Rule(nm,side,conc,prems)) =
        let
            val new_conc = update_seq(conc)
            val new_prems = List.map update_seq prems
            val _ = rule_fresh := ((!rule_fresh) + 1)
        in
            Dat.Rule(nm,side,new_conc,new_prems)
        end
    


    fun print_seq_list (nil) = print "\n_______________________________\n"
        | print_seq_list (x::L) = let
            val _ = print (D.seq_toString(x)^"\n")
        in
            print_seq_list(L)
        end

    fun get_ctx_var_ctx (D.Ctx(A,_)) = A

    fun get_ctx_var_ctx_struct (D.Empty) = []
        | get_ctx_var_ctx_struct (D.Single (ctx)) = get_ctx_var_ctx ctx
        | get_ctx_var_ctx_struct (D.Mult (_,ctx,ctx_struct)) = get_ctx_var_ctx(ctx)@get_ctx_var_ctx_struct(ctx_struct)

    fun get_ctx_var_seq ( D.Seq(A,_,B)) = get_ctx_var_ctx_struct(A)@get_ctx_var_ctx_struct(B)

    fun get_ctx_vars_der_tree (D.DerTree(_,S,_,L)) = get_ctx_var_seq(S)@get_ctx_vars_der_tree_list(L)
    and get_ctx_vars_der_tree_list ([]) = []
        |get_ctx_vars_der_tree_list (D::L) = get_ctx_vars_der_tree(D)@get_ctx_vars_der_tree_list(L)

    fun get_ctx_vars_from_constraint((_,A,B)) = A@B

    fun get_ctx_vars_from_constraints(nil) = []
        |get_ctx_vars_from_constraints(x::L) = get_ctx_vars_from_constraint(x)@get_ctx_vars_from_constraints(L)



    fun check_premises'((cn1,dvt1),(cn2,dvt2),weak) =
        let
            val D.DerTree(_,sq1,_,_) = dvt1
            val D.DerTree(_,sq2,_,_) = dvt2
            val t1_prems = List.map (fn (D.DerTree(_,seq,_,_)) => seq) (T.get_open_prems(dvt1))
            val t2_prems = List.map (fn (D.DerTree(_,seq,_,_)) => seq) (T.get_open_prems(dvt2))
            (*val goal = create_constraint(sq1,sq2)*)
            val constraints = cn1@cn2
            (*val _ = last1 := dvt1*)
            (*val _ = last2 := dvt2*)
            val t1_vars = List.map (fn (D.CtxVar(x))=>x) (get_ctx_vars_der_tree(dvt1)@get_ctx_vars_from_constraints(cn1))
            val t2_vars = List.map (fn (D.CtxVar(x))=>x) (get_ctx_vars_der_tree(dvt2)@get_ctx_vars_from_constraints(cn2))
            val t1_vars = Set.listItems(Set.addList(Set.empty,t1_vars))
            val t2_vars = Set.listItems(Set.addList(Set.empty,t2_vars))
            val t1_vars = List.map (fn x => D.CtxVar(x)) t1_vars
            val t2_vars = List.map (fn x => D.CtxVar(x)) t2_vars
(*            val _ = print_seq_list(t1_prems)
            val _ = print_seq_list(t2_prems)
            val _ = print ("\n\n\n")*)
            val res = E.check_premises_wk(t1_prems,t2_prems,constraints,weak,t1_vars,t2_vars)
            (*val _ = if res then print("true\n\n\n\n\n\n\n") else print("false\n\n\n\n\n\n\n")*)
        in
            res
        end



(*
        fun weak_admissability(rules) =
            let val D.Rule(name, side, sequent, premises) = List.hd(rules)
                val general = generic_seq sequent
                val term = let val () = () in term_fresh := !term_fresh + 1;
                        D.Form(Int.toString !term_fresh) end
                fun add_term_ctx_struct(D.Empty, term) = [D.Empty]
                    | add_term_ctx_struct(D.Single(D.Ctx(vl,fl)), term) = [D.Single(D.Ctx(vl,fl@term))]
                    | add_term_ctx_struct(D.Mult(con,D.Ctx(vl,fl),rest), term) =
                        let val beginning = D.Mult(con,D.Ctx(vl,fl@term),rest)
                            val ladder = List.map(fn r =>  D.Mult(con,D.Ctx(vl,fl), r))(add_term_ctx_struct rest)
                        in beginning :: ladder end
                fun add_term_seq( D.Seq(l,c,r), term) =
                    List.map(fn strct =>  D.Seq(strct,c,r))(add_term_ctx_struct(l,term))
                    @ List.map(fn strct =>  D.Seq(l,c,strct))(add_term_ctx_struct(r,term))
                fun get_start(D.Rule(nm, sd, sq, pm), gen) =
                    (case U.Unify_seq(gen, sq) of NONE => NONE
                    | SOME(sgcn) => SOME(List.hd(List.map(fn (sg,cn) => App.apply_seq_Unifier(gen,sg))sgcn)))
                fun check(rule, st, term) = (case st of NONE => false | SOME(start) =>
                    let
                    val premises_ls = List.map (fn tree => get_open_prems tree)
                        (apply_rule(([],[],D.DerTree("0",start,D.NoRule,[])), rule, "0"))
                    val start_added = add_term_seq(start,term)
                    val s = List.map(fn nsq => get_start(rule, nsq))start_added
                    in
                    s
                    end)
            in
            true
            end
                     *)
(*
    fun empty_out_ctx(D.Empty) = D.Empty
        | empty_out_ctx(D.Single(D.Ctx(vl,fl))) = D.Single(D.Ctx(nil,fl))
        | empty_out_ctx(D.Mult(con,D.Ctx(vl,fl),rest)) = D.Mult(con,D.Ctx(nil,fl),empty_out_ctx rest)

    fun empty_out_seq( D.Seq(a, c, b)) =  D.Seq(empty_out_ctx a, c, empty_out_ctx b)

    fun init_coherence(con_form, rulesL, rulesR, init_rule_ls) =
        let
            fun init_coh_aux(con_form, rules1, rules2, init_rule_ls) =
                let val start_seqs =
                            List.map(fn D.Rule(name_init, side_init, conc_init, premises_init) =>
                                let val form_subs = List.map(fn frm => Fs(frm, con_form))(get_forms(conc_init))
                                    val new_sq = T.atomic_transform
                                    (App.apply_seq_Unifier(empty_out_seq conc_init, form_subs))
                                in (D.DerTree("0",new_sq,D.NoRule,[])) end)init_rule_ls
                    val fst_apply =
                            List.foldl(fn (tree, ls) =>
                                apply_multiple_rules_all_ways(([], [], tree), rules1) @ ls
                            )([])start_seqs
                    val snd_apply =
                            List.foldl(fn ((_, constraints, tree), ls) =>
                                apply_multiple_rules_all_ways(([], constraints, tree), rules2) @ ls
                            )([])fst_apply
                    val init_apply =
                            List.foldl(fn ((_, constraints, tree), ls) =>
                                apply_multiple_rules_all_ways(([], constraints, tree), init_rule_ls) @ ls
                            )([])snd_apply
                in
                    List.exists(fn (fm,_,dt) => closed_tree dt
                    andalso
                    List.all(fn f => form_larger(con_form, f))fm)init_apply

                end
        in
            init_coh_aux(con_form, rulesL, rulesR, init_rule_ls)
            orelse
            init_coh_aux(con_form, rulesR, rulesL, init_rule_ls)
        end *)

    (* checks if the init coherence property holds for a specific connective, with specific left, right, and init rules*)
    (*  *)

    fun atomize(Dat.Atom(x)) = Dat.Atom(x)
      | atomize(Dat.AtomVar(x)) = Dat.Atom(x)
      | atomize(Dat.FormVar(x)) = Dat.Atom(x)
      | atomize(Dat.Form(con,forms)) = Dat.Form(con, List.map atomize forms)

    fun atomize_context_struct (Dat.Empty) = Dat.Empty
      | atomize_context_struct (Dat.Single(Dat.Ctx(v,forms))) = Dat.Single(Dat.Ctx(v,List.map atomize forms))
      | atomize_context_struct (Dat.Mult(con,Dat.Ctx(v,forms),ctx_struct)) = Dat.Mult(con,
                                             Dat.Ctx(v,List.map atomize forms)
                                            ,atomize_context_struct(ctx_struct))

    fun atomize_seq (Dat.Seq(A,con,B)) = Dat.Seq(atomize_context_struct(A),con,atomize_context_struct(B))

    fun atomize_rule (Dat.Rule(name,side,conc,prems)) = Dat.Rule(name,side,atomize_seq(conc),List.map atomize_seq prems)


    fun subformula (A, D.Form(_,subforms) ) = List.exists (fn x => D.form_eq(A,x) orelse subformula(A,x)) subforms
        | subformula (_,_) = false



    (* check which formula  *)
    fun init_coherence_con ((con_form:Dat.form, rulesL: Dat.rule list, rulesR: Dat.rule list), init_rule: Dat.rule, axioms: Dat.rule list)=
        let
            val Dat.Rule (_,_,init_conc,_) = init_rule
            (* changing names of context variables in rule and conclusion of rule *)
            val init_rule = update_rule(init_rule)
            (* val init_rule = atomize_rule(init_rule) *)



            val init_conc = seq_to_fresh(init_conc)

            val con_form = atomize(con_form)

            (* changing forms of the init rule to con_form *)
            fun replace_forms_ctx (Dat.Ctx(vars,forms)) =
                (case forms of
                   [] => Dat.Ctx(vars,[])
                 | [_] => Dat.Ctx(vars,[con_form])
                 | _ => let val _ = print("init rule with multiple forms") in Dat.Ctx(vars,[con_form]) end)
            fun replace_forms' (Dat.Empty) = Dat.Empty
                | replace_forms' (Dat.Single(ctx)) = Dat.Single(replace_forms_ctx(ctx))
                | replace_forms' (Dat.Mult(con,ctx,rest)) = Dat.Mult(con,replace_forms_ctx(ctx),replace_forms'(rest))

            fun replace_forms(Dat.Seq(a,con,b)) = Dat.Seq(replace_forms'(a),con,replace_forms'(b))

            val base = Dat.DerTree("0",replace_forms(init_conc),Dat.NoRule,[])

            (* testing if init rule can be applied to base *)

            val (_,_,test) = List.hd(T.apply_rule_everywhere(([],[],base),init_rule))
            
            val res = []
            fun stack (base,rules1,rules2,init) =
                let
                  (* applying 1 rule from rule1 to base *)
                  val r1 = List.map (fn x => T.apply_rule_everywhere(([],[],base),x)) rules1
                  val r1 = List.concat r1
                  (* applying every rule from rule 2 to each tree from r1 *)
                  (* val r2 = List.foldl (fn (rule2,trees) => List.concat (List.map (fn x => T.apply_rule_all_ways(x,rule2,false)) trees)) r1 rules2  *)
                  val r2 = List.concat (List.map (fn x => T.apply_multiple_rules_all_ways(x,rules2)) r1)

                in
                  r2
                end


            val rules_applied = stack(base,rulesL,rulesR,init_rule) @ stack(base,rulesR,rulesL,init_rule)

            
            (* filtering out trees where only 1 rule applied, then trees with open premises*)
            val axioms_applied = (case List.length(axioms) of
               0 => rules_applied
             | _ => List.concat (List.map (fn x => T.apply_multiple_rules_all_ways(x,axioms)) rules_applied))
            
            val init_applied = List.concat (List.map (fn (_,_,x) => T.apply_rule_everywhere(([],[],x),init_rule) ) axioms_applied)

            val init_applied_trees = List.filter (fn (forms,_,_)=> List.all (fn x => subformula (x,con_form) ) forms )  (init_applied)
            val init_applied_trees = List.map (fn (_,cons,tree) => (cons,tree)) init_applied_trees

            val both_applied = List.filter (fn (_,x) => T.get_tree_height(x) >1) init_applied_trees
            val no_open_prems = List.filter (fn (_,x) => (case T.get_open_prems(x) of
                                                    _::_ => false
                                                  | _ => true)) both_applied
            val res = no_open_prems
            (*  *)
        in
            (* rules_applied *)
            (case res of
               x::_ => (true,(test, SOME x))
             | _ => (false,(test, NONE)))
        end

    fun init_coherence_mult_init ((forms,rulesL,rulesR), init_rules, axioms) = 
        let
            val results = List.map (fn rule => init_coherence_con((forms,rulesL,rulesR),rule,axioms)) init_rules
        in
            (case List.find (fn (x,_) => x) results of
               SOME x => x
             | NONE => List.hd(results) )
        end

    fun init_coherence ([]: (Dat.form *Dat.rule list * Dat.rule list) list,_: Dat.rule list,_: Dat.rule list):bool = true
      | init_coherence (first_con::con_list,init_rules,axioms) = 
        let
            val rest = init_coherence(con_list,init_rules,axioms)
            val (result,_) = init_coherence_mult_init(first_con,init_rules,axioms) 
        in
          result andalso rest
        end


        

    




    (*  *)
    fun weakening_rule_context (rule: (Dat.rule) , (side,context_num) : Dat.side * int) = 
        let

            val res = false
            val weak_form = Dat.Atom "weakening"

            fun add_to_ctx(Dat.Empty,1) = Dat.Empty
                | add_to_ctx(Dat.Single(Dat.Ctx(vars,forms)),1) = Dat.Single(Dat.Ctx(vars,weak_form::forms))
                | add_to_ctx(Dat.Mult(con,ctx as Dat.Ctx(vars,forms),rest),index) = 
                    (case Int.compare(index,1) of
                        EQUAL => Dat.Mult(con,Dat.Ctx(vars,weak_form::forms),rest)
                        | GREATER => Dat.Mult(con,ctx,add_to_ctx(rest,index-1))
                        (* if it fails, then changing nothing would still cause it to return false *)
                        | LESS => Dat.Mult(con,ctx,rest))
                | add_to_ctx (a,_) = a

            fun add_to_seq (s as Dat.Seq(L,con,R)) = 
                (case side of
                   Dat.Left => Dat.Seq(add_to_ctx(L,context_num),con,R)
                 | Dat.Right => Dat.Seq(L,con,add_to_ctx(R,context_num))
                 | _ => s)

            fun make_weak_bool (side,context_num) = 
                let
                    
                    fun add_false (1,list) = list
                        | add_false (n , list) = (case Int.compare(n,1) of GREATER => add_false(n-1,false::list) | _ => [])
                    val res = add_false(context_num,[true]) 
                in
                    (case side of D.Right => ([],res) | D.Left => (res,[]) | _ => ([],[]))
                end


            
            val Dat.Rule(_,_,base,_) = rule
            val base = atomize_seq(base)
            val rule = update_rule(rule)
            val base2 = add_to_seq(base)
            val rule_applied_list = List.map (fn (_,cons,tree) => (cons,tree)) (T.apply_rule(([],[],D.DerTree("0",base,Dat.NoRule,[])),rule,"0"))
            val rule_applied_list_weak = List.map (fn (_,cons,tree) => (cons,tree)) (T.apply_rule(([],[],D.DerTree("0",base2,Dat.NoRule,[])),rule,"0"))
            val res2 = List.map (fn (t1) => (t1,List.find (fn (t2) => check_premises'(t1,t2,make_weak_bool(side,context_num)) ) rule_applied_list_weak ) ) rule_applied_list
            
            val res = List.all (fn (_,r) => Option.isSome(r)) res2

            val res2 = if res then res2 else List.filter (fn (_,r) => false = Option.isSome(r)) res2
            
        in
          (res,res2)
        end

    
    fun weakening_context (rules,ctx) = 
        let
            val tests = List.map (fn rule => weakening_rule_context(rule,ctx)) rules
            val (bools,proofs) = ListPair.unzip tests
            val res = List.all (fn x => x) bools
            val res2 = List.concat proofs
        in
            (res,res2)
        end

    fun count_contexts (ctx_struct,index) = 
        (case ctx_struct of
           Dat.Mult(_,_,rest) => count_contexts(rest,index+1)
         | _ => index)

    fun weakening ([]) = ([],[])
        | weakening (rules as Dat.Rule(_,_,conc,_)::_) = 
        let
            val Dat.Seq(L,_,R) = conc
            val (l_num,r_num) = (count_contexts(L,1), count_contexts (R,1))
            val (l_ctx,r_ctx) = (List.tabulate (l_num,fn i => (Dat.Left,i+1)) , List.tabulate (r_num,fn i => (Dat.Right,i+1)) )
            fun test x = let val (res,_) = weakening_context(rules,x) in res end
        in
            (List.map test l_ctx, List.map test r_ctx)
        end


    

    (*TODO: if you can't apply a rule twice, should not return true*)
    fun permutes(rule1, rule2, init_rule_ls, weak) =
        let
            fun get_ctx_var(D.Empty,D.Empty) =
                let val () = () in other_fresh := !other_fresh + 1;
                [(D.CtxVar ("Gamma_" ^ Int.toString(!other_fresh)),[],[])] end
                | get_ctx_var(D.Single (D.Ctx (v1,_)), D.Single (D.Ctx (v2,_))) =
                let val () = () in other_fresh := !other_fresh + 1;
                [(D.CtxVar ("Gamma_" ^ Int.toString(!other_fresh)),v1,v2)] end
                | get_ctx_var(D.Mult (_, D.Ctx(v1,_), r1), D.Mult (_, D.Ctx(v2,_), r2)) =
                let val () = () in other_fresh := !other_fresh + 1;
                (D.CtxVar ("Gamma_" ^ Int.toString(!other_fresh)),v1,v2) :: get_ctx_var(r1, r2) end
                | get_ctx_var(_,_) = raise Fail "getting constraint from sequents with a different number of contexts"


            fun create_base(rule1, rule2) =
                let val D.Rule(name1, side1, sq1, premises1) = rule1
                    val D.Rule(name2, side2, sq2, premises2) = rule2
                    val start = generic_seq sq1
                    val sb1 = (case U.Unify_seq(start, sq1) of
                        SOME(sigscons1) =>
                            List.map(fn (sg, cn) => App.apply_seq_Unifier(start,sg))sigscons1
                        | NONE => [])
                    val sb2 = List.concat(List.map(fn s1 => (case U.Unify_seq(s1, sq2) of
                        SOME(sigscons2) =>
                            List.map(fn (sg, cn) => App.apply_seq_Unifier(s1,sg))sigscons2
                        | NONE => []))sb1)
                    val atom_seqs = List.map T.atomic_transform sb2
                in atom_seqs end

            fun create_constraint( D.Seq(l1,_,r1),  D.Seq(l2,_,r2)) =  get_ctx_var(l1,l2) @ get_ctx_var(r1,r2)

            fun check_premises(opens1, opens2, weak) =
                let
                    fun filter_func (cn,dvt) = (T.get_tree_height(dvt) >1)
                    fun filter_short (s1,s2) = (List.filter filter_func s1,List.filter filter_func s2)

                    val set_base_pairs = ListPair.zip(opens1,opens2)
                    (*remove all trees where only 1 rule is applied*)
                    val set_base_pairs = List.map (filter_short) set_base_pairs
                    (*remove sets with no trees in set 1 or no trees in set 2*)
                    val set_base_pairs = List.filter (fn (y::_,x::_) => true | (_,_) => false) set_base_pairs



                    fun set_check (set1,set2)  = ( List.map (fn (cn1,dvt1) =>
                            ((List.find (fn (cn2,dvt2) =>
                                check_premises' ((cn1,dvt1),(cn2,dvt2),weak)
                            )set2)   ,(cn1,dvt1))
                        ) set1 , set2)

                    fun seperate' ([],res) = res
                        | seperate' ((SOME y,x)::L,(res1,res2)) = seperate'(L,((x,y)::res1,res2))
                        | seperate' ((NONE,x)::L,(res1,res2)) = seperate'(L,(res1,x::res2))

                    fun seperate (L) = seperate' (L,([],[]))

                    val test_results = List.map (set_check) set_base_pairs
                in
                    List.map (fn (x,y) => (seperate(x),y)) test_results
                end

            fun stack_rules(bases, rule1, rule2, init_rule_ls) =
                List.map (fn tree =>
                    let val temp = T.apply_rule_everywhere(([], [], tree), rule1)
                        val dvt_lst = List.concat(List.map(fn tree =>
                                        T.apply_rule_all_ways(tree, rule2, true)) temp)
                        (*TODO: not sure what this line does*)
                        (*val final = List.concat(List.map(fn tree  =>
                                        List.concat(List.map(fn init_rule =>
                                        T.apply_rule_everywhere(tree, init_rule))init_rule_ls))dvt_lst)*)
                    in
                        List.map(fn(_,cn,ft) => (cn,ft)) dvt_lst
                    end) bases

            val D.Rule(name1, side1, conc1, premises1) = rule1
            val D.Rule(name2, side2, conc2, premises2) = rule2
            
            val bases = (create_base(rule1, rule2))
            val bases_pairs = List.map (fn conc => (D.DerTree("0",seq_to_fresh(conc),D.NoRule,[]),D.DerTree("0",seq_to_fresh(conc),D.NoRule,[]))) bases

            val rule1' = rule1
            val rule2' = rule2

            val (bases1 , bases2 ) = ListPair.unzip(bases_pairs)
            (* val rule1' = update_rule(rule1)
            val rule2' = update_rule(rule2) *)

            val opens1 = stack_rules(bases1, rule1', rule2', init_rule_ls)

            (* val rule1' = update_rule(rule1)
            val rule2' = update_rule(rule2) *)
            val opens2 = stack_rules(bases2, rule2', rule1', init_rule_ls)


        in
            check_premises(opens1,opens2,weak)
            (*check_premises(opens1, opens2, false, false)*)
            (* List.map(fn (_,sls,s) => (List.map(seq_toString)sls, seq_toString s))(List.hd(opens1)) *)
            (* List.map(fn t => der_tree_toString t)bases *)
            (* List.map(fn a => List.map(fn (_,_,t) => der_tree_toString t)a)opens1 *)
            (* List.map(fn t => der_tree_toString t)opens1 *)
        end

    fun latex_res ((_,tree1),(_,tree2)) = "\\[\n"^
  			Latex.der_tree_toLatex(tree1)^
  			"\n\\]\n\n\n$\\leadsto$\n\n\n\\[\n"^
  			Latex.der_tree_toLatex(tree2)^
  			"\n\\]\n"

  fun result_to_latex_strings ((true_list,fail_list)) = 
  	let
        val connector = "\n\n"
  		val true_strings = List.map (latex_res) true_list
  		val fail_strings = List.map (fn (_,dvt) => "\\[\n"^Latex.der_tree_toLatex(dvt)^"\n\\]") fail_list
        val true_string = List.foldr (fn (x,y) => x^connector^y) "" true_strings
        val fail_string = List.foldr (fn (x,y) => x^connector^y) "" fail_strings
  		(* val set2_strings = List.map (fn (_,dvt) => Latex.der_tree_toLatex(dvt)) set2 *)
  	in
  		true_string^connector^connector^fail_string
  	end

    fun permute_res ((right,wrong)) = 
        (case (List.length(right),List.length(wrong)) of
           ( 0 , 0 ) => "N/A"
         | (_ , 0) => "The Rules permute"
         | (0,_) => "The rules do not permute"
         | (_,_) => "The rules permute sometimes")
    
    fun permute_res_to_string (res) = 
        let
            val remove_set2 = List.map (fn ((a,b),c) => (a,b)) res
            val union = List.foldr (fn ((a,b),(c,d)) => (a@c,b@d)) ([],[]) remove_set2
        in
            (permute_res(union), result_to_latex_strings(union))
        end
    
    fun permute_final A = permute_res_to_string(permutes(A))
    












    fun test_1() =
        let
        val cf = D.Form (D.Con "@", [D.FormVar "R", D.FormVar "S"])

        val a = D.Single (D.Ctx([D.CtxVar "G1"], [D.Form (D.Con "@", [D.FormVar "A", D.FormVar "B"])]))
        val b = D.Single (D.Ctx([], [D.FormVar "C"]))
        val c = D.Single (D.Ctx([D.CtxVar "G1"], [D.FormVar "A", D.FormVar "B"]))
        val d = D.Single (D.Ctx([], [D.FormVar "C"]))
        val rl1 = D.Rule("and", D.Left,  D.Seq(a, D.Con "|-", b),  [ D.Seq(c, D.Con "|-", d)])

        val e = D.Single (D.Ctx([D.CtxVar "G2"], []))
        val f = D.Single (D.Ctx([], [D.Form (D.Con "@", [D.FormVar "X", D.FormVar "Y"])]))
        val g = D.Single (D.Ctx([D.CtxVar "G2"], []))
        val h = D.Single (D.Ctx([], [D.FormVar "X"]))
        val i = D.Single (D.Ctx([D.CtxVar "G2"], []))
        val j = D.Single (D.Ctx([], [D.FormVar "Y"]))
        val rl2 = D.Rule("and", D.Right,  D.Seq(e, D.Con "|-", f),  [ D.Seq(g, D.Con "|-", h), D.Seq(i, D.Con "|-", j)])

        val k = D.Single (D.Ctx([D.CtxVar "G3"], [D.FormVar "F"]))
        val l = D.Single (D.Ctx([], [D.FormVar "F"]))
        val rl3 = D.Rule("init", D.None,  D.Seq(k, D.Con "|-", l),  [])

        in
        (* init_coherence(cf, [rl1], [rl2], [rl3]) *)
        permutes(rl1, rl2, [rl3], ([],[]))
        end

    fun test_2() =
        let
        val cf = D.Form (D.Con "o", [D.FormVar "R"])

        val a = D.Single (D.Ctx([D.CtxVar "G1"], [D.Form (D.Con "o", [D.FormVar "A"])]))
        val b = D.Single (D.Ctx([], [D.Form (D.Con "o", [D.FormVar "B"])]))
        val c = D.Single (D.Ctx([D.CtxVar "G1"], [D.Form (D.Con "o", [D.FormVar "A"]), D.FormVar "A"]))
        val d = D.Single (D.Ctx([], [D.Form (D.Con "o", [D.FormVar "B"])]))
        val rl1 = D.Rule("circle", D.Left,  D.Seq(a, D.Con "|-", b),  [ D.Seq(c, D.Con "|-", d)])

        val e = D.Single (D.Ctx([D.CtxVar "G2"], []))
        val f = D.Single (D.Ctx([], [D.Form (D.Con "o", [D.FormVar "T"])]))
        val g = D.Single (D.Ctx([D.CtxVar "G2"], []))
        val h = D.Single (D.Ctx([], [D.FormVar "T"]))
        val rl2 = D.Rule("circle", D.Right,  D.Seq(e, D.Con "|-", f),  [ D.Seq(g, D.Con "|-", h)])

        val k = D.Single (D.Ctx([D.CtxVar "G3"], [D.FormVar "F"]))
        val l = D.Single (D.Ctx([], [D.FormVar "F"]))
        val rl3 = D.Rule("init", D.None,  D.Seq(k, D.Con "|-", l),  [])

        in
        (* init_coherence(cf, [rl1], [rl2], [rl3]) *)
        permutes(rl1, rl2, [rl3], ([],[]))
        end

    fun test_3() =
        let
        val cf = D.Form (D.Con "v", [D.FormVar "R", D.FormVar "S"])

        val a = D.Single (D.Ctx([D.CtxVar "G1"], []))
        val b = D.Single (D.Ctx([], [D.Form (D.Con "v", [D.FormVar "A", D.FormVar "B"])]))
        val c = D.Single (D.Ctx([D.CtxVar "G1"], []))
        val d = D.Single (D.Ctx([], [D.FormVar "A"]))
        val rl1 = D.Rule("or", D.Right,  D.Seq(a, D.Con "|-", b),  [ D.Seq(c, D.Con "|-", d)])

        val w = D.Single (D.Ctx([D.CtxVar "G2"], []))
        val x = D.Single (D.Ctx([], [D.Form (D.Con "v", [D.FormVar "Q", D.FormVar "H"])]))
        val y = D.Single (D.Ctx([D.CtxVar "G2"], []))
        val z = D.Single (D.Ctx([], [D.FormVar "H"]))
        val rl2 = D.Rule("or", D.Right,  D.Seq(w, D.Con "|-", x),  [ D.Seq(y, D.Con "|-", z)])

        val e = D.Single (D.Ctx([D.CtxVar "G3"], [D.Form (D.Con "v", [D.FormVar "X", D.FormVar "Y"])]))
        val f = D.Single (D.Ctx([], [D.FormVar "C"]))
        val g = D.Single (D.Ctx([D.CtxVar "G3"], [D.FormVar "X"]))
        val h = D.Single (D.Ctx([], [D.FormVar "C"]))
        val i = D.Single (D.Ctx([D.CtxVar "G3"], [D.FormVar "Y"]))
        val j = D.Single (D.Ctx([], [D.FormVar "C"]))
        val rl3 = D.Rule("or", D.Left,  D.Seq(e, D.Con "|-", f),  [ D.Seq(g, D.Con "|-", h), D.Seq(i, D.Con "|-", j)])

        val k = D.Single (D.Ctx([D.CtxVar "G4"], [D.FormVar "F"]))
        val l = D.Single (D.Ctx([], [D.FormVar "F"]))
        val rl4 = D.Rule("init", D.None,  D.Seq(k, D.Con "|-", l),  [])

        in
        (* init_coherence(cf, [rl1, rl2], [rl3], [rl4]) *)
        permutes(rl1, rl3, [rl4], ([],[]))
        end
end
