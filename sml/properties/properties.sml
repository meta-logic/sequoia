structure StringKey:ORD_KEY = 
struct
    type ord_key = string
    val compare = String.compare
end

structure Properties : PROPERTIES = 
struct
    structure D = datatypesImpl
    structure Dat = D
    structure H = helpersImpl

    structure T = treefuncImpl

    structure App = applyunifierImpl
    structure U = unifyImpl
    structure E = Equivalence
    structure Set = SplaySetFn(StringKey);

    type constraint = D.ctx_var * (D.ctx_var list) * (D.ctx_var list)



    val other_fresh = ref 1000000;
    val term_fresh = ref 10000;
    val fresher = ref 523;
    val rule_fresh = ref 1

    fun generic_seq( D.Seq(a, c, b)) = 
        let 
            fun gen_out(D.Empty) = D.Empty
                | gen_out(D.Single(D.Ctx(vl,fl))) = 
                let val () = () in other_fresh := !other_fresh + 1;
                D.Single(D.Ctx([D.CtxVar ("Gamma_{" ^ Int.toString(!other_fresh)^"}")],nil)) end
                | gen_out(D.Mult(con,D.Ctx(vl,fl),rest)) = 
                let val () = () in other_fresh := !other_fresh + 1; 
                D.Mult(con,D.Ctx([D.CtxVar ("Gamma_{" ^ Int.toString(!other_fresh)^"}")],nil),gen_out rest) end
        in
             D.Seq(gen_out a, c, gen_out b)
        end
    (*
        fun weak_admissability(rules) = 
            let val D.Rule(name, side, sequent, premises) = List.hd(rules)
                val general = generic_seq sequent
                val term = let val () = () in term_fresh := !term_fresh + 1;
                        D.Form(Int.toString !term_fresh) end
                fun add_term_ctx_struct(D.Empty, term) = [D.Empty]
                    | add_term_ctx_struct(D.Single(D.Ctx(vl,fl)), term) = [D.Single(D.Ctx(vl,fl@term))]
                    | add_term_ctx_struct(D.Mult(con,D.Ctx(vl,fl),rest), term) = 
                        let val beginning = D.Mult(con,D.Ctx(vl,fl@term),rest) 
                            val ladder = List.map(fn r =>  D.Mult(con,D.Ctx(vl,fl), r))(add_term_ctx_struct rest)
                        in beginning :: ladder end
                fun add_term_seq( D.Seq(l,c,r), term) = 
                    List.map(fn strct =>  D.Seq(strct,c,r))(add_term_ctx_struct(l,term))
                    @ List.map(fn strct =>  D.Seq(l,c,strct))(add_term_ctx_struct(r,term))
                fun get_start(D.Rule(nm, sd, sq, pm), gen) = 
                    (case U.Unify_seq(gen, sq) of NONE => NONE 
                    | SOME(sgcn) => SOME(List.hd(List.map(fn (sg,cn) => App.apply_seq_Unifier(gen,sg))sgcn)))
                fun check(rule, st, term) = (case st of NONE => false | SOME(start) =>
                    let 
                    val premises_ls = List.map (fn tree => get_open_prems tree)
                        (apply_rule(([],[],D.DerTree("0",start,D.NoRule,[])), rule, "0"))
                    val start_added = add_term_seq(start,term)
                    val s = List.map(fn nsq => get_start(rule, nsq))start_added
                    in
                    s
                    end)
            in
            true
            end
                    

    fun init_coherence(con_form, rulesL, rulesR, init_rule_ls) =
        let 
            fun empty_out_ctx(D.Empty) = D.Empty
                | empty_out_ctx(D.Single(D.Ctx(vl,fl))) = D.Single(D.Ctx(nil,fl))
                | empty_out_ctx(D.Mult(con,D.Ctx(vl,fl),rest)) = D.Mult(con,D.Ctx(nil,fl),empty_out_ctx rest)

            fun empty_out_seq( D.Seq(a, c, b)) =  D.Seq(empty_out_ctx a, c, empty_out_ctx b)

            fun init_coh_aux(con_form, rules1, rules2, init_rule_ls) =
                let val start_seqs = 
                            List.map(fn D.Rule(name_init, side_init, conc_init, premises_init) => 
                                let val form_subs = List.map(fn frm => Fs(frm, con_form))(get_forms(conc_init))
                                    val new_sq = T.atomic_transform
                                    (App.apply_seq_Unifier(empty_out_seq conc_init, form_subs))
                                in (D.DerTree("0",new_sq,D.NoRule,[])) end)init_rule_ls
                    val fst_apply = 
                            List.foldl(fn (tree, ls) => 
                                apply_multiple_rules_all_ways(([], [], tree), rules1) @ ls
                            )([])start_seqs
                    val snd_apply = 
                            List.foldl(fn ((_, constraints, tree), ls) => 
                                apply_multiple_rules_all_ways(([], constraints, tree), rules2) @ ls
                            )([])fst_apply
                    val init_apply = 
                            List.foldl(fn ((_, constraints, tree), ls) => 
                                apply_multiple_rules_all_ways(([], constraints, tree), init_rule_ls) @ ls
                            )([])snd_apply
                in 
                    List.exists(fn (fm,_,dt) => closed_tree dt
                    andalso 
                    List.all(fn f => form_larger(con_form, f))fm)init_apply 
                    
                end
        in 
            init_coh_aux(con_form, rulesL, rulesR, init_rule_ls) 
            orelse 
            init_coh_aux(con_form, rulesR, rulesL, init_rule_ls)
        end
    *)



    fun update_ctx_var (Dat.CtxVar(x)) = Dat.CtxVar(x^"_{r"^(Int.toString(!rule_fresh))^"}")

    fun update_ctx (Dat.Ctx(ctx_vars,forms)) = Dat.Ctx(List.map update_ctx_var ctx_vars,forms)
    
    fun update_ctx_struct (Dat.Empty) = Dat.Empty
        | update_ctx_struct (Dat.Single(ctx)) = Dat.Single(update_ctx(ctx))
        | update_ctx_struct (Dat.Mult(conn,ctx,ctx_strct)) = Dat.Mult(conn,update_ctx(ctx), update_ctx_struct(ctx_strct))

    fun update_seq (Dat.Seq(l,conn,r)) = Dat.Seq(update_ctx_struct(l),conn,update_ctx_struct(r))

    fun update_rule (Dat.Rule(nm,side,conc,prems)) =
        let
            val new_conc = update_seq(conc)
            val new_prems = List.map update_seq prems
            val _ = rule_fresh := ((!rule_fresh) + 1)
        in
            Dat.Rule(nm,side,new_conc,new_prems)
        end




    fun string_to_fresh(x) = 
        let
            val (x2,_) = (x^"_{"^ (Int.toString(!fresher))^"}",fresher:= !fresher + 1)
        in
            x2
        end


    fun form_to_fresh(x) = x


    fun ctx_var_to_fresh(D.CtxVar(x)) = D.CtxVar(string_to_fresh(x))

    fun ctx_to_fresh(D.Ctx(ctx_vars,forms)) = D.Ctx(List.map ctx_var_to_fresh ctx_vars,List.map form_to_fresh forms)

    fun ctx_struct_to_fresh(D.Empty) = D.Empty
        | ctx_struct_to_fresh (D.Single (ctx)) = D.Single(ctx_to_fresh(ctx))
        | ctx_struct_to_fresh (D.Mult (con,ctx,ctx_struct)) = D.Mult(con,ctx_to_fresh(ctx),ctx_struct_to_fresh(ctx_struct))

    fun seq_to_fresh(D.Seq(ctx_s,con,ctx_s2)) = D.Seq(ctx_struct_to_fresh(ctx_s),con,ctx_struct_to_fresh(ctx_s2))


    fun print_seq_list (nil) = print "\n_______________________________\n"
        | print_seq_list (x::L) = let
            val _ = print (D.seq_toString(x)^"\n")
        in
            print_seq_list(L)
        end

    fun get_ctx_var_ctx (D.Ctx(A,_)) = A

    fun get_ctx_var_ctx_struct (D.Empty) = []
        | get_ctx_var_ctx_struct (D.Single (ctx)) = get_ctx_var_ctx ctx
        | get_ctx_var_ctx_struct (D.Mult (_,ctx,ctx_struct)) = get_ctx_var_ctx(ctx)@get_ctx_var_ctx_struct(ctx_struct)
    
    fun get_ctx_var_seq ( D.Seq(A,_,B)) = get_ctx_var_ctx_struct(A)@get_ctx_var_ctx_struct(B)

    fun get_ctx_vars_der_tree (D.DerTree(_,S,_,L)) = get_ctx_var_seq(S)@get_ctx_vars_der_tree_list(L)
    and get_ctx_vars_der_tree_list ([]) = []
        |get_ctx_vars_der_tree_list (D::L) = get_ctx_vars_der_tree(D)@get_ctx_vars_der_tree_list(L)

    fun get_ctx_vars_from_constraint((_,A,B)) = A@B

    fun get_ctx_vars_from_constraints(nil) = []
        |get_ctx_vars_from_constraints(x::L) = get_ctx_vars_from_constraint(x)@get_ctx_vars_from_constraints(L)


    val last1 = ref (D.DerTree("",D.Seq(D.Empty,D.Con(""),D.Empty),D.NoRule,[]))
    val last2 = ref (D.DerTree("",D.Seq(D.Empty,D.Con(""),D.Empty),D.NoRule,[]))


    fun check_premises'((cn1,dvt1),(cn2,dvt2)) =
        let 
            val D.DerTree(_,sq1,_,_) = dvt1
            val D.DerTree(_,sq2,_,_) = dvt2
            val t1_prems = List.map (fn (D.DerTree(_,seq,_,_)) => seq) (T.get_open_prems(dvt1))
            val t2_prems = List.map (fn (D.DerTree(_,seq,_,_)) => seq) (T.get_open_prems(dvt2))
            (*val goal = create_constraint(sq1,sq2)*)
            val constraints = cn1@cn2 
            (*val _ = last1 := dvt1*)
            (*val _ = last2 := dvt2*)
            val t1_vars = List.map (fn (D.CtxVar(x))=>x) (get_ctx_vars_der_tree(dvt1)@get_ctx_vars_from_constraints(cn1))
            val t2_vars = List.map (fn (D.CtxVar(x))=>x) (get_ctx_vars_der_tree(dvt2)@get_ctx_vars_from_constraints(cn2))
            val t1_vars = Set.listItems(Set.addList(Set.empty,t1_vars))
            val t2_vars = Set.listItems(Set.addList(Set.empty,t2_vars))
            val t1_vars = List.map (fn x => D.CtxVar(x)) t1_vars
            val t2_vars = List.map (fn x => D.CtxVar(x)) t2_vars
(*            val _ = print_seq_list(t1_prems)
            val _ = print_seq_list(t2_prems)
            val _ = print ("\n\n\n")*)
            val res = E.check_premises(t1_prems,t2_prems,constraints,[],[],t1_vars,t2_vars)
            (*val _ = if res then print("true\n\n\n\n\n\n\n") else print("false\n\n\n\n\n\n\n")*)
        in
            res
        end



    (*TODO: if you can't apply a rule twice, should not return true*)
    fun permutes(rule1, rule2, init_rule_ls, weak_left, weak_right) = 
        let 
            fun get_ctx_var(D.Empty,D.Empty) = 
                let val () = () in other_fresh := !other_fresh + 1; 
                [(D.CtxVar ("Gamma_" ^ Int.toString(!other_fresh)),[],[])] end
                | get_ctx_var(D.Single (D.Ctx (v1,_)), D.Single (D.Ctx (v2,_))) = 
                let val () = () in other_fresh := !other_fresh + 1; 
                [(D.CtxVar ("Gamma_" ^ Int.toString(!other_fresh)),v1,v2)] end
                | get_ctx_var(D.Mult (_, D.Ctx(v1,_), r1), D.Mult (_, D.Ctx(v2,_), r2)) =
                let val () = () in other_fresh := !other_fresh + 1; 
                (D.CtxVar ("Gamma_" ^ Int.toString(!other_fresh)),v1,v2) :: get_ctx_var(r1, r2) end
                | get_ctx_var(_,_) = raise Fail "getting constraint from sequents with a different number of contexts"


            fun create_base(rule1, rule2) = 
                let val D.Rule(name1, side1, sq1, premises1) = rule1
                    val D.Rule(name2, side2, sq2, premises2) = rule2 
                    val start = generic_seq sq1 
                    val sb1 = (case U.Unify_seq(start, sq1) of
                        SOME(sigscons1) => 
                            List.map(fn (sg, cn) => App.apply_seq_Unifier(start,sg))sigscons1 
                        | NONE => [])
                    val sb2 = List.concat(List.map(fn s1 => (case U.Unify_seq(s1, sq2) of
                        SOME(sigscons2) => 
                            List.map(fn (sg, cn) => App.apply_seq_Unifier(s1,sg))sigscons2 
                        | NONE => []))sb1)
                    val atom_seqs = List.map T.atomic_transform sb2
                in atom_seqs end

            fun create_constraint( D.Seq(l1,_,r1),  D.Seq(l2,_,r2)) =  get_ctx_var(l1,l2) @ get_ctx_var(r1,r2)

            fun check_premises(opens1, opens2, weak_left, weak_right) =
                let 
                    fun filter_func (cn,dvt) = (T.get_tree_height(dvt) >1)
                    fun filter_short (s1,s2) = (List.filter filter_func s1,List.filter filter_func s2)

                    val set_base_pairs = ListPair.zip(opens1,opens2)
                    (*remove all trees where only 1 rule is applied*)
                    val set_base_pairs = List.map (filter_short) set_base_pairs
                    (*remove sets with no trees in set 1 or no trees in set 2*)
                    val set_base_pairs = List.filter (fn (y::_,x::_) => true | (_,_) => false) set_base_pairs 

                    

                    fun set_check (set1,set2)  = (List.map (fn (cn1,dvt1) =>
                            ((List.find (fn (cn2,dvt2) =>
                                check_premises' ((cn1,dvt1),(cn2,dvt2))
                            )set2)   ,(cn1,dvt1))
                        )set1,set2)

                    fun seperate' ([],res) = res
                        | seperate' ((SOME (_,y),(_,x))::L,(res1,res2)) = seperate'(L,((x,y)::res1,res2))
                        | seperate' ((NONE,x)::L,(res1,res2)) = seperate'(L,(res1,x::res2))

                    fun seperate (L) = seperate' (L,([],[]))

                    val test_results = List.map (set_check) set_base_pairs
                in
                    List.map (fn (x,y) => (seperate(x),y)) test_results
                end

            fun stack_rules(bases, rule1, rule2, init_rule_ls) =
                List.map (fn tree => 
                    let val temp = T.apply_rule_everywhere(([], [], tree), rule1)
                        val dvt_lst = List.concat(List.map(fn tree => 
                                        T.apply_rule_all_ways(tree, rule2, true)) temp)
                        (*TODO: not sure what this line does*)
                        (*val final = List.concat(List.map(fn tree  => 
                                        List.concat(List.map(fn init_rule => 
                                        T.apply_rule_everywhere(tree, init_rule))init_rule_ls))dvt_lst)*)
                    in 
                        List.map(fn(_,cn,ft) => (cn,ft)) dvt_lst 
                    end) bases 

            val D.Rule(name1, side1, conc1, premises1) = rule1
            val D.Rule(name2, side2, conc2, premises2) = rule2 
            val bases = (create_base(rule1, rule2))
            val bases = List.map(fn conc => D.DerTree("0",seq_to_fresh(conc),D.NoRule,[])) bases
            val opens1 = stack_rules(bases, rule1, rule2, init_rule_ls)
            val bases = List.map(fn D.DerTree("0",conc,D.NoRule,[]) => D.DerTree("0",seq_to_fresh(conc),D.NoRule,[])) bases
            val rule1 = update_rule(rule1)
            val rule2 = update_rule(rule2)
            val opens2 = stack_rules(bases, rule2, rule1, init_rule_ls)


        in 
            check_premises(opens1,opens2,false,false)
            (*check_premises(opens1, opens2, false, false)*)
            (* List.map(fn (_,sls,s) => (List.map(seq_toString)sls, seq_toString s))(List.hd(opens1)) *)
            (* List.map(fn t => der_tree_toString t)bases *)
            (* List.map(fn a => List.map(fn (_,_,t) => der_tree_toString t)a)opens1 *)
            (* List.map(fn t => der_tree_toString t)opens1 *)
        end


    (* fun permutabilty(rule1, other_rules, init_rule_ls, weak_left, weak_right) =
        List.all(fn (rule2, valid) => 
            permutes(rule1, rule2, init_rule_ls, weak_left, weak_right))other_rules *)












    fun test_1() =
        let 
        val cf = D.Form (D.Con "@", [D.FormVar "R", D.FormVar "S"])

        val a = D.Single (D.Ctx([D.CtxVar "G1"], [D.Form (D.Con "@", [D.FormVar "A", D.FormVar "B"])]))
        val b = D.Single (D.Ctx([], [D.FormVar "C"]))
        val c = D.Single (D.Ctx([D.CtxVar "G1"], [D.FormVar "A", D.FormVar "B"]))
        val d = D.Single (D.Ctx([], [D.FormVar "C"]))
        val rl1 = D.Rule("and", D.Left,  D.Seq(a, D.Con "|-", b),  [ D.Seq(c, D.Con "|-", d)])

        val e = D.Single (D.Ctx([D.CtxVar "G2"], []))
        val f = D.Single (D.Ctx([], [D.Form (D.Con "@", [D.FormVar "X", D.FormVar "Y"])]))
        val g = D.Single (D.Ctx([D.CtxVar "G2"], []))
        val h = D.Single (D.Ctx([], [D.FormVar "X"]))
        val i = D.Single (D.Ctx([D.CtxVar "G2"], []))
        val j = D.Single (D.Ctx([], [D.FormVar "Y"]))
        val rl2 = D.Rule("and", D.Right,  D.Seq(e, D.Con "|-", f),  [ D.Seq(g, D.Con "|-", h), D.Seq(i, D.Con "|-", j)])

        val k = D.Single (D.Ctx([D.CtxVar "G3"], [D.FormVar "F"]))
        val l = D.Single (D.Ctx([], [D.FormVar "F"]))
        val rl3 = D.Rule("init", D.None,  D.Seq(k, D.Con "|-", l),  [])

        in 
        (* init_coherence(cf, [rl1], [rl2], [rl3]) *)
        permutes(rl1, rl2, [rl3], false, false)
        end

    fun test_2() =
        let 
        val cf = D.Form (D.Con "o", [D.FormVar "R"])

        val a = D.Single (D.Ctx([D.CtxVar "G1"], [D.Form (D.Con "o", [D.FormVar "A"])]))
        val b = D.Single (D.Ctx([], [D.Form (D.Con "o", [D.FormVar "B"])]))
        val c = D.Single (D.Ctx([D.CtxVar "G1"], [D.Form (D.Con "o", [D.FormVar "A"]), D.FormVar "A"]))
        val d = D.Single (D.Ctx([], [D.Form (D.Con "o", [D.FormVar "B"])]))
        val rl1 = D.Rule("circle", D.Left,  D.Seq(a, D.Con "|-", b),  [ D.Seq(c, D.Con "|-", d)])

        val e = D.Single (D.Ctx([D.CtxVar "G2"], []))
        val f = D.Single (D.Ctx([], [D.Form (D.Con "o", [D.FormVar "T"])]))
        val g = D.Single (D.Ctx([D.CtxVar "G2"], []))
        val h = D.Single (D.Ctx([], [D.FormVar "T"]))
        val rl2 = D.Rule("circle", D.Right,  D.Seq(e, D.Con "|-", f),  [ D.Seq(g, D.Con "|-", h)])

        val k = D.Single (D.Ctx([D.CtxVar "G3"], [D.FormVar "F"]))
        val l = D.Single (D.Ctx([], [D.FormVar "F"]))
        val rl3 = D.Rule("init", D.None,  D.Seq(k, D.Con "|-", l),  [])

        in 
        (* init_coherence(cf, [rl1], [rl2], [rl3]) *)
        permutes(rl1, rl2, [rl3], false, false)
        end

    fun test_3() =
        let 
        val cf = D.Form (D.Con "v", [D.FormVar "R", D.FormVar "S"])

        val a = D.Single (D.Ctx([D.CtxVar "G1"], []))
        val b = D.Single (D.Ctx([], [D.Form (D.Con "v", [D.FormVar "A", D.FormVar "B"])]))
        val c = D.Single (D.Ctx([D.CtxVar "G1"], []))
        val d = D.Single (D.Ctx([], [D.FormVar "A"]))
        val rl1 = D.Rule("or", D.Right,  D.Seq(a, D.Con "|-", b),  [ D.Seq(c, D.Con "|-", d)])

        val w = D.Single (D.Ctx([D.CtxVar "G2"], []))
        val x = D.Single (D.Ctx([], [D.Form (D.Con "v", [D.FormVar "Q", D.FormVar "H"])]))
        val y = D.Single (D.Ctx([D.CtxVar "G2"], []))
        val z = D.Single (D.Ctx([], [D.FormVar "H"]))
        val rl2 = D.Rule("or", D.Right,  D.Seq(w, D.Con "|-", x),  [ D.Seq(y, D.Con "|-", z)])

        val e = D.Single (D.Ctx([D.CtxVar "G3"], [D.Form (D.Con "v", [D.FormVar "X", D.FormVar "Y"])]))
        val f = D.Single (D.Ctx([], [D.FormVar "C"]))
        val g = D.Single (D.Ctx([D.CtxVar "G3"], [D.FormVar "X"]))
        val h = D.Single (D.Ctx([], [D.FormVar "C"]))
        val i = D.Single (D.Ctx([D.CtxVar "G3"], [D.FormVar "Y"]))
        val j = D.Single (D.Ctx([], [D.FormVar "C"]))
        val rl3 = D.Rule("or", D.Left,  D.Seq(e, D.Con "|-", f),  [ D.Seq(g, D.Con "|-", h), D.Seq(i, D.Con "|-", j)])

        val k = D.Single (D.Ctx([D.CtxVar "G4"], [D.FormVar "F"]))
        val l = D.Single (D.Ctx([], [D.FormVar "F"]))
        val rl4 = D.Rule("init", D.None,  D.Seq(k, D.Con "|-", l),  [])

        in 
        (* init_coherence(cf, [rl1, rl2], [rl3], [rl4]) *)
        permutes(rl1, rl3, [rl4], false, false)
        end
end
