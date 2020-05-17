(*  Sequoia  Copyright (C) 2020  Zan Naeem, Mohammed Hashim
    This program comes with ABSOLUTELY NO WARRANTY; for details see LICENSE.
    This is free software, and you are welcome to redistribute it
    under certain conditions; see LICENSE for details.
*)

structure IdExpansion =
struct
    structure Dat = datatypesImpl
    structure T = treefuncImpl
    structure Latex = latexImpl
    structure Ut = Utilities

      (* check which formula  *)
    fun init_coherence_con ((con:Dat.conn, rulesL: Dat.rule list, rulesR: Dat.rule list), init_rule: Dat.rule, axioms: Dat.rule list)=
        let
            val _ = Ut.set_to_1()
            val Dat.Rule (_,_,init_conc,_) = init_rule
            (* val init_rule = atomize_rule(init_rule) *)

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
            fun create_name (num) = Ut.set_color(Char.toString(Char.chr(num)))

            val con_form = Dat.Form(con,List.tabulate(arity,(fn i => Dat.Atom(create_name(chars+i) ) ) ) )


            val init_conc = Ut.seq_to_fresh(init_conc)

            (* changing forms of the init rule to con_form *)
            fun replace_forms_ctx (Dat.Ctx(vars,forms)) =
                (case forms of
                   [] => Dat.Ctx(vars,[])
                 | [_] => Dat.Ctx(vars,[con_form])
                 | _ => let val _ = print("init rule with multiple forms") in Dat.Ctx(vars,[con_form]) end)
            fun replace_forms' (Dat.Empty) = Dat.Empty
                | replace_forms' (Dat.Single(ctx)) = Dat.Single(replace_forms_ctx(ctx))
                | replace_forms' (Dat.Mult(con,ctx,rest)) = Dat.Mult(con,replace_forms_ctx(ctx),replace_forms'(rest))

            fun replace_forms(Dat.Seq(a,con,b)) = Dat.Seq(replace_forms'(a),con,replace_forms'(b))

            val base = Dat.DerTree("0",replace_forms(init_conc),NONE,[])

            (* testing if init rule can be applied to base *)

            val (_,test_con,test) = List.hd(T.apply_rule_everywhere(([],[],base),init_rule))
            val test = (test_con, test)
            
            val res = []
            fun stack (base,rules1,rules2,init) =
                let
                  (* applying 1 rule from rule1 to base *)
                  val r1 = List.map (fn x => T.apply_rule_everywhere(([],[],base),x)) rules1
                  val r1 = List.concat r1
                  (* applying every rule from rule 2 to each tree from r1 *)
                  (* val r2 = List.foldl (fn (rule2,trees) => List.concat (List.map (fn x => T.apply_rule_all_ways(x,rule2,false)) trees)) r1 rules2  *)
                  val r2 = List.concat (List.map (fn x => T.apply_multiple_rules_all_ways(x,rules2)) r1)

                in
                  r2
                end


            val rules_applied = stack(base,rulesL,rulesR,init_rule) @ stack(base,rulesR,rulesL,init_rule)

            
            (* filtering out trees where only 1 rule applied, then trees with open premises*)
            val axioms_applied = (case List.length(axioms) of
               0 => rules_applied
             | _ => List.concat (List.map (fn x => T.apply_multiple_rules_all_ways(x,axioms)) rules_applied))
            
            val init_applied = List.concat (List.map (fn (_,_,x) => T.apply_rule_everywhere(([],[],x),init_rule) ) axioms_applied)

            val init_applied_trees = List.filter (fn (forms,_,_)=> List.all (fn x => Ut.subformula (x,con_form) ) forms )  (init_applied)
            val init_applied_trees = List.map (fn (_,cons,tree) => (cons,tree)) init_applied_trees

            val both_applied = List.filter (fn (_,x) => T.get_tree_height(x) >1) init_applied_trees
            val no_open_prems = List.filter (fn (_,x) => (case T.get_open_prems(x) of
                                                    _::_ => false
                                                  | _ => true)) both_applied
            val res = no_open_prems
            (*  *)
            val _ = Ut.reset()
        in
            (* rules_applied *)
            (case res of
               x::_ => (true,(test, SOME x))
             | _ => (false,(test, NONE)))
        end

    fun init_coherence_mult_init ((forms,rulesL,rulesR), init_rules, axioms) = 
        let
            val results = List.map (fn rule => init_coherence_con((forms,rulesL,rulesR),rule,axioms)) init_rules
        in
            (case List.find (fn (x,_) => x) results of
               SOME x => x
             | NONE => List.hd(results) )
        end

    fun init_coherence ([]: (Dat.conn *Dat.rule list * Dat.rule list) list,_: Dat.rule list,_: Dat.rule list) = (true , [])
      | init_coherence (first_con::con_list,init_rules,axioms) = 
        let
            val (rest,proofs) = init_coherence(con_list,init_rules,axioms)
            val res as (result,_) = init_coherence_mult_init(first_con,init_rules,axioms) 
        in
          (rest andalso result , res::proofs)
        end

    fun init_coherence_print (a,b,c) = 
        (let
            val print_helper = Ut.print_helper
        in
            let val (bool, out) = init_coherence(a,b,c)
                val t = List.map(fn (bl,pf) => if bl 
                    then "T###"^print_helper(pf) else "F###"^print_helper(pf)) out
                val p = List.foldr (fn (a,b) => a^"@@@"^b) "" t
                val b = if bool then "T" else "F"
                val bp = b^"%%%"^p
            in Ut.writeFD 3 bp end
        end)
        handle (Ut.Arity) => Ut.writeFD 3 "Arity Problem%%%Temp"
end
