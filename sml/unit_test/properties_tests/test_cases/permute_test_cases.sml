structure PTCases = 
struct
    structure R = Rules
    

    val permute_case1 =
        let
            val expectation = RT.Yes
            val weakening = ([true],[false])  
            val init_rules = [R.id]
            val rule1 = R.orR1
            val rule2 = R.andL
        in
            (expectation,(rule1,rule2,init_rules,weakening))
        end
    
    val permute_case2 =
        let
            val expectation = RT.Yes
            val weakening = ([true],[false])  
            val init_rules = [R.id]
            val rule1 = R.orR2
            val rule2 = R.andL
        in
            (expectation,(rule1,rule2,init_rules,weakening))
        end
    
    val permute_case3 =
        let
            val expectation = RT.No
            val weakening = ([true],[false])  
            val init_rules = [R.id]
            val rule1 = R.andRs
            val rule2 = R.orLs
        in
            (expectation,(rule1,rule2,init_rules,weakening))
        end
    
    val permute_case4 =
        let
            val expectation = RT.Yes
            val weakening = ([true],[false])  
            val init_rules = [R.id]
            val rule1 = R.andRs
            val rule2 = R.orLc
        in
            (expectation,(rule1,rule2,init_rules,weakening))
        end

    val permute_case5 =
        let
            val expectation = RT.Maybe
            val weakening = ([true],[false])  
            val init_rules = [R.id]
            val rule1 = R.andR
            val rule2 = R.orLc
        in
            (expectation,(rule1,rule2,init_rules,weakening))
        end
    
    val permute_case5 =
        let
            val expectation = RT.Maybe
            val weakening = ([true],[false])  
            val init_rules = [R.id]
            val rule2 = R.andR
            val rule1 = R.orLc
        in
            (expectation,(rule1,rule2,init_rules,weakening))
        end

    val permute_cases = [permute_case1,permute_case2,permute_case3,permute_case4,permute_case5]
end