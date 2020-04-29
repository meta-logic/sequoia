(*  Sequoia  Copyright (C) 2020  Zan Naeem, Mohammed Hashim
    This program comes with ABSOLUTELY NO WARRANTY; for details see LICENSE.
    This is free software, and you are welcome to redistribute it
    under certain conditions; see LICENSE for details.
*)

structure Properties : PROPERTIES =
struct
    structure D = datatypesImpl
    structure Ut = Utilities
    structure Id = IdExpansion
    structure W = Weakening
    structure P = Permute
    structure C = CutElim

    type constraint = D.ctx_var * (D.ctx_var list) * (D.ctx_var list)
    type tree = constraint list * D.der_tree
	type proof = tree * (tree option)



    val check_premises' = Ut.check_premises'


    val init_coherence_con = Id.init_coherence_con

	val init_coherence_mult_init = Id.init_coherence_mult_init

	
	val init_coherence = Id.init_coherence

    val init_coherence_print = Id.init_coherence_print    

    val weakening_rule_context = W.weakening_rule_context
	val weakening_context = W.weakening_context
	val weakening_proofs = W.weakening_proofs
	val weakening = W.weakening
	val weakening_print = W.weakening_print


    val permute = P.permute 
	val permute_final = P.permute_final
	val permute_print = P.permute_print 
    
    val cut_axiom = C.cut_axiom
    val cut_rank_reduction = C.cut_rank_reduction
    val cut_grade_reduction = C.cut_grade_reduction

    val cut_elim = C.cut_elim

    val cut_elim_print' = C.cut_elim_print'
    val cut_elim_print = C.cut_elim_print

    (* fun test_1() =
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
        permute(rl1, rl2, [rl3], ([],[]))
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
        permute(rl1, rl2, [rl3], ([],[]))
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
        permute(rl1, rl3, [rl4], ([],[]))
        end *)
end
