structure HelpersTest =
struct
    structure G = Gen
    structure Q = QCheck
    structure Sort = ListMergeSort
    structure H = helpersImpl

    (* for testing permutations and choose functions *)
    val unique_int_list_gen = Q.Gen.map (fn n => List.tabulate(n,fn n => n+1)) (Q.Gen.range(0,6))

    fun all_diff eq ([]) = true
        | all_diff eq (x::l) = (List.all (fn y => not (eq(x,y)) ) l) andalso (all_diff eq (l))
    
    fun int_list_same (l1,l2) = 
        let
            val l1' = Sort.sort (op=) l1
            val l2' = Sort.sort (op=) l2
        in
            ListPair.allEq op= (l1',l2')
        end
    
    fun int_list_eq (l1,l2) = ListPair.allEq op= (l1,l2)
        

    (* checks that ll has num unique elements, and each element  *)
    (* has length len and all unique elements *)
    fun check_all_unique list_eq_fn (ll,num,len)=
        let
            val check0 = List.length(ll) = num
            val check1 = check0 andalso (List.all (fn l => List.length(l) = len) ll)
            val check2 = check1 andalso (List.all (all_diff op=) ll)
            val check3 = check2 andalso (all_diff (list_eq_fn) ll)
        in
            check3
        end

    fun factorial' (0,res) = res
        | factorial' (1,res) = res
        | factorial' (n,res) = factorial'(n-1,n*res)
    
    fun factorial (n) = factorial'(n,1)
    
    fun permutations_check (l) = 
        let
            val res = H.permutations(l)
            val len = List.length(l)
            val num = factorial(len)
        in
            check_all_unique int_list_eq (res,num,len)
        end
    
    fun choose_check (l,n) = 
        let
            val list_length = List.length(l)
            (* we want the option to get the same len as list_length *)
            val len = n mod (list_length + 1)
            val res = H.chooseDP (l,len)
            val f1 = factorial(list_length)
            val f2 = factorial(len) * factorial(list_length - len)
            val num = f1 div f2 
        in
            check_all_unique int_list_same (res,num,len)
        end

    fun test(gen,to_str,check,name)=
        let
            val reader = (gen,SOME to_str)
            val prop = (name^" test",Q.pred check)
        in
            Q.checkGen reader prop
        end

    fun permutations_test() =
        let
            val gen = unique_int_list_gen
            val to_str = ListFormat.listToString (Int.toString)
            val name = "permutations"
            val check = permutations_check
        in
            test(gen,to_str,check,name)
        end
   
    fun chooseDP_test() =
        let
            val gen = Q.Gen.zip (unique_int_list_gen,Q.Gen.Int.int)
            val to_str' = ListFormat.listToString (Int.toString)
            fun to_str (l,x) = (to_str'(l)) ^" and "^ (Int.toString x)
            val name = "chooseDP"
            val check = choose_check
        in
            test(gen,to_str,check,name)
        end
    

    val _ = permutations_test()
    val _ = chooseDP_test()


end