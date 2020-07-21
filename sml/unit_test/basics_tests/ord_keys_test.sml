structure OrdKeysTest = 
struct
    structure D = datatypesImpl
    structure Q = QCheck
    structure G = Gen
    structure CVK = CtxVarKey
    structure CVCK = CtxVarConKey
    structure ForK = FormKey

    fun transitivity_check compare_func (x,y,z) = 
        let

            (* ordering x,y,z to be inorder *)
            val (x,y) = (case compare_func(x,y) of
               GREATER => (y,x)
             | _ => (x,y))
            val (y,z) = (case compare_func(y,z) of
               GREATER => (z,y)
             | _ => (y,z))
            val (x,y) = (case compare_func(x,y) of
               GREATER => (y,x)
             | _ => (x,y))
            
        in
            (case (compare_func(x,y),compare_func(y,z),compare_func(x,z)) of
               (EQUAL,a,b) => a = b
             | (a,EQUAL,b) => a = b
             | (a,b,EQUAL) => (a = b) andalso (a = EQUAL)
             | (LESS,LESS,LESS) => true
             | (GREATER, GREATER, GREATER) => true
             | _ => false)
        end
    
    fun order_check compare_func (x,y) = 
        (case (compare_func(x,y),compare_func(y,x)) of
           (EQUAL,EQUAL) => true
         | (EQUAL,_) => false
         | (_,EQUAL) => false
         | (a,b) => a<>b)



    fun test_struct (gen,cmp_func,name,to_str) = 
        let
            val order_gen = Q.Gen.zip (gen,gen)
            fun order_to_str (x,y) = (to_str(x))^" and "^(to_str(y))
            val order_reader = (order_gen,SOME order_to_str)
            
            val transitivity_gen = Q.Gen.zip3 (gen,gen,gen)
            fun transitivity_to_str (x,y,z) = (to_str(x))^" and "^(to_str(y))^" and "^(to_str(z))
            val transitivity_reader = (transitivity_gen,SOME transitivity_to_str)

            val order_test = order_check cmp_func
            val transitivity_test = transitivity_check cmp_func

            val order_pred = (name ^" order test", Q.pred order_test)
            val transitivity_pred = (name ^" transitivity test", Q.pred transitivity_test)
        in
            (Q.checkGen order_reader order_pred ; Q.checkGen transitivity_reader transitivity_pred)
        end

    fun test_CtxVarKey () = 
        let
          val gen = G.context_var_gen
          val cmp = CVK.compare
          val name = "CtxVarKey"
          val to_str = D.ctx_var_stringify
        in
          test_struct (gen,cmp,name,to_str)
        end

    fun test_CtxVarConKey () = 
        let
          val gen = G.context_var_gen
          val cmp = CVCK.compare
          val name = "CtxVarConKey"
          val to_str = D.ctx_var_stringify
        in
          test_struct (gen,cmp,name,to_str)
        end

    fun test_FormKey () = 
        let
          val gen = G.form_gen G.var_name_gen
          val cmp = ForK.compare
          val name = "FormKey"
          val to_str = D.form_stringify
        in
          test_struct (gen,cmp,name,to_str)
        end

    val _ = test_CtxVarKey ()
    val _ = test_CtxVarConKey ()
    val _ = test_FormKey ()
end