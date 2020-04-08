(*  Sequoia  Copyright (C) 2020  Mohammed Hashim
    This program comes with ABSOLUTELY NO WARRANTY; for details type `show w'.
    This is free software, and you are welcome to redistribute it
    under certain conditions; type `show c' for details.
*)



structure Linear_Logic =
struct
  structure D = datatypesImpl
  structure P = Properties

  val t = ref 01000000

  val ptrue = D.Atom("\\top")
  val pfalse = D.Atom("\\bot")

  fun generic_atom_P () = 
  	let
  		val (name,_) = ("P"^ Int.toString(!t),t := !t + 1)
  	in
  		D.AtomVar(name)
  	end
  fun generic_form_A () = 
  	let
  		val (name,_) = ("A"^ Int.toString(!t),t := !t + 1)
  	in
  		D.FormVar(name)
  	end

  fun generic_form_B () = 
  	let
  		val (name,_) = ("B" ^ Int.toString(!t) , t:= !t +1)
  	in
  		D.FormVar(name)
  	end

  fun generic_form_C () = 
  	let
  		val (name,_) = ("C" ^ Int.toString(!t) , t:= !t +1)
  	in
  		D.FormVar(name)
  	end

  fun generic_ctx_var () = 
  	let
  		val (name,_) = ("\\Gamma" ^ Int.toString(!t) , t:= !t +1)
  	in
  		D.CtxVar(name)
  	end

  fun generic_ctx_var_1 () = 
  	let
  		val (name,_) = ("\\Gamma_1" ^ Int.toString(!t) , t:= !t +1)
  	in
  		D.CtxVar(name)
  	end

  fun generic_ctx_var_2 () = 
  	let
  		val (name,_) = ("\\Gamma_2" ^ Int.toString(!t) , t:= !t +1)
  	in
  		D.CtxVar(name)
  	end


  fun gamma_left_ctx ()= D.Single(D.Ctx([generic_ctx_var()],[]))

	fun generic_right_ctx (x)= D.Single(D.Ctx([],[x]))

	fun form (con) = fn (A,B) => D.Form(con,[A,B])

	val with_name = "\\&"
	val bang_name = "!"
	val tensor_name = "\\otimes"
	val plus_name = "\\oplus"
	val lolli_name = "\\multimap"
	val par_name = "\\parr"
	val ques_mark = "\\?"


	val top = D.Atom("\\top")
	val one = D.Atom("1")
	val zero = D.Atom("0")

	val with_connective = D.Con(with_name)
	val bang_connective = D.Con(bang_name)
	val tensor_connective = D.Con(tensor_name)
	val plus_connective = D.Con(plus_name)
	val lolli_connective = D.Con(lolli_name)
	val par_connective = D.Con(par_name)
	val ques_connective = D.Con(ques_mark)

	val with_form = form(with_connective)
	val bang_form = (fn (A) => D.Form(bang_connective,[A]))
	val tensor_form = form(tensor_connective)
	val plus_form = form(plus_connective)
	val lolli_form = form(lolli_connective)
	val par_form = form(par_connective)
	val ques_form = form(ques_connective)

	val con = D.Con("\\rightarrow")

	fun withR () = 
		let
			val left_ctx = gamma_left_ctx()
			val A = generic_form_A()
			val B = generic_form_B()
		in
			D.Rule (with_name^ " R",D.Right,D.Seq(left_ctx,con,D.Single(D.Ctx([],[with_form(A,B)]))),
						[ D.Seq(left_ctx,con,D.Single(D.Ctx([],[A]))),D.Seq(left_ctx,con,D.Single(D.Ctx([],[B]))) ])
		end

	fun withL1 () =
		let
			val C = generic_form_C()
		 	val right_ctx = generic_right_ctx(C)
		 	val left_ctx_var = [generic_ctx_var()]
		 	val A = generic_form_A()
		 	val B = generic_form_B()
		 in
		 	D.Rule (with_name^ " L1", D.Left, D.Seq(D.Single(D.Ctx(left_ctx_var,[with_form(A,B)])),con,right_ctx),
		 																	 [D.Seq(D.Single(D.Ctx(left_ctx_var,[A])),con,right_ctx)])
		 end 
	fun withL2 () =
		let
			val C = generic_form_C()
		 	val right_ctx = generic_right_ctx(C)
		 	val left_ctx_var = [generic_ctx_var()]
		 	val A = generic_form_A()
		 	val B = generic_form_B()
		 in
		 	D.Rule (with_name^ " L2", D.Left, D.Seq(D.Single(D.Ctx(left_ctx_var,[with_form(A,B)])),con,right_ctx),
		 																	 [D.Seq(D.Single(D.Ctx(left_ctx_var,[B])),con,right_ctx)])
		 end

	fun topR () = 
		let
			val left_ctx = gamma_left_ctx()
		in
			D.Rule ("\\top R",D.Right,D.Seq(left_ctx,con,D.Single(D.Ctx([],[ptrue]))),[])
		end

	fun lolliR () = 
		let
			val G = generic_ctx_var()
			val A = generic_form_A()
			val B = generic_form_B()
		in
			D.Rule (lolli_name^ " R",D.Right,D.Seq(D.Single(D.Ctx([G],[])),con,D.Single(D.Ctx([],[lolli_form(A,B)]))),
				[D.Seq(D.Single(D.Ctx([G],[A])),con,D.Single(D.Ctx([],[B])))])
		end

	fun lolliL() = 
		let
			val C = generic_form_C()
			val right_ctx = generic_right_ctx(C)
			val A = generic_form_A()
			val B = generic_form_B()
			val G1 = generic_ctx_var_1()
			val G2 = generic_ctx_var_2()
		in
			D.Rule(lolli_name^" L",D.Left,D.Seq(D.Single(D.Ctx([G1,G2],[lolli_form(A,B)])),con,right_ctx),
				[D.Seq(D.Single(D.Ctx([G1],[])),con,D.Single(D.Ctx([],[A]))),D.Seq(D.Single(D.Ctx([G2],[B])),con,right_ctx)])
		end

	fun tensorR () = 
		let
			val A = generic_form_A()
			val B = generic_form_B()
			val A_ctx = generic_right_ctx(A)
			val B_ctx = generic_right_ctx(B)
			val form_ctx = generic_right_ctx(tensor_form(A,B))
			val G1 = generic_ctx_var_1()
			val G2 = generic_ctx_var_2()
		in
			D.Rule(tensor_name^" R",D.Right,D.Seq(D.Single(D.Ctx([G1,G2],[])),con,form_ctx),
				[D.Seq(D.Single(D.Ctx([G1],[])),con,A_ctx),D.Seq(D.Single(D.Ctx([G2],[])),con,B_ctx)])
		end
	fun tensorL () =
		let
			val C = generic_form_C()
			val right_ctx = generic_right_ctx(C)
			val G  = generic_ctx_var()
			val A  = generic_form_A ()
			val B  = generic_form_B ()
			val frm = tensor_form(A,B) 
		in
			D.Rule(tensor_name^ " L",D.Left, D.Seq(D.Single(D.Ctx([G],[frm])),con,right_ctx),
				[D.Seq(D.Single(D.Ctx([G],[A,B])),con,right_ctx)])
		end

	fun oneR () = D.Rule ("1 R",D.Right,D.Seq(D.Single(D.Ctx([],[])),con,generic_right_ctx(one)),[])

	fun oneL () = 
		let
			val C = generic_form_C()
			val right_ctx = generic_right_ctx(C)
			val G  =generic_ctx_var()
		in
			D.Rule("1 L",D.Left,D.Seq(D.Single(D.Ctx([G],[one])),con,right_ctx),[D.Seq(D.Single(D.Ctx([G],[])),con,right_ctx)])
		end

	fun plusR1 () = 
		let
			val left_ctx = gamma_left_ctx ()
			val A = generic_form_A ()
			val B = generic_form_B ()
			val frm_ctx = generic_right_ctx(plus_form(A,B))
			val A_ctx = generic_right_ctx(A)

		in
			D.Rule(plus_name^" R1",D.Right,D.Seq(left_ctx,con,frm_ctx),[D.Seq(left_ctx,con,A_ctx)])
		end

	fun plusR2 () = 
		let
			val left_ctx = gamma_left_ctx ()
			val A = generic_form_A ()
			val B = generic_form_B ()
			val frm_ctx = generic_right_ctx(plus_form(A,B))
			val B_ctx = generic_right_ctx(B)

		in
			D.Rule(plus_name^" R2",D.Right,D.Seq(left_ctx,con,frm_ctx),[D.Seq(left_ctx,con,B_ctx)])
		end

	fun plusL () = 
		let
			val C = generic_right_ctx( generic_form_C() )
			val G = generic_ctx_var()
			val A = generic_form_A()
			val B = generic_form_B()
			val frm = plus_form(A,B)
		in
			D.Rule(plus_name^" L",D.Left,D.Seq(D.Single(D.Ctx([G],[frm])),con,C),
				[D.Seq(D.Single(D.Ctx([G],[A])),con,C),D.Seq(D.Single(D.Ctx([G],[B])),con,C)])
		end

	(*TODO: not sure where to find the rules, the rules I found have multiple forms on right side*)

	fun parR () = raise Fail "unimplemented"

	fun parL () = raise Fail "unimplemented"

	fun quesL () = raise Fail "unimplemented"

	fun quesR () = raise Fail "unimplemented"

	(*TODO: what should I do with bang right, theres no way to apply ! to a 
		context variable, or restrict that every formula has bang*)

	fun bangL () = raise Fail "unimplemented"

	fun bangR () = raise Fail "unimplemented"

	(*/////////////////////////////////////////////////////////////////////*)

	fun botR () = raise Fail "unimplemented"

	fun botL () = raise Fail "unimplemented"


	(*for every rule, val <rule> = [<rule>()]*)

	fun test'(R1,nil) = raise Fail "no R2"
  		| test'(R1,[R2]) = P.permutes(R1,R2,[],false,false)
  		| test'(R1,R2::rest) = 
  				case test'(R1,rest) of
  					SOME true => test'(R1,rest)
  					| result => result
  
  fun test ([],_) = SOME true
  	| test  (x::L,r2) = 
  	case test(L,r2) of
  		SOME true => test'(x,r2)
  		| x => x

  val tensorR1 = [tensorR()]
  val tensorR2 = [tensorR()]

  val tensorL1 = [tensorL()]
  val tensorL2 = [tensorL()]

  val lolli_R = [lolliR()]

  val lolli_L = [lolliL()]

  val oplusR1 = [plusR1(),plusR2()]
  val oplusR2 = [plusR1(),plusR2()]

  val oplusL = [plusL()]

  val withR1 = [withR()]
  val withR2 = [withR()]

  val withL = [withL1(),withL2()]

  (*val par*)

  (*val bang*)

  (*val quest*)

  val one_R = [oneR()]

  val one_L = [oneL()]

  (*val bot*)
  
  (*testing tensor L permutes up*)
  val tensorL_tensorR = test(tensorL1,tensorR1)
  val tensorL_tensorL = test(tensorL1,tensorL2)
  val tensorL_lolliR = test(tensorL1,lolli_R)
  val tensorL_lolliL = test(tensorL1,lolli_L)
  val tensorL_oplusR = test(tensorL1,oplusR1)
  val tensorL_oplusL = test(tensorL1,oplusL)
  val tensorL_withR = test(tensorL1,withR1)
  val tensorL_withL = test(tensorL1,withL)

  val tensorL_oneR = test(tensorL1, one_R)
  val tensorL_oneL = test(tensorL1, one_L)

  val tensorL_inorder = [tensorL_tensorR,
  											 tensorL_tensorL,
  											 tensorL_lolliR,
  											 tensorL_lolliL,
  											 tensorL_oplusR,
  											 tensorL_oplusL,
  											 tensorL_withR,
  											 tensorL_withL,
  											 tensorL_oneR,
  											 tensorL_oneL]

  (*testing tensor R permutes up*)

  val tensorR_tensorR = test(tensorR1,tensorR2)
  val tensorR_tensorL = test(tensorR1,tensorL1)
  val tensorR_lolliR = test(tensorR1,lolli_R)
  val tensorR_lolliL = test(tensorR1,lolli_L)
  val tensorR_oplusR = test(tensorR1,oplusR1)
  val tensorR_oplusL = test(tensorR1,oplusL)
  val tensorR_withR = test(tensorR1,withR1)
  val tensorR_withL = test(tensorR1,withL)

  val tensorR_oneR = test(tensorR1, one_R)
  val tensorR_oneL = test(tensorR1, one_L)

  val tensorR_inorder = [tensorR_tensorR,
  											 tensorR_tensorL,
  											 tensorR_lolliR,
  											 tensorR_lolliL,
  											 tensorR_oplusR,
  											 tensorR_oplusL,
  											 tensorR_withR,
  											 tensorR_withL,
  											 tensorR_oneR,
  											 tensorR_oneL]

  (*testing plus R permutes up*)
  val oplusR_tensorR = test(oplusR1,tensorR1)
  val oplusR_tensorL = test(oplusR1,tensorL1)
  val oplusR_lolliR = test(oplusR1,lolli_R)
  val oplusR_lolliL = test(oplusR1,lolli_L)
  val oplusR_oplusR = test(oplusR1,oplusR2)
  val oplusR_oplusL = test(oplusR1,oplusL)
  val oplusR_withR = test(oplusR1,withR1)
  val oplusR_withL = test(oplusR1,withL)

  val oplusR_oneR = test(oplusR1, one_R)
  val oplusR_oneL = test(oplusR1, one_L)

  val oplusR_inorder = [oplusR_tensorR,
  											 oplusR_tensorL,
  											 oplusR_lolliR,
  											 oplusR_lolliL,
  											 oplusR_oplusR,
  											 oplusR_oplusL,
  											 oplusR_withR,
  											 oplusR_withL,
  											 oplusR_oneR,
  											 oplusR_oneL]

  (*testing with R permutes up*)

  val withR_tensorR = test(withR1,tensorR1)
  val withR_tensorL = test(withR1,tensorL1)
  val withR_lolliR = test(withR1,lolli_R)
  val withR_lolliL = test(withR1,lolli_L)
  val withR_oplusR = test(withR1,oplusR1)
  val withR_oplusL = test(withR1,oplusL)
  val withR_withR = test(withR1,withR2)
  val withR_withL = test(withR1,withL)

  val withR_oneR = test(withR1, one_R)
  val withR_oneL = test(withR1, one_L)

  val withR_inorder = [withR_tensorR,
  											 withR_tensorL,
  											 withR_lolliR,
  											 withR_lolliL,
  											 withR_oplusR,
  											 withR_oplusL,
  											 withR_withR,
  											 withR_withL,
  											 withR_oneR,
  											 withR_oneL]



end
