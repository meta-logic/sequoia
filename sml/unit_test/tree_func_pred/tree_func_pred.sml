structure T_Pred =
struct
    structure D = datatypesImpl
    structure H = helpersImpl
    structure G = Gen
    structure Q = QCheck
    structure R = Rules
    structure T = treefuncImpl

    val rule_gen = Q.Gen.select (R.rules)    


    fun rule_to_copies (copies,D.Rule(nm,side,conc,prems)):D.rule list = 
        List.tabulate (copies,fn i => D.Rule(nm^(Int.toString(i)),side,conc,prems))

    fun seq_to_tree seq = D.DerTree("0",seq,NONE,[])

    val fake_name = "fake rule"

    fun seq_to_tree2 seq = 
        let
            val prem0 = D.DerTree("00",seq,NONE,[])
            val prem1 = D.DerTree("01",seq,NONE,[])
            val prem2 = D.DerTree("02",seq,NONE,[])
            val prem3 = D.DerTree("03",seq,NONE,[])
        in
            D.DerTree("0",seq,SOME fake_name,[prem0,prem1,prem2,prem3])
        end
    fun tree_to_conc (D.DerTree(_,conc,_,_)) = conc

    fun ctx_struct_to_ctx_list (D.Empty) = []
        |ctx_struct_to_ctx_list (D.Single(ctx)) = [ctx]
        |ctx_struct_to_ctx_list (D.Mult(_,ctx,c_struct)) = (ctx::(ctx_struct_to_ctx_list c_struct))
    
    fun seq_to_ctx_list_pair (D.Seq(a,_,b)) = ((ctx_struct_to_ctx_list a),(ctx_struct_to_ctx_list b))

    val get_forms = List.map (fn D.Ctx(_,fl) => fl)

    fun formL_eq (x,y) = H.mset_eq(x,y,D.form_eq)

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
    (* assumes apply_rule works *)
    fun check_rule_can_be_applied2 (seq,rule) = 
        let
            val D.Rule(name,_,_,_) = rule
            val base_tree = seq_to_tree(seq)
            val rule_applied = T.apply_rule(([],[],base_tree),rule,"0")
            val trees = List.map (#3) rule_applied
            fun check1 (D.DerTree(_,_,SOME nm,_)) = nm= name
                | check1 (_) = false
        in
            List.all check1 trees
        end

    fun check_rule_is_applied(seq,rule) = 
        let
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

    fun check_split tree = 
        ((let
            val seq = tree_to_conc tree
            val (seq_left,seq_right) = seq_to_ctx_list_pair(seq)
            val seq_left_forms = get_forms seq_left
            val seq_right_forms = get_forms seq_right
            
            val D.DerTree(_,_,_,[prem1',prem2']) = tree
            val prem1 = tree_to_conc prem1'
            val prem2 = tree_to_conc prem2'
            
            val (prem1_left,prem1_right) = seq_to_ctx_list_pair(prem1)
            val (prem2_left,prem2_right) = seq_to_ctx_list_pair(prem2)
            (* for the left contexts, prem1 U prem2 = seq, for the right contexts,
               prem1 = prem2 = seq*)
            val prem1_left_forms = get_forms prem1_left
            val prem1_right_forms = get_forms prem1_right
            val prem2_left_forms = get_forms prem2_left
            val prem2_right_forms = get_forms prem2_right

            val prem_left_forms = ListPair.mapEq (op@) (prem1_left_forms,prem2_left_forms)
            val check_eq = ListPair.allEq formL_eq

        in
            (check_eq (seq_left_forms,prem_left_forms))
            andalso (check_eq (seq_right_forms,prem1_right_forms))
            andalso (check_eq (seq_right_forms,prem2_right_forms))
        end)
        handle (Bind) => false)
        handle (ListPair.UnequalLengths) => false


    fun check_rule_splits(seq,rule) = 
        let
            val res = check_rule_can_be_applied(seq,rule)
            val D.Rule(name,_,_,_) = rule
            val base_tree = seq_to_tree(seq)
            val rule_applied = T.apply_rule(([],[],base_tree),rule,"0")
            val trees = List.map (#3) rule_applied
            fun check1 (D.DerTree(_,_,SOME nm,_)) = nm = name
                | check1 (_) = false    
            fun check2 (D.DerTree(_,_,NONE,_)) = true
                | check2 (_) = false
        in
            (case res of
               true => (List.all check1 trees) andalso (List.all (check_split) trees)
             | false => List.all check2 trees)
            
        end
    
    fun check_applied_everywhere(tree,rule) = 
        let
            val seq = tree_to_conc tree
            val res = check_rule_can_be_applied(seq,rule)
            val D.Rule(name,_,_,_) = rule
            val base_tree = tree
            val rule_applied = T.apply_rule_everywhere(([],[],base_tree),rule)
            val trees = List.map (#3) rule_applied
            fun check1' (D.DerTree(_,_,SOME nm,_)) = nm= name
                | check1' (_) = false
            fun check1 (D.DerTree(_,_,SOME nm,prems)) = (nm = fake_name) andalso (List.all check1' prems)
                | check1 (_) = false
            fun check2' (D.DerTree(_,_,NONE,_)) = true
                | check2' (_) = false
            fun check2 (D.DerTree(_,_,SOME nm,prems)) = (nm = fake_name) andalso (List.all check2' prems)
                | check2 (_) = false
        in  
            (case res of
               true => List.all check1 trees
             | false => List.all check2 trees)
        end



    fun check_applied_everywhere2(tree,rule) = 
        let
            val seq = tree_to_conc tree
            val res = check_rule_can_be_applied2(seq,rule)
            val D.Rule(name,_,_,_) = rule
            val base_tree = tree
            val rule_applied = T.apply_rule_everywhere(([],[],base_tree),rule)
            val trees = List.map (#3) rule_applied
            fun check1' (D.DerTree(_,_,SOME nm,_)) = nm= name
                | check1' (_) = false
            fun check1 (D.DerTree(_,_,SOME nm,prems)) = (nm = fake_name) andalso (List.all check1' prems)
                | check1 (_) = false
            fun check2' (D.DerTree(_,_,NONE,_)) = true
                | check2' (_) = false
            fun check2 (D.DerTree(_,_,SOME nm,prems)) = (nm = fake_name) andalso (List.all check2' prems)
                | check2 (_) = false
        in  
            (case res of
               true => List.all check1 trees
             | false => List.all check2 trees)
        end
    
    fun check_combinations (prem_ids,trees,rule_name) = 
        let
            val num_prems = List.length(prem_ids)
            val wanted_prem_combinations' = List.tabulate(num_prems,(fn i => H.chooseDP(prem_ids,i+1)))
            val wanted_prem_combinations = List.concat wanted_prem_combinations'

            fun prem_filter(prems) = List.filter (fn D.DerTree(_,_,SOME nm,_) => nm = rule_name 
                                                | _ => false) prems
            fun prems_to_ids(prems) = List.map (fn D.DerTree(id,_,_,_) => id) (prem_filter(prems))
            fun tree_to_prem_ids (D.DerTree(_,_,_,prems)) = prems_to_ids(prems)
            val prem_combinations = List.map tree_to_prem_ids trees
        in
            H.mset_eq(wanted_prem_combinations,prem_combinations,(fn (l1,l2) => H.mset_eq(l1,l2,op=)))
        end
    
    fun check_combinations2 (prem_ids,trees,rule_name) = 
        let
            val num_prems = List.length(prem_ids)
            val wanted_prem_combinations' = List.tabulate(num_prems+1,(fn i => H.chooseDP(prem_ids,i)))
            val wanted_prem_combinations = List.concat wanted_prem_combinations'

            fun prem_filter(prems) = List.filter (fn D.DerTree(_,_,SOME nm,_) => nm = rule_name 
                                                | _ => false) prems
            fun prems_to_ids(prems) = List.map (fn D.DerTree(id,_,_,_) => id) (prem_filter(prems))
            fun tree_to_prem_ids (D.DerTree(_,_,_,prems)) = prems_to_ids(prems)
            val prem_combinations = List.map tree_to_prem_ids trees
        in
            H.mset_eq(wanted_prem_combinations,prem_combinations,(fn (l1,l2) => H.mset_eq(l1,l2,op=)))
        end

    fun check_applied_all_ways(seq,rule) = 
        let
            val tree = seq_to_tree2 seq
            val res = check_rule_can_be_applied2(seq,rule)
            val D.Rule(name,_,_,_) = rule
            val base_tree = tree
            val D.DerTree(_,_,_,prems) = base_tree
            val prem_ids = List.map (fn D.DerTree(id,_,_,_) => id) prems
            val rule_applied = T.apply_rule_all_ways(([],[],base_tree),rule,true)
            val trees = List.map (#3) rule_applied
            fun check1 (D.DerTree(_,_,SOME nm,prems)) = (nm = fake_name)
                | check1 (_) = false
            fun check2' (D.DerTree(_,_,NONE,_)) = true
                | check2' (_) = false
            fun check2 (D.DerTree(_,_,SOME nm,prems)) = (nm = fake_name) andalso (List.all check2' prems)
                | check2 (_) = false
        in  
            (case res of
               true => (List.all check1 trees) andalso (check_combinations(prem_ids,trees,name))
             | false => List.all check2 trees)
        end

    fun check_applied_all_ways2(seq,rule) = 
        let
            val tree = seq_to_tree2 seq
            val res = check_rule_can_be_applied2(seq,rule)
            val D.Rule(name,_,_,_) = rule
            val base_tree = tree
            val D.DerTree(_,_,_,prems) = base_tree
            val prem_ids = List.map (fn D.DerTree(id,_,_,_) => id) prems
            val rule_applied = T.apply_rule_all_ways(([],[],base_tree),rule,false)
            val trees = List.map (#3) rule_applied
            fun check1 (D.DerTree(_,_,SOME nm,prems)) = (nm = fake_name)
                | check1 (_) = false
            fun check2' (D.DerTree(_,_,NONE,_)) = true
                | check2' (_) = false
            fun check2 (D.DerTree(_,_,SOME nm,prems)) = (nm = fake_name) andalso (List.all check2' prems)
                | check2 (_) = false
        in  
            (case res of
               true => (List.all check1 trees) andalso (check_combinations2(prem_ids,trees,name))
             | false => List.all check2 trees)
        end

    fun check_comb_and_permutations(trees,names) = 
        let
            (* pick a subset (atleast 1) of names *)
            val num_names = List.length(names)
            val name_choices' = List.tabulate(num_names,fn i => H.chooseDP(names,(i+1)))
            val name_choices = List.concat name_choices'
            (* get all permutations of that subset *)
            val name_permutations' = List.map (H.permutations) name_choices
            val wanted_orders = List.concat name_permutations'
            
            (* turn tree into ordered list of rule names*)
            fun tree_to_rules (D.DerTree(_,_,NONE,_)) = []
                | tree_to_rules (D.DerTree(_,_,SOME nm,[prem])) = (nm) :: (tree_to_rules prem)
                | tree_to_rules _ = raise Fail "unexpected input tree_to_rules"
            val actual_orders' = List.map (tree_to_rules) trees


            (* 2 name orders are equal if they have the same length and same names *)
            val eq_check = ListPair.allEq (op=)
            

            (* remove duplicates from actual orders since the trees should be identical*)
            fun fltr x = List.filter (fn y => not (eq_check(x,y)))
            fun remove_dup ([]) = []
              | remove_dup (x::l) = x::(remove_dup(fltr x l))

            val actual_orders = remove_dup actual_orders'
        in
            H.mset_eq(wanted_orders,actual_orders,eq_check)
        end
    
    fun check_applied_multiple_rules_all_ways(seq,rule) = 
        let
            val tree = seq_to_tree seq
            val res = check_rule_can_be_applied2(seq,rule)
            val rules = rule_to_copies (4,rule)
            fun rule_to_name (D.Rule(name,_,_,_)) = name
            val names = List.map rule_to_name rules
            val base_tree = tree
            val rule_applied = T.apply_multiple_rules_all_ways(([],[],base_tree),rules)
            val trees = List.map (#3) rule_applied
            fun check2 (D.DerTree(_,_,NONE,_)) = true
                | check2 (_) = false
        in  
            (case res of
               true => (check_comb_and_permutations(trees,names))
             | false => List.all check2 trees)
        end

    fun print_pair(seq,D.Rule(name,_,_,_)) = (D.seq_stringify(seq))^" and "^ name

    fun apply_rule_test1 () = 
        let
            val seq_rule_gen = Q.Gen.zip (G.seq_gen,rule_gen)
            val prop_reader = (seq_rule_gen,SOME print_pair)
            val prop = (Q.pred (check_rule_is_applied))
            val prop_desc = ("apply_rule test 1",prop)

        in
            Q.checkGen prop_reader prop_desc
        end
    
    fun apply_rule_test2 () = 
        let
            val rule_gen2 = Q.Gen.lift (R.split_left)
            val seq_rule_gen = Q.Gen.zip (G.seq_gen,rule_gen2)
            val prop_reader = (seq_rule_gen,SOME print_pair)
            val prop = (Q.pred (check_rule_splits))
            val prop_desc = ("apply_rule test 2",prop)

        in
            Q.checkGen prop_reader prop_desc
        end
    
    fun apply_rule_everywhere_test1 () = 
        let
            val rule_gen2 = Q.Gen.lift (R.copy)
            val tree_gen = Q.Gen.map seq_to_tree2 G.seq_gen
            val seq_rule_gen = Q.Gen.zip (tree_gen,rule_gen2)
            val prop_reader = (seq_rule_gen,NONE)
            val prop = (Q.pred (check_applied_everywhere))
            val prop_desc = ("apply_rule_everywhere test1",prop)

        in
            Q.checkGen prop_reader prop_desc
        end
    
    fun apply_rule_everywhere_test2 () = 
        let
            val tree_gen = Q.Gen.map seq_to_tree2 G.seq_gen
            val seq_rule_gen = Q.Gen.zip (tree_gen,rule_gen)
            val prop_reader = (seq_rule_gen,NONE)
            val prop = (Q.pred (check_applied_everywhere2))
            val prop_desc = ("apply_rule_everywhere test2",prop)

        in
            Q.checkGen prop_reader prop_desc
        end
    
    (* WIP *)
    fun apply_rule_all_ways_test1 () = 
        let
            val rule_gen2 = Q.Gen.lift (R.copy)
            val tree_gen = G.seq_gen
            val seq_rule_gen = Q.Gen.zip (tree_gen,rule_gen2)
            val prop_reader = (seq_rule_gen,SOME print_pair) 
            val prop = (Q.pred (check_applied_all_ways))
            val prop_desc = ("apply_rule_all_ways test 1",prop)
        in
            Q.checkGen prop_reader prop_desc
        end
    fun apply_rule_all_ways_test2 () = 
        let
            val rule_gen2 = Q.Gen.lift (R.copy)
            val tree_gen = G.seq_gen
            val seq_rule_gen = Q.Gen.zip (tree_gen,rule_gen2)
            val prop_reader = (seq_rule_gen,SOME print_pair) 
            val prop = (Q.pred (check_applied_all_ways2))
            val prop_desc = ("apply_rule_all_ways test 2",prop)
        in
            Q.checkGen prop_reader prop_desc
        end

    fun apply_multiple_rules_all_ways_test () =
        let
            val rule_gen2 = Q.Gen.lift (R.copy)
            val seq_gen = G.seq_gen
            val seq_rule_gen = Q.Gen.zip (seq_gen,rule_gen2)
            val prop_reader = (seq_rule_gen,SOME print_pair) 
            val prop = (Q.pred (check_applied_multiple_rules_all_ways))
            val prop_desc = ("apply_multiple_rules_all_ways test",prop)
        in
            Q.checkGen prop_reader prop_desc
        end      
    



    val _ = apply_rule_test1 ()
    val _ = apply_rule_test2 ()
    val _ = apply_rule_everywhere_test1 ()
    val _ = apply_rule_everywhere_test2 ()
    val _ = apply_rule_all_ways_test1 ()
    val _ = apply_rule_all_ways_test2 ()
    val _ = apply_multiple_rules_all_ways_test ()

end