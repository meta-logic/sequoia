structure CutElim =
struct
    structure Dat = datatypesImpl
    structure H = helpersImpl
    structure T = treefuncImpl
    structure Latex = latexImpl
    structure App = applyunifierImpl
    structure Ut = Utilities
    structure P = Permute

    fun cut_axiom _ = raise Fail "Unimplemented"

    (* possible sollution *)
    fun cut_rank_reduction (cut_rule,other_rule,weakening) = P.permute(cut_rule,other_rule,[],weakening)

    fun cut_grade_reduction (cut_rule,(con,rulesL,rulesR),cut_formula,weakening) = 
        let
            fun mod_cut_rule (Dat.Rule(name,side,conc,prems),subs) = 
                let
                    val new_prems = List.map (fn prem => App.apply_seq_Unifier(prem,subs)) prems
                in
                    Dat.Rule(name,side,conc,new_prems)
                end
            fun create_base (Dat.Rule(_,_,conc,_)) = 
                Dat.DerTree("0",Ut.generic_ctx_var conc,NONE,[])

            fun product (left_rules,right_rules) = List.concat (List.map 
                (fn l_rule => List.map (fn r_rule => (l_rule,r_rule)) right_rules) left_rules)

            fun create_drt1 (base,cut_rule,rules_combo_list,main_sub) = 
                let
                    val new_cut = mod_cut_rule(cut_rule,main_sub)
                    val cut_applied = (T.apply_rule(([],[],base),new_cut,"0"))
                    fun apply_left_right (l_rule,r_rule) = 
                        let
                            val right_applied = List.concat (List.map 
                                (fn tree => T.apply_rule(tree,r_rule,"00")) cut_applied)
                            val _  = print (Int.toString(List.length(right_applied)))
                            val _ = print ("\n")
                            val both_applied = List.concat (List.map 
                                (fn tree => T.apply_rule(tree,l_rule,"01")) right_applied)
                            val _  = print (Int.toString(List.length(both_applied)))
                            val _ = print ("\n")
                            fun get_id (Dat.DerTree(id,_,_,_)) = id
                            val filtered = List.filter 
                            (fn (_,_,drt) => List.all (fn id => String.size(id)>0) 
                                (List.map (get_id) (T.get_open_prems(drt)))) both_applied
                            val _  = print (Int.toString(List.length(filtered)))
                            val _ = print ("\n")
                        in
                            List.map (fn (_,cons,drt) => (cons,drt)) filtered
                        end
                    val combo_applied = List.concat(List.map apply_left_right rules_combo_list)


                in
                    List.map (Ut.rename_ids) combo_applied
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

                    fun find_proofs (checked,[],_,_)= (checked,[])
                        |find_proofs (checked,drts_to_check,cut_rules,num_to_apply)=
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
                                find_proofs(found@checked,List.map (fn x => #1x) rem,cut_rules,num_to_apply+1)
                            end
                        )
                in 
                    find_proofs([],drt1s,cut_rules_subforms,1)
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

            val base = create_base(cut_rule)

            val rule_combinations = product(rulesL,rulesR)

            val drt1s = create_drt1 (base,cut_rule,rule_combinations,og_sub)
            val _ = print (Int.toString (List.length(drt1s)))

        in
            find_proofs (drt1s,base,cut_rule,subforms)
        end

    fun cut_elim _ = raise Fail "Unimplemented"
end