structure Gen = 
struct
    structure Q = QCheck
    structure Set = SplaySetFn(FormKey);
    structure D = datatypesImpl
    structure V = Vector
    structure R = Rules


    (*takes 2 generators and appends them*)
    fun gen_composition (g2) (g1) r =
        let       
            val (res,r') = g1 r
        in
            (g2 res) r'
        end
    fun vec_to_L v = V.foldr op:: [] v
    fun gen_to_L range g = Q.Gen.map (fn v => vec_to_L v) (Q.Gen.vector
      Vector.tabulate (Q.Gen.range range,g))

    (*list of variable names*)
    val var_names =  #["A","B","C","D","E"]
    val var_name_gen = Q.Gen.select var_names
    val sub_var_names = #["C","D","E"]
    val sub_var_name_gen = Q.Gen.select sub_var_names
    (* (con,arity) pairs*)
    val (con1,con2,con3) = ((D.Con("\\wedge"),2), (D.Con("\\vee"),2), (D.Con("\\supset"),2)) 
    val connectives = #[con1,con2,con3]

    val con_gen = Q.Gen.select connectives
    
    fun atom_gen name_gen = Q.Gen.map (fn nm => D.Atom(nm)) name_gen

    fun atom_var_gen name_gen = Q.Gen.map (fn nm => D.AtomVar(nm)) name_gen 
    
    fun form_var_gen name_gen = Q.Gen.map (fn nm => D.FormVar(nm)) name_gen 
    
    val context_var_names = #["\\Gamma","\\Delta","\\Lambda","\\Theta"]

    val context_var_name_gen = Q.Gen.select context_var_names

    val context_con_gen = Q.Gen.choose' #[(5,Q.Gen.lift NONE),(1,Q.Gen.lift (SOME (D.Con("!"))))]

    val context_var_gen =  Q.Gen.map (D.CtxVar) (Q.Gen.zip
                    (context_con_gen,context_var_name_gen))

    fun form_gen' name_gen 0 = Q.Gen.choose #[atom_gen name_gen,atom_var_gen
      name_gen,form_var_gen name_gen]
      | form_gen' name_gen n = Q.Gen.choose' #[(1,form_gen' name_gen 0),(9,Q.Gen.map D.Form
      (con_to_gen name_gen n))]
    and con_to_gen name_gen n= gen_composition (len_to_list name_gen n) (con_gen)
    and len_to_list name_gen n (con,arity) = Q.Gen.map (fn l => (con,vec_to_L l)) (Q.Gen.vector
    Vector.tabulate (Q.Gen.range(arity,arity),form_gen' name_gen (n-1)))

    fun form_gen name_gen r = 
        let
            val (i,r') = Q.Gen.range(0,2) r
        in
            form_gen' name_gen i r'
        end

    (*list generators*)
    fun ctx_var_l_gen range = Q.Gen.choose (#[ gen_to_L (1,1) context_var_gen ,gen_to_L (0,2) context_var_gen])
   
    fun form_l_gen range = gen_to_L range (form_gen var_name_gen)
    
    fun context_gen' range = Q.Gen.map (D.Ctx) (Q.Gen.zip (ctx_var_l_gen range,
      form_l_gen range))

    val context_gen = context_gen' (0,5)


    fun context_struct_gen' 0 = Q.Gen.choose' (#[
                                     (1,Q.Gen.lift D.Empty),
                                     (8,Q.Gen.map (D.Single) (context_gen))])
      | context_struct_gen' n = Q.Gen.choose' (#[
                                     (9,context_struct_gen' 0),
                                     (1,Q.Gen.map (D.Mult) (Q.Gen.zip3 (
                                        Q.Gen.lift (D.Con(";")),
                                        context_gen,
                                        context_struct_gen' (n-1)
                                     )))  ])
    val context_struct_gen = context_struct_gen' 2

    val seq_gen = Q.Gen.map (D.Seq)
    (Q.Gen.zip3(context_struct_gen,Q.Gen.lift (D.Con("\\vdash")),context_struct_gen)) 


    val sub_var_gen = Q.Gen.choose' #[(1,atom_var_gen sub_var_name_gen),(5,form_var_gen
                                                sub_var_name_gen)]
    val form_sub_gen = Q.Gen.map D.Fs (Q.Gen.zip (sub_var_gen, form_gen
    var_name_gen))

    val ctx_var_sub_gen = Q.Gen.map D.CTXs (Q.Gen.zip (context_var_gen,context_gen))

    val sub_gen = Q.Gen.choose' (#[
                (4,form_sub_gen),
                (1,ctx_var_sub_gen)
    ])



end
