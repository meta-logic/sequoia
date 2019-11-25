structure Sequent_calculus =
struct
  structure D = datatypesImpl
  structure P = Properties

  val t = ref 3

  val ptrue = D.Atom("\\top")
  val pfalse = D.Atom("\\bot")

  fun generic_atom_P () = 
  	let
  		val (name) = ("P_{"^ Int.toString(!t)^"}" ) before ( t:= !t +1)
  	in
  		D.AtomVar(name)
  	end
  fun generic_form_A () = 
  	let
  		val (name) = ("A_{"^ Int.toString(!t)^"}" ) before ( t:= !t +1)
  	in
  		D.FormVar(name)
  	end

  fun generic_form_B () = 
  	let
  		val (name) = ("B_{" ^ Int.toString(!t)^"}" ) before ( t:= !t +1)
  	in
  		D.FormVar(name)
  	end

  fun generic_form_C () = 
  	let
  		val (name) = ("C_{" ^ Int.toString(!t)^"}" ) before ( t:= !t +1)
  	in
  		D.FormVar(name)
  	end

  fun generic_ctx_var () = 
  	let
  		val name = ("\\Gamma_{"^ Int.toString(!t)^"}" ) before ( t:= !t +1)
  	in
  		D.CtxVar(name)
  	end

  fun gamma_ctx_var ()= [generic_ctx_var()]
  fun gamma_left_ctx ()= D.Single(D.Ctx(gamma_ctx_var(),[]))

  fun generic_right_ctx ()= D.Single(D.Ctx([],[generic_form_C()]))

  val andName = "\\wedge"
  val orName = "\\vee"
  val impName = "\\supset"

  val andCon = D.Con(andName)
  val orCon = D.Con(orName)
  val impCon = D.Con(impName)

  fun form (con) = fn (A,B) => D.Form(con,[A,B])

  val andForm = form (andCon)
  val orForm  = form (orCon)
  val impForm  = form (impCon)

  val con = D.Con ("\\rightarrow")


  fun andR () = 
  	let
  		val left_ctx = gamma_left_ctx()
  		val A = generic_form_A ()
  		val B = generic_form_B ()
  	in
  		D.Rule (andName^ " R",D.Right,D.Seq(left_ctx,con,D.Single(D.Ctx([],[andForm(A,B)]))),
  									[D.Seq(left_ctx,con,D.Single(D.Ctx([],[A]))),
  									D.Seq(left_ctx,con,D.Single(D.Ctx([],[B])))])
  	end
  
  fun andL () = 
  	let
  		val C = generic_right_ctx()
  		val G = gamma_ctx_var ()
  		val A = generic_form_A ()
  		val B = generic_form_B ()
  	in
  		D.Rule (andName^ " L",D.Left, D.Seq(D.Single(D.Ctx(G,[andForm(A,B)])),con,C),
  									[D.Seq(D.Single(D.Ctx(G,[A,B])),con,C)])
  	end

  fun impL () = 
  	let
  		val G = gamma_ctx_var ()
  		val C = generic_right_ctx ()
  		val A = generic_form_A ()
  		val B = generic_form_B ()
  	in
  		D.Rule (impName^" L",D.Left, D.Seq(D.Single(D.Ctx(G,[impForm(A,B)])),con,C),
  			[D.Seq(D.Single(D.Ctx(G,[impForm(A,B)])),con,D.Single(D.Ctx([],[A]))),D.Seq(D.Single(D.Ctx(G,[B])),con,C)])
  	end

  fun impR () = 
  	let
  		val G = gamma_ctx_var ()
  		val A = generic_form_A ()
  		val B = generic_form_B ()
  	in
  		D.Rule (impName^" R",D.Right, D.Seq(D.Single(D.Ctx(G,[])),con,D.Single(D.Ctx([],[impForm(A,B)]))),
  			[D.Seq(D.Single(D.Ctx(G,[A])),con,D.Single(D.Ctx([],[B])))])
  	end

  fun orL () = 
  	let
  		val G = gamma_ctx_var ()
  		val C = generic_right_ctx ()
  		val A = generic_form_A ()
  		val B = generic_form_B ()
  	in
  		D.Rule (orName^" L",D.Left, D.Seq(D.Single(D.Ctx(G,[orForm(A,B)])),con,C),
  			[D.Seq(D.Single(D.Ctx(G,[A])),con,C),D.Seq(D.Single(D.Ctx(G,[B])),con,C)])
  	end
  fun orR1 () = 
  	let
  		val G = gamma_left_ctx ()
  		val A = generic_form_A ()
  		val B = generic_form_B ()
  	in
  		D.Rule (orName^" R1",D.Right,D.Seq(G,con,D.Single(D.Ctx([],[orForm(A,B)]))),
  			[D.Seq(G,con,D.Single(D.Ctx([],[A])))])
  	end
  fun orR2 () =
  	let
  		val G = gamma_left_ctx ()
  		val A = generic_form_A ()
  		val B = generic_form_B ()
  	in
  		D.Rule (orName^" R2",D.Right,D.Seq(G,con,D.Single(D.Ctx([],[orForm(A,B)]))),
  			[D.Seq(G,con,D.Single(D.Ctx([],[B])))])
  	end


  (*TODO: init, false, true*)
  fun init() =
  	let
  		val P = generic_atom_P ()
  		val G = gamma_ctx_var ()
  	in
  		D.Rule ("init",D.None,D.Seq(D.Single(D.Ctx(G,[P])),con,D.Single(D.Ctx([],[P]))),[])
  	end

  fun id() =
  	let
  		val P = generic_form_A ()
  		val G = gamma_ctx_var ()
  	in
  		D.Rule ("init",D.None,D.Seq(D.Single(D.Ctx(G,[P])),con,D.Single(D.Ctx([],[P]))),[])
  	end


  fun trueR () =
  	let
  		val G = gamma_left_ctx ()
  	in
  		D.Rule ("true R",D.Right,D.Seq(G,con,D.Single(D.Ctx([],[ptrue]))),[])
  	end

  fun falseL () =
  	let
  		val C = generic_right_ctx ()
  		val G = gamma_ctx_var ()
  	in
  		D.Rule ("false L",D.Left,D.Seq(D.Single(D.Ctx(G,[pfalse])),con,C),[])
  	end

  	val andR1 = [andR()]
  	val andR2 = [andR()]
  	
  	val andL1 = [andL()]
  	val andL2 = [andL()]

  	val impL1 = [impL()]
  	val impL2 = [impL()]

  	val impR1 = [impR()]
  	val impR2 = [impR()]

  	val orR = [orR1()]

  	val orL1 = [orL()] 
	
	val A = generic_atom_P()
	val B = generic_atom_P()

	val weak_rule_list =  [andR(),andL(),impR(),impL(),orR1(),orR2(),orL(),trueR(), falseL(), id(), init()]
	val init_rule_list = [id()]
	val rule_pairs_no_init = [(andForm(A,B),[andR()],[andL()]),(impForm(A,B),[impR()],[impL()]),(orForm(A,B),[orR1(),orR2()],[orL()])]
	val axiom_list = [trueR(), falseL()]

	fun weak_test  () = P.weakening(weak_rule_list)

	fun init_coherence_test () = P.init_coherence(rule_pairs_no_init,init_rule_list,axiom_list)

	val weak: (bool list * bool list) option ref = ref NONE
  	fun test([R1],nil) = raise Fail "no R2"
  		| test([R1],[R2]) = 
			let
			  	val () = (case (!weak) of NONE => ignore (weak:= SOME (weak_test())) | _ => ())
				val weak_res = Option.valOf(!weak);
			in
			  P.permute_final(R1,R2,[],weak_res)
			end 
  		


  	(*imp L as R1:*)
	fun impL_permutes () = 
		let
			val impL_impL = test(impL1,impL2)
			val impL_impR = test(impL1,impR1)
			val impL_andL = test(impL1,andL1)
			val impL_andR = test(impL1,andR1)
			val impL_orL = test(impL1,orL1)
			val impL_orR = test(impL1,orR)

			

			val impL_inorder = [impL_impL,
													impL_impR,
													impL_andL,
													impL_andR,
													impL_orL,
													impL_orR]
			in 
			impL_inorder
		end

		(*imp R as R1:*)
	fun impR_permutes () = 
		let
			val impR_impL = test(impR1,impL1)
			val impR_impR = test(impR1,impR2)
			val impR_andL = test(impR1,andL1)
			val impR_andR = test(impR1,andR1)
			val impR_orL = test(impR1,orL1)
			val impR_orR = test(impR1,orR)


			val impR_inorder = [impR_impL,
													impR_impR,
													impR_andL,
													impR_andR,
													impR_orL,
													impR_orR]
		in 
			impR_inorder
		end


  	(*and L as R1:*)
	fun andL_permutes () = 
		let
			val andL_impL = test(andL1,impL1)
			val andL_impR = test(andL1,impR1)
			val andL_andL = test(andL1,andL2)
			val andL_andR = test(andL1,andR1)
			val andL_orL = test(andL1,orL1)
			val andL_orR = test(andL1,orR)

			

			val andL_inorder = [andL_impL,
													andL_impR,
													andL_andL,
													andL_andR,
													andL_orL,
													andL_orR]
		in
			andL_inorder
		end


		(*and R as R1:*)
	fun andR_permutes () =
		let
			val andR_impL = test(andR1,impL1)
			val andR_impR = test(andR1,impR1)
			val andR_andL = test(andR1,andL1)
			val andR_andR = test(andR1,andR2)
			val andR_orL = test(andR1,orL1)
			val andR_orR = test(andR1,orR)


			val andR_inorder = [andR_impL,
													andR_impR,
													andR_andL,
													andR_andR,
													andR_orL,
													andR_orR]
		in
			andR_inorder
		end


end
