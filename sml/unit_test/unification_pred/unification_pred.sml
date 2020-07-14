structure U_Pred = 
struct
    structure D = datatypesImpl
    structure U = unifyImpl
    structure Q = QCheck
    structure G = Gen
    structure App = applyunifierImpl
    structure E = Equivalence
    structure H = helpersImpl
    structure C = Constraints
    structure Sort = ListMergeSort
    structure CV_Key = CtxVarKey
    structure MCV = BinaryMapFn (CtxVarKey) 

    (* returns true if x is greater than y*)
    fun cmp_to_gt cmp (x,y) = 
        (case cmp(x,y) of
           GREATER => true
         | _ => false)
    
    fun list_cmp cmp (l1,l2) = 
        (case (l1,l2) of
           ([],[]) => EQUAL
         | ([],_) => LESS
         | (_,[]) => GREATER
         | (x::l1',y::l2') => 
            (case (cmp(x,y)) of
                EQUAL => list_cmp cmp (l1',l2')
              | res => res))

    val ctx_varL_cmp = list_cmp (CV_Key.compare)

    val ctx_varL_sort = Sort.sort (cmp_to_gt CV_Key.compare)

    fun sort_constraint (a,b,c) = (a,ctx_varL_sort b, ctx_varL_sort c)

    fun constraint_cmp ((a1: D.ctx_var ,b1,c1),(a2 : D.ctx_var ,b2,c2)) = 
        (case ctx_varL_cmp(b1,b2) of
           EQUAL => (ctx_varL_cmp(c1,c2))
         | res => res)
    
    val constraintL_sort = Sort.sort (cmp_to_gt constraint_cmp)

    fun empty_sub (v) = D.CTXs(v,D.Ctx([],[]))
    fun con_to_subs ((_,l1,l2)) = 
        (case l1 of
           hd::tl => (D.CTXs(hd,D.Ctx(l2,[])))::(List.map empty_sub tl)
         | _ => raise Fail "constraint failure")
    fun cons_to_subs cons = List.concat (List.map con_to_subs cons)
    fun unifier_to_subs (subs,cons  ) = App.UnifierComposition(subs,cons_to_subs cons)
    fun unifiers_to_subs (l) = List.map unifier_to_subs l

    fun print_to_pair p (fst,scnd) = (p fst)^" and "^(p scnd)^"\n"

    val counter = ref 1
    fun add_to_str (x) = (x^"_{"^(Int.toString(!counter))^"}") before (counter := !counter + 1)
    fun update_ctx_var (D.CtxVar(a,b)) = D.CtxVar(a,add_to_str(b))
    fun update_form x = x
    val update = (update_ctx_var,update_form)
    
    fun ctx_pair_update (ctx1,ctx2) = (D.ctx_update update ctx1,D.ctx_update update ctx2)
    fun ctx_struct_pair_update (ctx_str1,ctx_str2) = (D.ctx_struct_update update ctx_str1,
                                                      D.ctx_struct_update update ctx_str2)
    fun seq_pair_update (s1,s2) = (D.seq_update update s1,D.seq_update update s2)
    
    fun gen_to_pair_gen gen = Q.Gen.choose' (#[
                                (9,Q.Gen.zip(gen,gen)),
                                (1,Q.Gen.map (fn x => (x,x)) gen)])
    
    fun ctx_var_eq map (v1,v2) = 
        (case MCV.find(!map,v1) of
           SOME v2' => D.ctx_var_eq(v2,v2')
         | NONE => (map := (MCV.insert(!map,v1,v2)) ; true))


    fun ctx_varL_eq _ ([],[]) = true
        | ctx_varL_eq map (v1::l1,v2::l2) = (ctx_var_eq map (v1,v2))
                                   andalso (ctx_varL_eq map (l1,l2))
        | ctx_varL_eq _ _ = false


    fun constraint_eq map ((_,b1,c1),(_,b2,c2)) =
        let
            val eq = ctx_varL_eq map
        in
            (eq(b1,b2)) andalso (eq(c1,c2))
        end

    (* each constraint should be the same *)
    fun constraint_list_eq' _ ([],[]) = true
        |constraint_list_eq' map (c1::l1,c2::l2) = (constraint_eq map (c1,c2)) 
                                     andalso (constraint_list_eq' map (l1,l2))
        |constraint_list_eq' _ _ = false

    type constraint = D.ctx_var * (D.ctx_var list) * (D.ctx_var list)

    fun constraint_list_eq (l1: constraint list,l2: constraint list) = 
        let
            val eq_map = ref (MCV.empty)

            val l1' = List.map (sort_constraint) l1
            val l1'' = constraintL_sort l1'

            val l2' = List.map (sort_constraint) l2
            val l2'' = constraintL_sort l2'
        in
            constraint_list_eq' eq_map (l1'',l2'')
        end
    

    fun ctx_struct_to_ctx_list (D.Empty) = []
        |ctx_struct_to_ctx_list (D.Single(ctx)) = [ctx]
        |ctx_struct_to_ctx_list (D.Mult(_,ctx,c_struct)) = (ctx::(ctx_struct_to_ctx_list c_struct))
    
    fun seq_to_ctx_list (D.Seq(a,_,b)) = (ctx_struct_to_ctx_list a)@(ctx_struct_to_ctx_list b)

    fun constraint_gen_ctx(D.Ctx(a,_),D.Ctx(b,_)) = 
        let
            val (cons,subs) = C.get_constraints(a,b)
        in
            cons
        end
    
    fun constraint_gen_ctx_struct (a,b) = 
        let
            val ctx_list_a = ctx_struct_to_ctx_list(a)
            val ctx_list_b = ctx_struct_to_ctx_list(b)
            val pair = ListPair.zip (ctx_list_a,ctx_list_b)
        in
            List.concat (List.map constraint_gen_ctx pair)
        end
    
    fun constraint_gen_seq (a,b) = 
        let
            val ctx_list_a = seq_to_ctx_list(a)
            val ctx_list_b = seq_to_ctx_list(b)
            val pair = ListPair.zip (ctx_list_a,ctx_list_b)
        in
            List.concat (List.map constraint_gen_ctx pair)
        end

    fun eq_check uni_fn uni_res_mod app_fn eq_fn (a,b) = 
        let
            (* unify a and b *)
            val unification_res = Option.valOf (uni_fn(a,b))
            (* apply function to each unifier *)
            val new_subs = List.map uni_res_mod unification_res

            val a_l = List.map (fn sub => app_fn(a,sub)) new_subs
            val b_l = List.map (fn sub => app_fn(b,sub)) new_subs

            val ab_pairs = ListPair.zip(a_l,b_l)
        in
            List.all eq_fn ab_pairs
        end


    fun form_unification_test () = 
        let
            val form_gen = G.form_gen G.var_name_gen
            val form_pair_gen = gen_to_pair_gen (form_gen)
            val form_pair_print = SOME (print_to_pair D.form_stringify)
            val form_pair_reader = (form_pair_gen,form_pair_print)

            fun form_pair_condition (f1,f2) = Option.isSome (U.Unify_form(f1,f2))

            val form_pair_check = eq_check (U.Unify_form) (fn x => x) (App.apply_form_Unifier) (D.form_eq)

            val property = ("form unification" , Q.implies(form_pair_condition,Q.pred form_pair_check) )
        in
            Q.checkGen form_pair_reader property
        end


    fun formL_unification_test () = 
        let
            val formL_gen = G.form_l_gen (4,5)
            val formL_pair_gen = gen_to_pair_gen (formL_gen)
            val formL_pair_print = SOME (print_to_pair D.formL_toString)
            val formL_pair_reader = (formL_pair_gen,formL_pair_print)

            fun formL_pair_condition (f1,f2) = Option.isSome (U.Unify_formL(f1,f2))

            val formL_pair_check = eq_check (U.Unify_formL) (fn x => x) (App.apply_formL_Unifier)
                                             (fn (a,b) => H.mset_eq(a,b,D.form_eq))

            val property = ("form list unification" , Q.implies(formL_pair_condition,Q.pred formL_pair_check))
        in
            Q.checkGen formL_pair_reader property
        end

    fun eq_check2 uni_fn constraint_gen app_fn eq_fn (a,b) = 
        let
            (* unify a and b *)
            val unification_res = Option.valOf (uni_fn(a,b))
            (* exctract constraints from each unifier *)
            val (new_subs,new_cons_l) = ListPair.unzip unification_res

            val a_l = List.map (fn sub => app_fn(a,sub)) new_subs
            val b_l = List.map (fn sub => app_fn(b,sub)) new_subs

            val ab_pairs = ListPair.zip(a_l,b_l)
            val gen_cons_l = List.map constraint_gen ab_pairs
            val ab_cons_pairs = ListPair.zip(new_cons_l,gen_cons_l)
        in
            (List.all constraint_list_eq ab_cons_pairs) andalso (List.all eq_fn ab_pairs)
        end

    fun ctx_unification_test () = 
        let
            val ctx_gen = G.context_gen
            val ctx_pair_gen' = gen_to_pair_gen (ctx_gen)
            val ctx_pair_gen = Q.Gen.map ctx_pair_update ctx_pair_gen'
            val ctx_pair_print = SOME (print_to_pair D.ctx_toString)
            val ctx_pair_reader = (ctx_pair_gen,ctx_pair_print)

            fun ctx_pair_condition (f1,f2) = Option.isSome (U.Unify_ctx(f1,f2))

            val ctx_pair_check = eq_check2 (U.Unify_ctx) constraint_gen_ctx (App.apply_ctx_Unifier)
                                             (E.ctx_equiv)

            val property = ("context unification" , Q.implies(ctx_pair_condition,Q.pred ctx_pair_check))
        in
            Q.checkGen ctx_pair_reader property
        end
    fun ctx_struct_unification_test () = 
        let
            val ctx_struct_gen = G.context_struct_gen
            val ctx_struct_pair_gen' = gen_to_pair_gen (ctx_struct_gen)
            val ctx_struct_pair_gen = Q.Gen.map ctx_struct_pair_update ctx_struct_pair_gen'
            val ctx_struct_pair_print = SOME (print_to_pair D.ctx_struct_toString)
            val ctx_struct_pair_reader = (ctx_struct_pair_gen,ctx_struct_pair_print)

            fun ctx_struct_pair_condition (f1,f2) = Option.isSome (U.Unify_ctx_struct(f1,f2))

            val ctx_struct_pair_check = eq_check2 (U.Unify_ctx_struct) constraint_gen_ctx_struct 
                (App.apply_ctx_struct_Unifier) (E.ctx_struct_equiv)

            val property = ("context struct unification" , Q.implies(ctx_struct_pair_condition,
                                                    Q.pred ctx_struct_pair_check))
        in
            Q.checkGen ctx_struct_pair_reader property
        end
    fun seq_unification_test () = 
        let
            val seq_gen = G.seq_gen
            val seq_pair_gen' = gen_to_pair_gen  (seq_gen)
            val seq_pair_gen = Q.Gen.map seq_pair_update seq_pair_gen'
            val seq_pair_print = SOME (print_to_pair D.seq_toString)
            val seq_pair_reader = (seq_pair_gen,seq_pair_print)

            fun seq_pair_condition (f1,f2) = Option.isSome (U.Unify_seq(f1,f2))

            val seq_pair_check = eq_check2 (U.Unify_seq) constraint_gen_seq 
                (App.apply_seq_Unifier) (E.seq_equiv)

            val property = ("sequent unification" , Q.implies(seq_pair_condition,
                                                    Q.pred seq_pair_check))
        in
            Q.checkGen seq_pair_reader property
        end

    val _ = form_unification_test ()
    val _ = formL_unification_test ()
    val _ = ctx_unification_test ()
    val _ = ctx_struct_unification_test ()
    val _ = seq_unification_test ()

end

