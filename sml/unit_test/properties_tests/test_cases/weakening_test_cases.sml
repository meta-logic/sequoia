structure WTCases =
struct

    structure R = Rules

    val wk_case1 = 
        let
            val expectations = ([RT.Yes],[RT.No])
            val rules = [R.id,R.andR,R.andL,R.orR1,R.orR2,R.orLc,R.impR,R.impL]
        in
            (expectations,rules)
        end
    val wk_case2 = 
        let
            val expectations = ([RT.Maybe],[RT.No])
            val rules = [R.id_no_ctx,R.andR,R.andL,R.orR1,R.orR2,R.orLc,R.impR,R.impL]
        in
            (expectations,rules)
        end
    
    val weakening_cases = [wk_case1,wk_case2]
end