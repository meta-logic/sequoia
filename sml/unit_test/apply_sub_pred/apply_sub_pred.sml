structure App_Pred = 
struct
    structure D = datatypesImpl
    structure App = applyunifierImpl
    structure Q = QCheck
    structure G = Gen
    
    fun one_sub (form,subs) = List.length(subs) = 1

    fun check_transformed' ([]) (a,a') = D.form_eq(a,a')
      | check_transformed' ((D.Fs(b,b'))::rest) (a,a') = 
        if (D.form_eq(a,b)) then (D.form_eq(a',b')) else check_transformed' rest (a,a')
    
    fun check_transformed subs (a,a') = 
        (case (a,a') of
              (D.Form(c,fl),D.Form(c',fl')) => (D.conn_eq(c,c')) andalso
              (List.all (check_transformed subs) (ListPair.zip(fl,fl')))
             |(D.Form _ , _) => false
             |(_,_) => check_transformed' subs (a,a')
        )


    fun apply_form_pred (form,subs) =
    let
        val subs_applied = App.apply_form_Unifier(form,subs) 
    in
        check_transformed subs (form,subs_applied)
    end

    fun apply_formL_pred (forms,subs) = List.all (check_transformed subs)
      (ListPair.zip(forms,App.apply_formL_Unifier(forms,subs)))



    val subL_gen = Gen.gen_to_L (1,10) Gen.form_sub_gen
    val formL_gen = Gen.gen_to_L (1,5) (Gen.form_gen Gen.var_name_gen) 

    val case_gen = Q.Gen.zip (Gen.form_gen Gen.var_name_gen, subL_gen)
    val case_l_gen = Q.Gen.zip(formL_gen,subL_gen)
    val case_print = NONE
    val case_s_reader = (case_gen,case_print)
    val case_l_reader = (case_l_gen,case_print)

    val prop_s = ("apply_unifier test", Q.pred apply_form_pred)
    val prop_l = ("apply_formL_Unifier test",Q.pred apply_formL_pred)

    fun res () = Q.checkGen case_s_reader prop_s
    fun res2 () = Q.checkGen case_l_reader prop_l
end
