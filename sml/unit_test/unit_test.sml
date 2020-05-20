structure UnitTest = 
struct
    structure Q = QCheck
    structure Set = SplaySetFn(FormKey);
    structure D = datatypesImpl
    structure V = Vector


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
    and con_to_gen n r= 
        (let
            val ((con,arity),r') = con_gen r
            val (f_list,r'') = (len_to_list (arity,n)) r'
         in
           ((con,f_list),r'')
         end
         )
    and len_to_list (arity,n) = Q.Gen.map (vec_to_L) (Q.Gen.vector
    Vector.tabulate (Q.Gen.range(arity,arity),form_gen' (n-1)))

    fun form_gen r = 
        let
            val (i,r') = Q.Gen.range(0,4) r
        in
            form_gen' i r'
        end

  
    val t = 5;
end
