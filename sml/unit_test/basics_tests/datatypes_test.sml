structure DatatypesTest = 
struct
    structure D = datatypesImpl
    structure Q = QCheck
    structure G = Gen

    datatype 'a check = Same of 'a | Diff of ('a * 'a)

    fun eq_check cmp (Same(x)) = true = (cmp(x,x))
        | eq_check cmp (Diff (x,y)) = (cmp(x,y) = (cmp(y,x)))
    
    fun gen_to_check_gen gen = 
        let
            val option1 = Q.Gen.map Same gen
            val option2 = Q.Gen.map (Diff) (Q.Gen.zip(gen,gen))
        in
            Q.Gen.choose' (#[(1,option1),(9,option2)])
        end
    
    fun new_to_str to_str (Same x) = "SAME: "^(to_str x)
        | new_to_str to_str (Diff (x,y)) = "Diff: "^(to_str x)^" and "^(to_str y)
    
    fun test (gen,cmp,to_str,name) = 
        let
            val new_gen = gen_to_check_gen gen
            val new_str_fn = new_to_str to_str
            val reader = (new_gen,SOME new_str_fn)

            val pred = (name^" test",Q.pred (eq_check cmp))         
        in
            Q.checkGen reader pred
        end
    
    fun form_eq_test () = 
        let
            val gen = G.form_gen G.var_name_gen
            val cmp = D.form_eq
            val to_str = D.form_stringify
            val name = "form_eq"
        in
            test(gen,cmp,to_str,name)
        end

    fun ctx_var_eq_test () = 
        let
            val gen = G.context_var_gen
            val cmp = D.ctx_var_eq
            val to_str = D.ctx_var_stringify
            val name = "ctx_var_eq"
        in
            test(gen,cmp,to_str,name)
        end

    fun ctx_eq_test () = 
        let
            val gen = G.context_gen
            val cmp = D.ctx_eq
            val to_str = D.ctx_stringify
            val name = "ctx_eq"
        in
            test(gen,cmp,to_str,name)
        end

    fun ctx_struct_eq_test () = 
        let
            val gen = G.context_struct_gen
            val cmp = D.ctx_struct_eq
            val to_str = D.ctx_struct_stringify
            val name = "ctx_struct_eq"
        in
            test(gen,cmp,to_str,name)
        end
        
    fun seq_eq_test () = 
        let
            val gen = G.seq_gen
            val cmp = D.seq_eq
            val to_str = D.seq_stringify
            val name = "seq_eq"
        in
            test(gen,cmp,to_str,name)
        end

    val _ = form_eq_test () 
    val _ = ctx_var_eq_test () 
    val _ = ctx_eq_test () 
    val _ = ctx_struct_eq_test () 
    val _ = seq_eq_test () 
end