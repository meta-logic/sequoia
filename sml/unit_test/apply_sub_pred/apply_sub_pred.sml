structure App_Pred = 
struct
    structure D = datatypesImpl
    structure H = helpersImpl
    structure App = applyunifierImpl
    structure Q = QCheck
    structure G = Gen
    structure MF = BinaryMapFn (FormKey)
    structure MCV = BinaryMapFn (CtxVarKey)
    
    fun insert_sub (sub,(f_map,ctx_var_map)) = 
        (case sub of
           D.Fs (a,b) => (MF.insert(f_map,a,b),ctx_var_map)
         | D.CTXs (ctx_var, ctx) => (f_map, MCV.insert(ctx_var_map,ctx_var,ctx))
        )
    fun subL_to_map_pair (subs) = 
        let
            val map_pair = (MF.empty,MCV.empty)
        in
            List.foldr insert_sub map_pair subs
        end
    
    fun add_res subs (ctx_var,(vars,forms))=
        let
            val (new_vars,new_forms) = App.apply_ctx_var_Unifier(ctx_var,subs)
        in
            (new_vars@vars,new_forms@forms)
        end
    
    fun collect_apply_res subs (ctx_vars,forms) =
        let
            val new_forms = App.apply_formL_Unifier(forms,subs)
            
        in
            List.foldl (add_res subs) ([],new_forms) ctx_vars
        end


    fun check_transformed' (f_map,_) (a,a') = 
        (case MF.find(f_map,a) of
           SOME b' => D.form_eq(a',b')
         | NONE => D.form_eq(a,a'))
    
    fun check_transformed subs (a,a') = 
        (case (a,a') of
              (D.Form(c,fl),D.Form(c',fl')) => (D.conn_eq(c,c')) andalso
              (List.all (check_transformed subs) (ListPair.zip(fl,fl')))
             |(D.Form _ , _) => false
             |(_,_) => check_transformed' subs (a,a')
        )

    fun ctx_equiv subs (ctx1,ctx2) = D.ctx_eq (App.apply_ctx_Unifier(ctx1,subs),ctx2)

    fun ctx_struct_equiv _ (D.Empty,D.Empty) = true
        | ctx_struct_equiv subs (D.Single(ctx1),D.Single(ctx2)) = ctx_equiv subs (ctx1,ctx2)
        | ctx_struct_equiv subs (D.Mult(con1,ctx1,ctx_struct1),
                                 D.Mult(con2,ctx2,ctx_struct2)) = 
                                 (D.conn_eq(con1,con2)) andalso
                                 (ctx_equiv subs (ctx1,ctx2)) andalso
                                 (ctx_struct_equiv subs (ctx_struct1,ctx_struct2))

    fun seq_equiv subs (seq1,seq2) = D.seq_eq(App.apply_seq_Unifier(seq1,subs),seq2)

    val subL_gen = Gen.gen_to_L (1,20) Gen.sub_gen
    val formL_gen = Gen.gen_to_L (1,5) (Gen.form_gen Gen.var_name_gen) 
    
    fun apply_form_Unifier_test () = 
        let
            fun apply_form_pred (form,subs) =
                let
                    val subs_applied = App.apply_form_Unifier(form,subs) 
                    val sub_maps = subL_to_map_pair(subs)
                in
                    check_transformed sub_maps (form,subs_applied)
                end
            val case_gen = Q.Gen.zip (Gen.form_gen Gen.var_name_gen, subL_gen)
            val case_s_reader = (case_gen, NONE)
            val prop_s = ("apply_unifier test", Q.pred apply_form_pred)
        in
            Q.checkGen case_s_reader prop_s
        end

    fun apply_formL_Unifier_test () = 
        let
            fun apply_formL_pred (forms,subs) = 
                let
                    val sub_maps = subL_to_map_pair(subs)
                    val subs_applied = (ListPair.zip(forms,App.apply_formL_Unifier(forms,subs)))
                in
                    List.all (check_transformed sub_maps) subs_applied
                end
            val case_l_gen = Q.Gen.zip(formL_gen,subL_gen)
            val case_l_reader = (case_l_gen, NONE)
            val prop_l = ("apply_formL_Unifier test",Q.pred apply_formL_pred)
        in
            Q.checkGen case_l_reader prop_l
        end

    
    
    fun apply_ctx_var_Unifier_test () = 
        let
            fun check (ctx_var,subs) = 
                let
                    val subs_applied = App.apply_ctx_var_Unifier(ctx_var,subs)
                    val (new_ctx_vars,new_forms) = subs_applied
                    val (_,ctx_var_map) = subL_to_map_pair(subs)
                    
                in
                    (case MCV.find(ctx_var_map,ctx_var) of
                       SOME (D.Ctx(a,b)) => (H.mset_eq(a,new_ctx_vars, D.ctx_var_eq)) 
                                    andalso (H.mset_eq(b,new_forms,D.form_eq))
                     | NONE => H.mset_eq([ctx_var],new_ctx_vars,D.ctx_var_eq))
                end
            val case_gen = Q.Gen.zip(Gen.context_var_gen,subL_gen)
            val case_reader = (case_gen , NONE)
            val prop = ("apply_ctx_var_Unifier test", Q.pred check)
        in
            Q.checkGen case_reader prop
        end

    fun apply_ctx_varL_Unifier_test () =
        let
            fun check (ctx_var,subs) = 
                let
                    val subs_applied = App.apply_ctx_var_Unifier(ctx_var,subs)
                    val (new_ctx_vars,new_forms) = subs_applied
                    val (_,ctx_var_map) = subL_to_map_pair(subs)
                    
                in
                    (case MCV.find(ctx_var_map,ctx_var) of
                       SOME (D.Ctx(a,b)) => (H.mset_eq(a,new_ctx_vars, D.ctx_var_eq)) 
                                    andalso (H.mset_eq(b,new_forms,D.form_eq))
                     | NONE => H.mset_eq([ctx_var],new_ctx_vars,D.ctx_var_eq))
                end
            val case_gen = Q.Gen.zip(Gen.context_var_gen,subL_gen)
            val case_reader = (case_gen,NONE)
            val prop = ("apply_ctx_varL_Unifier test", Q.pred check)
        in
            Q.checkGen case_reader prop
        end
    
    


    fun apply_ctx_Unifier_test ()  =
        let
            fun check (ctx as D.Ctx(old_vars,old_forms),subs) = 
                let
                    val subs_applied = App.apply_ctx_Unifier(ctx,subs)
                    val apply_ctx = subs_applied
                    val manual_ctx = D.Ctx (collect_apply_res subs (old_vars,old_forms))
                in
                    D.ctx_eq(apply_ctx,manual_ctx)
                end
            val case_gen = Q.Gen.zip (Gen.context_gen,subL_gen)
            val case_reader = (case_gen,NONE)
            val prop = ("apply_ctx_Unifier test", Q.pred check)
        in
            Q.checkGen case_reader prop
        end

    fun apply_ctx_struct_Unifier_test ()=
        let
            fun check (ctx_struct,subs) = 
                let
                    val subs_applied = App.apply_ctx_struct_Unifier(ctx_struct,subs)
                in
                    ctx_struct_equiv subs (ctx_struct, subs_applied)
                end
            val case_gen = Q.Gen.zip (Gen.context_struct_gen,subL_gen)
            val case_reader = (case_gen,NONE)
            val prop = ("apply_ctx_struct_Unifier test", Q.pred check)
        in
            Q.checkGen case_reader prop
        end
    
    val apply_constraintL_Unifier_test = 5

    fun apply_seq_Unifier_test () = 
        let
            fun check (seq,subs) = 
                let
                    val subs_applied = App.apply_seq_Unifier(seq,subs)
                in
                    seq_equiv subs (seq, subs_applied)
                end
            val case_gen = Q.Gen.zip (Gen.seq_gen,subL_gen)
            val case_reader = (case_gen,NONE)
            val prop = ("apply_seq_Unifier test", Q.pred check)
        in
            Q.checkGen case_reader prop
        end
    
    val apply_der_tree_Unifier_test = 5 

    fun UnifierComposition_test ()= 
        let
            fun check (seq,subs1,subs2) = 
                let
                    val new_subs = App.UnifierComposition(subs1,subs2)
                    val subs_applied_first = App.apply_seq_Unifier(seq,subs1)
                    val seq2 = subs_applied_first
                    val subs_applied_sec = App.apply_seq_Unifier(seq2,subs2)
                    val subs_applied_both = App.apply_seq_Unifier(seq,new_subs)
                in
                    D.seq_eq (subs_applied_sec,subs_applied_both)
                end
            val case_gen = Q.Gen.zip3 (Gen.seq_gen,subL_gen,subL_gen)
            fun case_print (seq,subs1,subs2) = "case:\n"^(D.seq_toString(seq))
                        ^(D.subs_to_string(subs1))^(D.subs_to_string(subs2))
            val case_reader = (case_gen,SOME case_print)
            val prop = ("UnifierComposition test", Q.pred check)
        in
            Q.checkGen case_reader prop
        end

    val _ = apply_form_Unifier_test ()
    val _ = apply_formL_Unifier_test ()
    val _ = apply_ctx_var_Unifier_test ()
    val _ = apply_ctx_varL_Unifier_test ()
    val _ = apply_ctx_Unifier_test ()
    val _ = apply_ctx_struct_Unifier_test ()    
    val _ = apply_seq_Unifier_test ()
    val _ = UnifierComposition_test()

end
