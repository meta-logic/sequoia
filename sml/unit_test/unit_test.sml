structure UnitTest = 
struct
    structure Q = QCheck
    structure Set = SplaySetFn(FormKey);
    structure D = datatypesImpl
    structure V = Vector


    (*takes 2 generators and appends them*)
    fun gen_composition (g2) (g1) =
        let
            fun compose r =
                let
                    val (res,r') = g1 r
                in 
                    (g2 res) r'
                end
        in
            compose
        end

        

    fun vec_to_L v = V.foldr op:: [] v
    (*list of variable names*)
    val var_names =  #["A","B","C","D","E","F","G"]
    val var_name_gen = Q.Gen.select var_names
    (* (con,arity) pairs*)
    val connectives = #[(D.Con("/\\"),2),
                                   (D.Con("\\/"),2),
                                   (D.Con("->"),2)]
    val con_gen = Q.Gen.select connectives
    
    val atom_gen = Q.Gen.map (fn nm => D.Atom(nm)) var_name_gen 

    val atom_var_gen = Q.Gen.map (fn nm => D.AtomVar(nm)) var_name_gen 
    
    val form_var_gen = Q.Gen.map (fn nm => D.FormVar(nm)) var_name_gen 
    


    fun form_gen' 0 = Q.Gen.choose #[atom_gen,atom_var_gen,form_var_gen]
      | form_gen' n = Q.Gen.choose' #[(1,form_gen' 0),(4,Q.Gen.map D.Form
      (con_to_gen n))]
    and con_to_gen n r= gen_composition (len_to_list n) (con_gen)
    and len_to_list n (con,arity) = Q.Gen.map (fn l => (con,vec_to_L l)) (Q.Gen.vector
    Vector.tabulate (Q.Gen.range(arity,arity),form_gen' (n-1)))

    fun form_gen r = 
        let
            val (i,r') = Q.Gen.range(0,4) r
        in
            form_gen' i r'
        end

    (*form list generator*)
  
    val t = 5;
end
