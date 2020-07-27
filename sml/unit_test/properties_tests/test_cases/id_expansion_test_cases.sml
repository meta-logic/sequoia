structure IDTCases =
struct

    structure R = Rules
    structure D = datatypesImpl
    (* val init_coherence : ((conn * left rules *right rules) list * id_rules* axioms) *)

    val and_tuple = (R.and_con,[R.andL],[R.andR])
    val or_tuple_c = (R.or_con,[R.orLc],[R.orR1,R.orR2])
    val or_tuple_s = (R.or_con,[R.orLs],[R.orR1,R.orR2])
    val imp_tuple = (R.imp_con,[R.impL],[R.impR])
    val imp_tuple_s = (R.imp_con,[R.impLs],[R.impR])
    val axioms : D.rule list = []
    val id_rules1 = [R.id]
    val id_rules2 = [R.id_no_ctx]

    val id_case1 = 
        let
            val conns = [and_tuple]
            val id = id_rules2
            val expectation = (RT.No,[RT.No])
        in
            (expectation,(conns,id,axioms))
        end
    val id_case2 = 
        let
            val conns = [or_tuple_c]
            val id = id_rules2
            val expectation = (RT.Yes,[RT.Yes])
        in
            (expectation,(conns,id,axioms))
        end
    val id_case3 = 
        let
            val conns = [imp_tuple_s]
            val id = id_rules2
            val expectation = (RT.Yes,[RT.Yes])
        in
            (expectation,(conns,id,axioms))
        end
    
    val id_case4 = 
        let
            val conns = [and_tuple]
            val id = id_rules1
            val expectation = (RT.Yes,[RT.Yes])
        in
            (expectation,(conns,id,axioms))
        end
    val id_case5 = 
        let
            val conns = [or_tuple_c]
            val id = id_rules1
            val expectation = (RT.Yes,[RT.Yes])
        in
            (expectation,(conns,id,axioms))
        end
    val id_case6 = 
        let
            val conns = [imp_tuple_s]
            val id = id_rules1
            val expectation = (RT.Yes,[RT.Yes])
        in
            (expectation,(conns,id,axioms))
        end

    val id_case7 = 
        let
            val conns = [imp_tuple]
            val id = id_rules1
            val expectation = (RT.Yes,[RT.Yes])
        in
            (expectation,(conns,id,axioms))
        end

    val id_case8 = 
        let
            val conns = [imp_tuple]
            val id = id_rules2
            val expectation = (RT.No,[RT.No])
        in
            (expectation,(conns,id,axioms))
        end
    
    val id_case9 = 
        let
            val conns = [and_tuple,or_tuple_c,imp_tuple_s,imp_tuple]
            val id = id_rules1
            val expectation = (RT.Yes,[RT.Yes,RT.Yes,RT.Yes,RT.Yes])
        in
            (expectation,(conns,id,axioms))
        end
        
    val id_case10 = 
        let
            val conns = [and_tuple,or_tuple_c,imp_tuple_s,imp_tuple]
            val id = id_rules2
            val expectation = (RT.Maybe,[RT.No,RT.Yes,RT.Yes,RT.No])
        in
            (expectation,(conns,id,axioms))
        end

    val id_expansion_cases = [id_case1,id_case2,id_case3,id_case4,id_case5,
                              id_case6,id_case7,id_case8,id_case9,id_case10]
end