(*  Sequoia  Copyright (C) 2020  Zan Naeem, Mohammed Hashim
    This program comes with ABSOLUTELY NO WARRANTY; for details see LICENSE.
    This is free software, and you are welcome to redistribute it
    under certain conditions; see LICENSE for details.
*)

structure Permute =
struct

    structure D = datatypesImpl
    structure T = treefuncImpl
    structure Latex = latexImpl
    structure App = applyunifierImpl
    structure U = unifyImpl
    structure Ut = Utilities

    fun permute(rule1, rule2, init_rule_ls, weak) =
        let
            val _ = Ut.set_to_1()
            fun get_ctx_var(D.Empty,D.Empty) =
                [(D.CtxVar (NONE,"Gamma_" ^ Int.toString(1)),[],[])] 
                | get_ctx_var(D.Single (D.Ctx (v1,_)), D.Single (D.Ctx (v2,_))) =
                [(D.CtxVar (NONE,"Gamma_" ^ Int.toString(1)),v1,v2)] 
                | get_ctx_var(D.Mult (_, D.Ctx(v1,_), r1), D.Mult (_, D.Ctx(v2,_), r2)) =
                (D.CtxVar (NONE,"Gamma_" ^ Int.toString(1)),v1,v2) :: get_ctx_var(r1, r2) 
                | get_ctx_var(_,_) = raise Fail "getting constraint from sequents with a different number of contexts"


            fun create_base(rule1, rule2) =
                let val D.Rule(name1, side1, sq1, premises1) = rule1
                    val D.Rule(name2, side2, sq2, premises2) = rule2
                    val start = Ut.generic_seq sq1
                    val sq1 = Ut.generic_ctx_var sq1
                    val sq2 = Ut.generic_ctx_var sq2
                    val sb1 = (case U.Unify_seq(start, sq1) of
                        SOME(sigscons1) =>
                            List.map(fn (sg, cn) => App.apply_seq_Unifier(start,sg)) sigscons1
                        | NONE => [])
                    val sb1 = List.map Ut.generic_ctx_var sb1
                    val sb2 = List.concat(List.map(fn s1 => (case U.Unify_seq(s1, sq2) of
                        SOME(sigscons2) =>
                            List.map(fn (sg, cn) => App.apply_seq_Unifier(s1,sg))sigscons2
                        | NONE => []))sb1)
                    val sb2 = List.map Ut.generic_ctx_var sb2
                    val atom_seqs = List.map T.atomic_transform sb2
                in atom_seqs end
            
            

            fun create_constraint( D.Seq(l1,_,r1),  D.Seq(l2,_,r2)) =  get_ctx_var(l1,l2) @ get_ctx_var(r1,r2)

            fun check_premises(opens1, opens2, weak) =
                let
                    fun filter_func (cn,dvt) = (T.get_tree_height(dvt) >1)
                    fun filter_short (s1,s2) = (List.filter filter_func s1,List.filter filter_func s2)

                    val set_base_pairs = ListPair.zip(opens1,opens2)
                    (*remove all trees where only 1 rule is applied*)
                    val set_base_pairs = List.map (filter_short) set_base_pairs
                    (*remove sets with no trees in set 1 or no trees in set 2*)
                    val set_base_pairs = List.filter (fn (y::_,x::_) => true | (_,_) => false) set_base_pairs

                    val set_base_pairs = List.map (fn (x,y) => ( List.map (fn (tree) => Ut.rename_ids(tree)) x ,y)) set_base_pairs

                    fun find (tree1,t2s,weak) = List.find (fn x => true) (List.mapPartial (fn (tree2) => Ut.check_premises'(tree1,tree2,weak)) t2s )

                    fun set_check (set1,set2)  = ( List.map (fn tree1 =>
                            ((tree1,find(tree1,set2,weak)))
                        ) set1 , set2)

                    fun seperate' ([],res) = res
                        | seperate' ((x,SOME y)::L,(res1,res2)) = seperate'(L,((x,y)::res1,res2))
                        | seperate' ((x,NONE)::L,(res1,res2)) = seperate'(L,(res1,x::res2))

                    fun seperate (L) = seperate' (L,([],[]))

                    val test_results = List.map (set_check) set_base_pairs
                in
                    List.map (fn (x,y) => (seperate(x),y)) test_results
                end

            fun stack_rules(bases, rule1, rule2, init_rule_ls) =
                List.map (fn tree =>
                    let val temp = T.apply_rule_everywhere(([], [], tree), rule1)
                        (* val _ = print ("\n ________ temp len : " ^ (Int.toString(List.length(temp))) ^ "________\n") *)
                        val dvr_lst = List.concat(List.map(fn tree =>
                                        T.apply_rule_all_ways(tree, rule2, true)) temp)
                        (* val _ = print ("\n ________ dvr len : " ^ (Int.toString(List.length(dvr_lst))) ^ "________\n") *)
                        


                        fun apply_init_rule_all_trees (rule,trees) = List.concat (List.map (fn (tree) =>
                                                            T.apply_rule_everywhere(tree,rule)) trees)



                        val final = List.foldr apply_init_rule_all_trees dvr_lst init_rule_ls
                        
                        (* val _ = List.app (fn (_,_,t) => List.app (fn (D.DerTree(_,seq,_,_)) => print (D.seq_toString(seq)^"\n")) (T.get_open_prems(t))) final
                        val _ = print "\n\n\n____\n\n\n" *)
                        (* val _ = print ("\n ________ final len : " ^ (Int.toString(List.length(final))) ^ "________\n") *)
                    in
                        List.map(fn(_,cn,ft) => (cn,ft)) final
                    end) bases

            val D.Rule(name1, side1, conc1, premises1) = rule1
            val D.Rule(name2, side2, conc2, premises2) = rule2
            val () = Ut.set_u_index(1)
            val rule1 = Ut.update_rule(rule1, Ut.set_color)
            val rule2 = Ut.update_rule(rule2, Ut.set_color2)

            val bases = (create_base(rule1, rule2))
            (* val _ = print("\n ________base : || " ^ (Dat.seq_toString(List.hd(bases))) ^ " || ___________\n") *)
            val bases_pairs = List.map (fn conc => (D.DerTree("0",Ut.seq_to_fresh(conc),NONE,[]),D.DerTree("0",Ut.seq_to_fresh(conc),NONE,[]))) bases
            (* val _ = print ("\n________ number of bases : "^ (Int.toString(List.length(bases_pairs))) ^"_______\n") *)
            val rule1' = rule1
            val rule2' = rule2

            val (bases1 , bases2 ) = ListPair.unzip(bases_pairs)

            val opens1 = stack_rules(bases1, rule1', rule2', init_rule_ls)

            (* val _ = print ("\n__________ opens1 bases 1 length: "^ (Int.toString(List.length(List.hd(opens1))))^ "_______\n") *)

            val opens2 = stack_rules(bases2, rule2', rule1', init_rule_ls)
            (* val _ = print ("\n__________ opens2 bases 1 length: "^ (Int.toString(List.length(List.hd(opens2))))^ "_______\n") *)

            val _ = Ut.reset()
        in
            check_premises(opens1,opens2,weak)
        end



    fun result_to_latex_strings ((true_list,fail_list)) = 
        let 
            fun latex_res ((clist1,tree1),(clist2,tree2)) = 
                "$$"^Latex.der_tree_toLatex2(tree1)^"$$"
                ^"$$"^Ut.constraintL_toString(clist1)^"$$"
                ^"$$ \\leadsto $$"
                ^"$$"^Latex.der_tree_toLatex2(tree2)^"$$"
                ^"$$"^Ut.constraintL_toString(clist2)^"$$"
        in
            let val true_strings = List.map (latex_res) true_list
                val fail_strings = List.map (fn (cl,dvt) => "$$"^Latex.der_tree_toLatex2(dvt)^"$$"
                                                            ^"$$"^Ut.constraintL_toString(cl)^"$$") fail_list
                val true_string = List.foldr (fn (x,y) => x^"###"^y) "" true_strings
                val fail_string = List.foldr (fn (x,y) => x^"###"^y) "" fail_strings
            in true_string^"&&&"^fail_string end
        end

    fun permute_res ((right,wrong)) = 
        (case (List.length(right),List.length(wrong)) of
            ( 0 , 0 ) => "0"
            | (_ , 0) => "1"
            | (0,_) => "2"
            | (_,_) => "3")
    fun permute_res_to_string (res) = 
        let
            val remove_set2 = List.map (fn ((a,b),c) => (a,b)) res
            val union = List.foldr (fn ((a,b),(c,d)) => (a@c,b@d)) ([],[]) remove_set2
        in
            permute_res(union)^"%%%"^result_to_latex_strings(union)
        end

    fun permute_final A = permute_res_to_string(permute(A))

    fun permute_print A = Ut.writeFD 3 (permute_res_to_string(permute(A)))
end
