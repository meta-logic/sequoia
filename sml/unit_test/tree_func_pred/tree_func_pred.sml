structure T_Pred =
struct
    structure D = datatypesImpl
    structure G = Gen
    structure Q = QCheck
    structure R = Rules
    structure T = treefuncImpl

    val rule_gen = Q.Gen.select (R.rules)    

    fun seq_to_tree seq = D.DerTree("0",seq,NONE,[])

    fun f_subset(x,y) = 
        (case (x,y) of
           (D.Atom(a),D.Atom(b)) => a = b
         | (D.AtomVar(_),D.Atom(_)) => true
         | (D.AtomVar(_),D.AtomVar(_))=> true
         | (D.FormVar(_),_) => true
         | (D.Form(c1,_),D.Form(c2,_)) => D.conn_eq(c1,c2)
         | _ => false)
        
    fun check_excess([],fl1,fl2) = List.length(fl1) = List.length(fl2)
        |check_excess (_) = true

    fun check_f_subset(_,_,[],_) = false
        |check_f_subset(f,rest,x::unchecked,checked)= 
            (case f_subset(f,x) of
               true => check_fl_subset(rest,unchecked@checked)
             | false => check_f_subset(f,rest,unchecked,x::checked))
    and check_fl_subset([],fl2) = true
        | check_fl_subset(x::fl1,fl2) = check_f_subset(x,fl1,fl2,[])

    fun check_ctx_subset (D.Ctx(ctx_vars,fl1),D.Ctx(_,fl2)) = check_fl_subset(fl1,fl2)
        andalso (check_excess(ctx_vars,fl1,fl2))

    fun check_ctx_struct_subset(D.Empty,D.Empty) = true
        | check_ctx_struct_subset(D.Single(ctx1),D.Single(ctx2)) = check_ctx_subset(ctx1,ctx2)
        | check_ctx_struct_subset(D.Mult(c1,ctx1,ctxstr1),D.Mult(c2,ctx2,ctxstr2)) = 
        (D.conn_eq(c1,c2))andalso (check_ctx_subset(ctx1,ctx2)) andalso 
        (check_ctx_struct_subset(ctxstr1,ctxstr2))
        | check_ctx_struct_subset(_) = false


    fun check_seq_subset(D.Seq(l1,c1,r1),D.Seq(l2,c2,r2)) = D.conn_eq(c1,c2) 
        andalso ((check_ctx_struct_subset(l1,l2)) andalso (check_ctx_struct_subset(r1,r2)))



    fun check_rule_can_be_applied(seq,D.Rule(_,_,conc,_)) = check_seq_subset(conc,seq)

    fun check_rule_is_applied(seq,rule) = 
        let
            (* assume rule can always be applied *)
            val res = check_rule_can_be_applied(seq,rule)
            val D.Rule(name,_,_,_) = rule
            val base_tree = seq_to_tree(seq)
            val rule_applied = T.apply_rule(([],[],base_tree),rule,"0")
            val trees = List.map (#3) rule_applied
            fun check1 (D.DerTree(_,_,SOME nm,_)) = nm= name
                | check1 (_) = false
            fun check2 (D.DerTree(_,_,NONE,_)) = true
                | check2 (_) = false
        in
            (case res of
               true => List.all check1 trees
             | false => List.all check2 trees)
        end

    fun print_pair(seq,D.Rule(name,_,_,_)) = (D.seq_stringify(seq))^" and "^ name

    fun apply_rule_test () = 
        let
            val seq_rule_gen = Q.Gen.zip (G.seq_gen,rule_gen)
            val prop_reader = (seq_rule_gen,SOME print_pair)
            val prop = (Q.pred (check_rule_is_applied))
            val prop_desc = ("apply_rule test",prop)

        in
            Q.checkGen prop_reader prop_desc
        end

    val _ = apply_rule_test ()

end