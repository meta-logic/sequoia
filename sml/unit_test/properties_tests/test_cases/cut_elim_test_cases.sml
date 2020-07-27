structure CETCases =
struct
    structure R = Rules
    
    val weakening = ([true],[false])
    val axiom_r1 = R.id
    val axiom_r2 = R.id_no_ctx
    val (cut_pair as (cut_rule,cut_form)) = (R.cut,R.cut_form)
    val and_tuple = (R.and_con,[R.andL],[R.andR])
    val or_tuple_c = (R.or_con,[R.orLc],[R.orR1,R.orR2])
    val or_tuple_s = (R.or_con,[R.orLs],[R.orR1,R.orR2])
    val imp_tuple = (R.imp_con,[R.impL],[R.impR])
    val imp_tuple_s = (R.imp_con,[R.impLs],[R.impR])

    (* cut_r * cut_f * axiom * weakening *)
    val (axiom_case1 as (exp_axiom1,inp_axiom1)) = 
        let
            val inp' = (cut_rule,cut_form,axiom_r1,weakening)
            val exp' = RT.Yes
        in
            (exp',inp')
        end
    
    val (axiom_case2 as (exp_axiom2,inp_axiom2)) = 
        let
            val inp' = (cut_rule,cut_form,axiom_r2,weakening)
            val exp' = RT.Yes
        in
            (exp',inp')
        end

    (* cut_r * cut_f * rule * weakening *)
    val (rank_case1 as (exp_rank_andL,_)) = 
        let
            val inp' = (cut_rule,cut_form,R.andL,weakening)
            val exp' = RT.Yes
        in
            (exp',inp')
        end

    val (rank_case2 as (exp_rank_andR,_)) = 
        let
            val inp' = (cut_rule,cut_form,R.andR,weakening)
            val exp' = RT.Yes
        in
            (exp',inp')
        end
    
    val (rank_case3 as (exp_rank_orLc,_)) = 
        let
            val inp' = (cut_rule,cut_form,R.orLc,weakening)
            val exp' = RT.Yes
        in
            (exp',inp')
        end
    
    val (rank_case4 as (exp_rank_orLs,_)) = 
        let
            val inp' = (cut_rule,cut_form,R.orLs,weakening)
            val exp' = RT.Maybe
        in
            (exp',inp')
        end

    

    (* cut_r * conn_tuple * cut_f * weakening *)


    val (grade_case1 as (exp_grade_and,_)) = 
        let
            val inp' = (cut_rule,and_tuple,cut_form,weakening)
            val exp' = RT.No
        in
            (exp',inp')
        end

    val (grade_case2 as (exp_grade_or_c,_)) = 
        let
            val inp' = (cut_rule,or_tuple_c,cut_form,weakening)
            val exp' = RT.Yes
        in
            (exp',inp')
        end

    val (grade_case3 as (exp_grade_or_s_no_wk,_)) = 
        let
            val inp' = (cut_rule, or_tuple_s ,cut_form, ([false],[false]))
            val exp' = RT.No
        in
            (exp',inp')
        end
    
    val (grade_case4 as (exp_grade_or_s,_)) = 
        let
            val inp' = (cut_rule, or_tuple_s ,cut_form, weakening)
            val exp' = RT.Yes
        in
            (exp',inp')
        end
    
    val (grade_case5 as (exp_grade_imp_s,_)) = 
        let
            val inp' = (cut_rule,imp_tuple_s,cut_form,weakening)
            val exp' = RT.Yes
        in
            (exp',inp')
        end
    
    val (grade_case6 as (exp_grade_imp,_)) = 
        let
            val inp' = (cut_rule,imp_tuple,cut_form,weakening)
            val exp' = RT.No
        in
            (exp',inp')
        end

    (* cut_pair list * conn tuple list * axiom list * weakening *)
    (* [bool * 
            ((bool * proof list) list) *
			((bool * proof list) list) *
			((bool * proof list) list)]  *)

    val cut_elim_case1 = 
        let
            val cut_pair_list = [cut_pair]
            val conn_tuple_list = [and_tuple,or_tuple_s,imp_tuple_s]
            val axiom_list = [axiom_r1]
            val inp = (cut_pair_list,conn_tuple_list,axiom_list,weakening)

            val axiom_exp = [exp_axiom1]
            val grade_exp = [exp_grade_and,exp_grade_or_s,exp_grade_imp_s]
            (* rule order : andL, andR, orLs, orR1 , orR2, impLs, impR *)
            val rank_exp = [exp_rank_andL,exp_rank_andR,exp_rank_orLs,RT.Yes,RT.Yes,RT.Yes,RT.Yes]
            val expectations = [(RT.Maybe,axiom_exp,rank_exp,grade_exp)]
        in
            (expectations,inp)
        end

    val cut_elim_axiom_cases = [axiom_case1 , axiom_case2]
    val cut_elim_rank_cases = [rank_case1, rank_case2, rank_case3,rank_case4]
    val cut_elim_grade_cases = [grade_case1, grade_case2, grade_case3, grade_case4, grade_case5, grade_case6]
    val cut_elim_cases = [cut_elim_case1]
end