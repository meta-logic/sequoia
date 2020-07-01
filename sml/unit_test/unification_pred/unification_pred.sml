structure U_Pred = 
struct
    structure D = datatypesImpl
    structure U = unifyImpl
    structure Q = QCheck
    structure G = Gen
    structure App = applyunifierImpl
    structure E = Equivalence
    structure H = helpersImpl

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
            val form_pair_gen = Q.Gen.zip (form_gen,form_gen)
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
            val formL_pair_gen = Q.Gen.zip (formL_gen,formL_gen)
            val formL_pair_print = SOME (print_to_pair D.formL_toString)
            val formL_pair_reader = (formL_pair_gen,formL_pair_print)

            fun formL_pair_condition (f1,f2) = Option.isSome (U.Unify_formL(f1,f2))

            val formL_pair_check = eq_check (U.Unify_formL) (fn x => x) (App.apply_formL_Unifier)
                                             (fn (a,b) => H.mset_eq(a,b,D.form_eq))

            val property = ("form list unification" , Q.implies(formL_pair_condition,Q.pred formL_pair_check))
        in
            Q.checkGen formL_pair_reader property
        end
    fun ctx_unification_test () = 
        let
            val ctx_gen = G.context_gen
            val ctx_pair_gen' = Q.Gen.zip (ctx_gen,ctx_gen)
            val ctx_pair_gen = Q.Gen.map ctx_pair_update ctx_pair_gen'
            val ctx_pair_print = SOME (print_to_pair D.ctx_toString)
            val ctx_pair_reader = (ctx_pair_gen,ctx_pair_print)

            fun ctx_pair_condition (f1,f2) = Option.isSome (U.Unify_ctx(f1,f2))

            val ctx_pair_check = eq_check (U.Unify_ctx) unifier_to_subs (App.apply_ctx_Unifier)
                                             (D.ctx_eq)

            val property = ("context unification" , Q.implies(ctx_pair_condition,Q.pred ctx_pair_check))
        in
            Q.checkGen ctx_pair_reader property
        end
    fun ctx_struct_unification_test () = 
        let
            val ctx_struct_gen = G.context_struct_gen
            val ctx_struct_pair_gen' = Q.Gen.zip (ctx_struct_gen,ctx_struct_gen)
            val ctx_struct_pair_gen = Q.Gen.map ctx_struct_pair_update ctx_struct_pair_gen'
            val ctx_struct_pair_print = SOME (print_to_pair D.ctx_struct_toString)
            val ctx_struct_pair_reader = (ctx_struct_pair_gen,ctx_struct_pair_print)

            fun ctx_struct_pair_condition (f1,f2) = Option.isSome (U.Unify_ctx_struct(f1,f2))

            val ctx_struct_pair_check = eq_check (U.Unify_ctx_struct) unifier_to_subs 
                (App.apply_ctx_struct_Unifier) (D.ctx_struct_eq)

            val property = ("context struct unification" , Q.implies(ctx_struct_pair_condition,
                                                    Q.pred ctx_struct_pair_check))
        in
            Q.checkGen ctx_struct_pair_reader property
        end
    fun seq_unification_test () = 
        let
            val seq_gen = G.seq_gen
            val seq_pair_gen' = Q.Gen.zip (seq_gen,seq_gen)
            val seq_pair_gen = Q.Gen.map seq_pair_update seq_pair_gen'
            val seq_pair_print = SOME (print_to_pair D.seq_toString)
            val seq_pair_reader = (seq_pair_gen,seq_pair_print)

            fun seq_pair_condition (f1,f2) = Option.isSome (U.Unify_seq(f1,f2))

            val seq_pair_check = eq_check (U.Unify_seq) unifier_to_subs 
                (App.apply_seq_Unifier) (D.seq_eq)

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

