(*  Sequoia  Copyright (C) 2020  Mohammed Hashim
    This program comes with ABSOLUTELY NO WARRANTY; for details see LICENSE.
    This is free software, and you are welcome to redistribute it
    under certain conditions; see LICENSE for details.
*)

structure CutElim =
struct
    structure Dat = datatypesImpl
    structure H = helpersImpl
    structure T = treefuncImpl
    structure Latex = latexImpl
    structure App = applyunifierImpl
    structure Ut = Utilities
    structure P = Permute
    structure U = unifyImpl

    fun create_base (Dat.Rule(_,_,conc,_)) = 
                Dat.DerTree("0",Ut.generic_ctx_var conc,NONE,[])

    fun check_true (l) = List.all (fn (_,opt) => Option.isSome(opt)) l

    fun cut_rule_to_tree(cut_rule) = 
    let
        val Dat.Rule(name,_,conc,prems) = cut_rule
        val prems_i = List.tabulate(List.length(prems),(fn i => Int.toString(i)))
        val prems_pairs = ListPair.zip(prems_i,prems)
        val prems = List.map (fn (i,seq) => Dat.DerTree("0"^i,seq,NONE,[])) prems_pairs 
        val base = Dat.DerTree("0",conc,(SOME name), prems)
        
    in
      base
    end
    (* (App.apply_constraintL_Unifier (cons,sg)) *)
    fun cut_axiom (cut_rule,axiom, weakening) = 
        let

            fun check (cons,tree,(u_sb,u_cons)) = 
                let
                    val new_cons = App.apply_constraintL_Unifier (cons,u_sb)
                    val new_tree = App.apply_der_tree_Unifier(tree,u_sb)
                    val (new_cons,new_tree) = Ut.rename_ids (new_cons,new_tree)
                    val final_cons = new_cons@u_cons
                    val Dat.DerTree(_,new_base,_,_) = new_tree
                    val tree2 = Dat.DerTree("0",new_base,NONE,[])
                    val tree2 = Ut.fresh_tree(tree2)
                    val tree2_init = List.map (fn (_,a,b)=> (a,b)) (T.apply_rule(([],[],tree2),axiom,"0"))
                    fun res (_,Dat.DerTree(_,_,NONE,_)) = false
                        | res a = true
                in
                    (case List.find res tree2_init of
                       SOME t2 => ((new_cons,new_tree),SOME t2)
                     | NONE => ((new_cons,new_tree),Ut.check_premises'((new_cons,new_tree),([],tree2),weakening)))
                end

            (* create_base with cut already applied *)
            val base = cut_rule_to_tree(cut_rule)
            val Dat.Rule(_,_,axiom_conc,_) = axiom
            
            val (cons,tree) = ([],base)
            (* unify each premise with axiom, then apply unifier to tree *)
            val prems = T.get_premises_of(tree,"0")
            val axiom_applied = List.concat (List.mapPartial 
            (fn prem => U.Unify_seq(prem,axiom_conc)) prems)
            val new_tree_set = List.map 
            (fn unifier => check(cons,tree,unifier)) axiom_applied
            (* check if the tree with cut can be used to close the conc of 
            that tree without cut *)
            val result = (check_true new_tree_set,new_tree_set)
        in
            result
        end

    (* possible sollution *)
    fun cut_rank_reduction (cut_rule,other_rule,weakening) = 
        let
            val results = P.permute(cut_rule,other_rule,[],weakening)
            val pos = List.concat (List.map (fn ((pos,_),_) => pos) results)
            val neg = List.concat (List.map (fn ((_,neg),_) => neg) results)
            val pos = List.map (fn (t1,t2) => (t1,SOME t2)) pos
            val neg = List.map (fn t1 => (t1,NONE)) neg
        in
            (List.null neg,pos@neg)
        end
    
    fun mod_tree (tree,left_rule,right_rule) = 
        let

            fun fresh_base (seq) = Dat.DerTree("0",seq,NONE,[])

            fun apply_unifier(tree,(subs,cons)) = 
                let
                    val new_tree = App.apply_der_tree_Unifier(tree,subs)
                    val Dat.DerTree(_,new_base,_,_) = new_tree
                in
                    (new_tree,fresh_base new_base,cons)
                end

            val Dat.Rule(_,_,l_conc,_) = left_rule
            val Dat.Seq(_,_,r) = l_conc

            val Dat.Rule(_,_,r_conc,_) = right_rule
            val Dat.Seq(l,_,_) = r_conc
            
            (* assume at least 2 prems *)
            val Dat.DerTree(_,conc,_,prems) = tree
            val (prem1)::(prem2)::_ = prems
            
            val Dat.DerTree(_,Dat.Seq(l2,_,_),_,_) = prem1
            val Dat.DerTree(_,Dat.Seq(_,_,r2),_,_) = prem2

            val fake_seq = Dat.Seq(l,Dat.Con("f"),r)
            val fake_seq2 = Dat.Seq(l2,Dat.Con("f"),r2)

            val unifier = U.Unify_seq(fake_seq,fake_seq2)

            val result =  (case unifier of
               NONE => (tree,fresh_base conc,[])
             | SOME (u::_) => apply_unifier(tree,u))

        in
            result
        end

    fun cut_grade_reduction (cut_rule,(con,rulesL,rulesR),cut_formula,weakening) = 
        let
            fun mod_cut_rule (Dat.Rule(name,side,conc,prems),subs) = 
                let
                    val new_prems = List.map (fn prem => App.apply_seq_Unifier(prem,subs)) prems
                in
                    Dat.Rule(name,side,conc,new_prems)
                end
            

            fun product (left_rules,right_rules) = List.concat (List.map 
                (fn l_rule => List.map (fn r_rule => (l_rule,r_rule)) right_rules) left_rules)

            fun create_drt1 (cut_rule,rules_combo_list,main_sub) = 
                let
                    val new_cut = mod_cut_rule(cut_rule,main_sub)

                    val cut_applied = cut_rule_to_tree(new_cut)
                    fun apply_left_right (l_rule,r_rule) = 
                        let
                            val (cut_applied,new_base,new_cons) = mod_tree(cut_applied,l_rule,r_rule)
                            val cut_applied = [([],new_cons,cut_applied)]
                            val right_applied = List.concat (List.map 
                                (fn tree => T.apply_rule(tree,r_rule,"00")) cut_applied)
                            val both_applied = List.concat (List.map 
                                (fn tree => T.apply_rule(tree,l_rule,"01")) right_applied)
                            fun get_id (Dat.DerTree(id,_,_,_)) = id
                            val filtered = List.filter 
                            (fn (_,_,drt) => List.all (fn id => String.size(id)>2) 
                                (List.map (get_id) (T.get_open_prems(drt)))) both_applied
                            val forms_removed = List.map (fn (_,cons,drt) => (cons,drt)) filtered
                            val trees_final = List.map (Ut.rename_ids) forms_removed
                        in
                            (trees_final,new_base)
                        end
                    val combo_applied = (List.map apply_left_right rules_combo_list)


                in
                    combo_applied
                end

            fun find_proofs (drt1s,base,cut_rule,subformulas)=
                let

                    (* either cutting on one of the subformulas is enough,
                   or cutting on another subformula after that
                   need more examples *)
                    val cut_rules_subforms = List.map 
                        (fn frm => mod_cut_rule(cut_rule,[Dat.Fs(cut_formula,frm)])) subformulas
                    (* returns a list of trees where cut is applied on main formula,
                    followed by a rule applied on the cut formula*)
                    (* fun check_form_cut(trees,id) = 
                        let
                            val form_cut_applied' = List.map (fn tree => T.apply_rule(tree,form_cut,id)) trees
                            val form_cut_applied = List.concat form_cut_applied'

                            fun apply_left tree = List.concat (List.map 
                            (fn rule => T.apply_rule(tree,rule,id^"0")) left_rules)
                        in
                            List.concat (List.map apply_left form_cut_applied)
                        end *)
                    fun apply_cuts (trees,[],_) = trees
                        | apply_cuts (trees,cut_rule::rest,id) =  
                        let
                            val mapped = List.map (fn tree => T.apply_rule(tree,cut_rule,id)) trees
                        in
                            apply_cuts(List.concat(mapped),rest,id^"1")
                        end

                    fun find_proofs' (checked,[],_,_)= (checked,[])
                        |find_proofs' (checked,drts_to_check,cut_rules,num_to_apply)=
                        (case H.chooseDP(cut_rules,num_to_apply) of
                           [] => (checked,List.map (fn x => (x,NONE)) drts_to_check)
                         | rules => 
                            let
                                val all_trees = List.concat (List.map 
                                (fn rule_l => apply_cuts([([],[],base)],rule_l,"0")) rules)
                                val forms_removed = List.map (fn (_,a,b) => (a,b)) all_trees
                                val transformations = List.map 
                                (fn tree => (tree,(List.find (Option.isSome) (List.map
                                (fn tree2 => Ut.check_premises'(tree,tree2,weakening)) forms_removed)))) drts_to_check
                                val (found,rem) = List.partition (fn (_,b) => Option.isSome b) transformations
                                val found = List.map (fn (a,b) => (a,Option.valOf(b))) found

                            in
                                find_proofs'(found@checked,List.map (fn x => #1x) rem,cut_rules,num_to_apply+1)
                            end
                        )
                    
                in 
                    find_proofs'([],drt1s,cut_rules_subforms,1)
                end                   
                    
                    
                
                

            val Dat.Rule (_,_,check_rule,_) = 
            (case (rulesL,rulesR) of
               (x::_,_) => x
             | (_,x::_) => x
             | _ => raise Ut.Arity)
            

            val arity = 
            (case Ut.find_arity(con,check_rule) of
               NONE => raise Ut.Arity
             | SOME(x) => x)

            fun check_all (rules) = List.all (fn x => Ut.check_arity(con,arity,x)) rules

            val _ = (case (check_all rulesL, check_all rulesR)  of
                        (false,_) => raise Ut.Arity
                      | (_,false) => raise Ut.Arity
                      | _ => ())

            val chars = Char.ord #"A"
            val subforms = List.tabulate(arity,(fn i => Dat.Atom(Char.toString(Char.chr(chars+i)))))
            val con_form = Dat.Form(con,subforms)

            val og_sub = [Dat.Fs(cut_formula,con_form)]

            val rule_combinations = product(rulesL,rulesR)

            val drt1s = create_drt1 (cut_rule,rule_combinations,og_sub)

            val results = List.map (fn (trees,base) => find_proofs (trees,base,cut_rule,subforms)) drt1s

            val (pos_l,neg_l) = ListPair.unzip(results)


            val (pos,neg) = (List.concat pos_l, List.concat neg_l)
        in
            (List.null neg, pos@neg)
        end


    fun cut_elim' (cut_rule,connectives,axioms,weakening) = 
        let
            val (rule,formula) = cut_rule
            (* axioms *)
            val check = List.all (fn (bool,_) => bool)
            val axioms = List.map (fn axiom => cut_axiom(rule,axiom,weakening)) axioms
            val axioms_check = check axioms
            (* rank_reductions *)
            val all_rules = List.concat 
                (List.map (fn (_,rulesL,rulesR) => rulesL@rulesR) connectives)
            val rank_reductions = List.map 
                (fn rule2 => cut_rank_reduction(rule,rule2,weakening)) all_rules
            val rank_check = check rank_reductions
            (* grade_reductions *)
            val grade_reductions = List.map 
                (fn con => cut_grade_reduction(rule,con,formula,weakening)) connectives
            val grade_check = check grade_reductions
            val bool = axioms_check andalso rank_check andalso grade_check
        in
            (bool,axioms,rank_reductions,grade_reductions)        
        end

    fun cut_elim (cut_rules,connectives,axioms,weakening) = 
        List.map (fn rule => cut_elim'(rule,connectives,axioms,weakening)) cut_rules


    (* ~~~: seperates cut rules *)
    (* %%% seperates bool/axioms/rank/grade for a cut rule*)
    (* @@@: seperates rules/connectives *)
    (* ### seperates bool from proofs*)
    (* &&& seperates proofs*)
   
    (* Ut.print_helper *)
    val proof_join_fmt = {init = "", sep = "&&&", final = "", fmt = Ut.print_helper }

    fun rule_fmt (bool,proof_l) = 
        let
            val proof_l_string = ListFormat.fmt proof_join_fmt proof_l
            val bool_string = if bool then "T" else "F"
        in
            bool_string^"###"^proof_l_string
        end
    

    val rule_join_fmt = {init = "", sep = "@@@", final = "", fmt = rule_fmt}

    fun cut_rule_fmt (bool,axioms,rank,grade) =
        let
            val axioms_string = ListFormat.fmt rule_join_fmt axioms
            val rank_string = ListFormat.fmt rule_join_fmt rank
            val grade_string = ListFormat.fmt rule_join_fmt grade
            val bool_string = if bool then "Cut Admissibility Test Succeeds@@@The selected cut rule is admissible in this calculus. The proof tree transformations are shown below for each rule and connective." 
                                    else "Cut Admissibility Test Fails@@@The selected cut rule is not admissible in this calculus. There are proof tree transformations that could not be found for certain rules or connectives."
            val connector = "%%%"
        in
            bool_string^connector^axioms_string^connector^rank_string^connector^grade_string
        end

    val cut_rule_join_fmt = {init = "", sep = "~~~", final = "", fmt = cut_rule_fmt}

    fun cut_elim_print' fd input= 
        let


            val result = cut_elim' input

            val result = cut_rule_fmt result
        in
            Ut.writeFD fd result
        end


    fun cut_elim_print input = cut_elim_print' 3 input
    
end