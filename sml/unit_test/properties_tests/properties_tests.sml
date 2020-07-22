structure PropertiesTest = 
struct
    structure C = TestCases
    structure Q = QCheck
    structure D = datatypesImpl
    structure P = Properties

    fun list_reader ([]) = NONE
        | list_reader (x::l) = SOME (x,l)
    

    fun proof_list_partition (l) = 
        let
          val (yes,no) = List.partition (fn (x,y) => Option.isSome y) l
          
        in
          (List.length(yes),List.length(no))
        end
    

    fun check1' (RT.Yes,true) = true
        |check1' (RT.No,false) = true
        |check1' (RT.Maybe,false) = true
        |check1' (_) = false

    val check1 = ListPair.allEq check1'

    fun check2' (RT.Yes,(true,(yes,no))) = (yes>0) andalso (no = 0)
        |check2' (RT.No,(false,(yes,no))) = (yes=0) andalso (no > 0)
        |check2' (RT.Maybe,(false,(yes,no))) = (yes>0) andalso (no > 0)
        |check2' (_) = false
    val check2 = ListPair.allEq check2'

    fun permute_check (expectation,inp) = 
        (let
            val res = P.permute inp
            val res_no_debug = List.map (fn (x,y) => x) res
            val (yes_list,no_list) = ListPair.unzip res_no_debug
            val (yes,no) = (List.concat yes_list, List.concat no_list)
            val yes_num = List.length(yes)
            val no_num = List.length(no)
        in
            (case expectation of
               RT.Yes => (yes_num>0) andalso (no_num = 0)
             | RT.No => (yes_num=0) andalso (no_num > 0)
             | RT.Maybe => (yes_num>0) andalso (no_num > 0))
        end)
        handle (_) => false

    
    fun weakening_check (expectations,inp) = 
        (let
            val (l_res,r_res) = P.weakening inp
            val (l_exp,r_exp) = expectations
        in
            (check1 (l_exp,l_res)) andalso (check1 (r_exp,r_res))
        end)
        handle (_) => false
    

    fun weakening_proofs_check (expectations,inp) = 
        (let
            val mp = List.map (fn (x,y) => (x,proof_list_partition y))
            
            val (l_res,r_res) = P.weakening_proofs inp
            val l_res = mp l_res
            val r_res = mp r_res

            val (l_exp,r_exp) = expectations

        in
            (check2 (l_exp,l_res)) andalso (check2 (r_exp,r_res))
        end)
        handle (_) => false

     (* bool * (bool * proof list) list *)

    fun id_expansion_check (expectations,inp) = 
        let
            val mp = List.map (fn (x,y) => (x,proof_list_partition y))
            val res = P.init_coherence inp
            val (main_bool,con_list) = res
            val con_list = mp con_list
            val con_list = List.drop (con_list,1)
            val (yes,no) = List.partition (fn x => x) (List.map (fn (x,y) => x) con_list)
            val main_bool_res = (main_bool,(List.length yes,List.length no))
            val (main_exp,exp_list) = expectations
        in
            (check2'(main_exp,main_bool_res)) andalso (check2(exp_list,con_list))
        end




    fun permute_test () = 
        let
            val reader_rep = (list_reader,NONE)
            val prop = ("permute test", Q.pred permute_check)
            val inp = C.permute_cases
        in
            Q.check reader_rep prop inp
        end
    
    fun weakening_test () = 
        let
            val reader_rep = (list_reader,NONE)
            val prop = ("weakening test", Q.pred weakening_check)
            val inp = C.weakening_cases
        in
            Q.check reader_rep prop inp
        end
    
    fun weakening_proofs_test () = 
        let
            val reader_rep = (list_reader,NONE)
            val prop = ("weakening_proofs test", Q.pred weakening_proofs_check)
            val inp = C.weakening_cases
        in
            Q.check reader_rep prop inp
        end
    
    fun id_expansion_test () = 
        let
            val reader_rep = (list_reader,NONE)
            val prop = ("init_coherence test", Q.pred id_expansion_check)
            val inp = C.id_expansion_cases
        in
            Q.check reader_rep prop inp
        end
    
    val _ = permute_test ()
    val _ = weakening_test () 
    val _ = weakening_proofs_test () 
    val _ = id_expansion_test ()
end