(*TODO: probably using wrong linear logic rules*) 

structure Linear_Logic =
struct
  structure D = datatypesImpl
  structure P = Properties
  structure Latex = latexImpl

  val t = ref 01000

  datatype result  = None | Some | True | False

 	val top = D.Atom("\\top")
	val bot = D.Atom("\\bot")
	val one = D.Atom("1")
	val zero = D.Atom("0")


	val with_name = "\\&"
	val bang_name = "!"
	val tensor_name = "\\otimes"
	val plus_name = "\\oplus"
	val lolli_name = "\\multimap"
	val par_name = "\\parr"
	val ques_mark = "\\?"




	val with_connective = D.Con(with_name)
	val bang_connective = D.Con(bang_name)
	val tensor_connective = D.Con(tensor_name)
	val plus_connective = D.Con(plus_name)
	val lolli_connective = D.Con(lolli_name)
	val par_connective = D.Con(par_name)
	val ques_connective = D.Con(ques_mark)

	fun form (con) = fn (A,B) => D.Form(con,[A,B])

	val with_form = form(with_connective)
	val bang_form = (fn (A) => D.Form(bang_connective,[A]))
	val quest_form = (fn (A) => D.Form(ques_connective,[A]))
	val tensor_form = form(tensor_connective)
	val plus_form = form(plus_connective)
	val lolli_form = form(lolli_connective)
	val par_form = form(par_connective)


	val con = D.Con("\\rightarrow")
	val ctx_con = D.Con(";")


  fun generic_atom_P () = 
  	let
  		val (name,_) = ("P_{"^ Int.toString(!t)^"}",t := !t + 1)
  	in
  		D.AtomVar(name)
  	end

  fun generic_form_A () = 
  	let
  		val (name,_) = ("A_{"^ Int.toString(!t)^"}",t := !t + 1)
  	in
  		D.FormVar(name)
  	end

  fun generic_form_B () = 
  	let
  		val (name,_) = ("B_{" ^ Int.toString(!t)^"}" , t:= !t +1)
  	in
  		D.FormVar(name)
  	end

  fun generic_form_C () = 
  	let
  		val (name,_) = ("C_{" ^ Int.toString(!t)^"}" , t:= !t +1)
  	in
  		D.FormVar(name)
  	end

  fun generic_ctx_var_G () = 
  	let
  		val (name,_) = ("\\Gamma_{" ^ Int.toString(!t)^"}" , t:= !t +1)
  	in
  		D.CtxVar(name)
  	end
  fun generic_ctx_var_D () = 
  	let
  		val (name,_) = ("\\Delta_{" ^ Int.toString(!t)^"}" , t:= !t +1)
  	in
  		D.CtxVar(name)
  	end



	


	(*takes a list of (D.ctx_var list* D.form list) tuples, and a ctx connector (;), returns a ctx_struct matching the ctx 
	 defined by the input list*)


	
	fun list_to_ctx'([],_) = D.Empty
		| list_to_ctx'([x],_) = D.Single(D.Ctx(x))
		| list_to_ctx'(x::L,con) = D.Mult(con,D.Ctx(x),list_to_ctx'(L,con))

	fun list_to_ctx(x) = list_to_ctx'(x,ctx_con)


	fun lolliR () = 
		let
			val G = generic_ctx_var_G()
			val Gb = generic_ctx_var_G()
			val D = generic_ctx_var_D()
			val Dq = generic_ctx_var_D()
			val A = generic_form_A()
			val B = generic_form_B()
			val R1 = ([Dq],[])
			val L2 = ([Gb],[])
			val conc = D.Seq(list_to_ctx([([G],[]),L2]),con,list_to_ctx([R1,([D],[lolli_form(A,B)])]))
			val prem = D.Seq(list_to_ctx([([G],[A]),L2]),con,list_to_ctx([R1,([D],[B])]))
		in
			D.Rule(lolli_name^" R",D.Right,conc,[prem])
		end
		

	fun lolliL () = 
		let
			val G1 = generic_ctx_var_G()
			val G2 = generic_ctx_var_G()
			val Gb = generic_ctx_var_G()

			val D1 = generic_ctx_var_D()
			val D2 = generic_ctx_var_D()
			val Dq = generic_ctx_var_D()

			val A = generic_form_A()
			val B = generic_form_B()
			val frm = lolli_form(A,B)


			val R1 = ([Dq],[])
			val L2 = ([Gb],[])

			val conc = D.Seq(list_to_ctx([([G1,G2],[frm]),L2]),con,list_to_ctx([R1,([D1,D2],[])]))
			val prem1 = D.Seq(list_to_ctx([([G1],[]),L2]),con,list_to_ctx([R1,([D1],[A])]))
			val prem2 = D.Seq(list_to_ctx([([G2],[B]),L2]),con,list_to_ctx([R1,([D2],[])]))

		in
			D.Rule(lolli_name^" L",D.Left,conc,[prem1,prem2])
		end



	fun tensorR () = 
		let
			val G1 = generic_ctx_var_G()
			val G2 = generic_ctx_var_G()
			val Gb = generic_ctx_var_G()

			val D1 = generic_ctx_var_D()
			val D2 = generic_ctx_var_D()
			val Dq = generic_ctx_var_D()

			val A = generic_form_A()
			val B = generic_form_B()
			val frm = tensor_form(A,B)

			val R1 = ([Dq],[])
			val L2 = ([Gb],[])
			
			val conc = D.Seq(list_to_ctx([([G1,G2],[]),L2]),con,list_to_ctx([R1,([D1,D2],[frm])]))
			val prem1 = D.Seq(list_to_ctx([([G1],[]),L2]),con,list_to_ctx([R1,([D1],[A])]))
			val prem2 = D.Seq(list_to_ctx([([G2],[]),L2]),con,list_to_ctx([R1,([D2],[B])]))
		in
			D.Rule(tensor_name^" R",D.Right,conc,[prem1,prem2])
		end
		
	fun tensorL () =
		let
			val G = generic_ctx_var_G()
			val Gb = generic_ctx_var_G()
			val D = generic_ctx_var_D()
			val Dq = generic_ctx_var_D()
			val A = generic_form_A()
			val B = generic_form_B()
			val R = [([Dq],[]),([D],[])]
			val L2 = ([Gb],[])

			val conc = D.Seq(list_to_ctx([([G],[tensor_form(A,B)]),L2]),con,list_to_ctx(R))
			val prem = D.Seq(list_to_ctx([([G],[A,B]),L2]),con,list_to_ctx(R))

		in
			D.Rule(tensor_name^" L",D.Left,conc,[prem])
		end
		

	fun withR () = 
		let
			val G = generic_ctx_var_G()
			val Gb = generic_ctx_var_G()
			val D = generic_ctx_var_D()
			val Dq = generic_ctx_var_D()
			val A = generic_form_A()
			val B = generic_form_B()
			val R1 = ([Dq],[])
			val L = [([G],[]),([Gb],[])]

			val conc = D.Seq(list_to_ctx(L),con,list_to_ctx([R1,([D],[with_form(A,B)])]))
			val prem1 = D.Seq(list_to_ctx(L),con,list_to_ctx([R1,([D],[A])]))
			val prem2 = D.Seq(list_to_ctx(L),con,list_to_ctx([R1,([D],[B])]))

		in
			D.Rule(with_name^" R",D.Right,conc,[prem1,prem2])
		end
		

	fun withL1 () = 
		let
			val G = generic_ctx_var_G()
			val Gb = generic_ctx_var_G()
			val D = generic_ctx_var_D()
			val Dq = generic_ctx_var_D()
			val A = generic_form_A()
			val B = generic_form_B()
			val frm = with_form(A,B)

			val R = [([Dq],[]),([D],[])]
			val L2 = ([Gb],[])

			val conc = D.Seq(list_to_ctx([([G],[frm]),L2]),con,list_to_ctx(R))
			val prem = D.Seq(list_to_ctx([([G],[A]),L2]),con,list_to_ctx(R))

		in
			D.Rule(with_name^" L1",D.Left,conc,[prem])
		end
		
	fun withL2 () = 
		let
			val G = generic_ctx_var_G()
			val Gb = generic_ctx_var_G()
			val D = generic_ctx_var_D()
			val Dq = generic_ctx_var_D()
			val A = generic_form_A()
			val B = generic_form_B()
			val frm = with_form(A,B)

			val R = [([Dq],[]),([D],[])]
			val L2 = ([Gb],[])

			val conc = D.Seq(list_to_ctx([([G],[frm]),L2]),con,list_to_ctx(R))
			val prem = D.Seq(list_to_ctx([([G],[B]),L2]),con,list_to_ctx(R))

		in
			D.Rule(with_name^" L1",D.Left,conc,[prem])
		end
		

	(*fun topR () = *)
		
	fun parR () =
		let
			val G = generic_ctx_var_G()
			val Gb = generic_ctx_var_G()
			val D = generic_ctx_var_D()
			val Dq = generic_ctx_var_D()
			val A = generic_form_A()
			val B = generic_form_B()
			val frm = par_form(A,B)

			val R1 = ([Dq],[])
			val L = list_to_ctx([([G],[]),([Gb],[])])

			val conc = D.Seq(L,con,list_to_ctx([R1,([D],[frm])]))
			val prem = D.Seq(L,con,list_to_ctx([R1,([D],[A,B])]))

		in
			D.Rule(par_name^" R",D.Right,conc,[prem])
		end
		

	fun parL () = 
		let
			val G1 = generic_ctx_var_G()
			val G2 = generic_ctx_var_G()
			val Gb = generic_ctx_var_G()

			val D1 = generic_ctx_var_D()
			val D2 = generic_ctx_var_D()
			val Dq = generic_ctx_var_D()

			val A = generic_form_A()
			val B = generic_form_B()
			val frm = par_form(A,B)

			val L2 = ([Gb],[])
			val R1 = ([Dq],[])

			val conc = D.Seq(list_to_ctx([([G1,G2],[frm]),L2]),con,list_to_ctx([R1,([D1,D2],[])]))
			val prem1 = D.Seq(list_to_ctx([([G1],[A]),L2]),con,list_to_ctx([R1,([D1],[])]))
			val prem2 = D.Seq(list_to_ctx([([G2],[B]),L2]),con,list_to_ctx([R1,([D2],[])]))
		in
			D.Rule(par_name^" L",D.Left,conc,[prem1,prem2])
		end
		
	
		

	fun plusR1 () =
		let
			val G = generic_ctx_var_G()
			val Gb = generic_ctx_var_G()

			val D = generic_ctx_var_D()
			val Dq = generic_ctx_var_D()
			
			val A = generic_form_A()
			val B = generic_form_B()
			val frm = plus_form(A,B)

			val L = list_to_ctx([([G],[]),([Gb],[])])
			val R1 = ([Dq],[])

			val conc = D.Seq(L,con,list_to_ctx([R1,([D],[frm])]))
			val prem = D.Seq(L,con,list_to_ctx([R1,([D],[A])]))
		in
			D.Rule(plus_name^" R",D.Right,conc,[prem])
		end
		

	fun plusR2 () = 
		let
			val G = generic_ctx_var_G()
			val Gb = generic_ctx_var_G()

			val D = generic_ctx_var_D()
			val Dq = generic_ctx_var_D()
			
			val A = generic_form_A()
			val B = generic_form_B()
			val frm = plus_form(A,B)

			val L = list_to_ctx([([G],[]),([Gb],[])])
			val R1 = ([Dq],[])

			val conc = D.Seq(L,con,list_to_ctx([R1,([D],[frm])]))
			val prem = D.Seq(L,con,list_to_ctx([R1,([D],[B])]))
		in
			D.Rule(plus_name^" R",D.Right,conc,[prem])
		end
		

	fun plusL () = 
		let
			val G = generic_ctx_var_G()
			val Gb = generic_ctx_var_G()

			val D = generic_ctx_var_D()
			val Dq = generic_ctx_var_D()
			
			val A = generic_form_A()
			val B = generic_form_B()
			val frm = plus_form(A,B)

			val L2 = ([Gb],[])
			val R = list_to_ctx([([Dq],[]),([D],[])])

			val conc = D.Seq(list_to_ctx([([G],[frm]),L2]),con,R)
			val prem1 = D.Seq(list_to_ctx([([G],[A]),L2]),con,R)
			val prem2 = D.Seq(list_to_ctx([([G],[B]),L2]),con,R)
		in
			D.Rule(plus_name^" L",D.Left,conc,[prem1,prem2])
		end



	fun bangR () = 
		let
			val Dq = generic_ctx_var_D()
			val Gb = generic_ctx_var_G()

			val B = generic_form_B()
			val Bb = bang_form(B)

			val L = list_to_ctx([([],[]),([Gb],[])])
			val R1 = ([Dq],[])

			val conc = D.Seq(L,con,list_to_ctx([R1,([],[Bb])]))
			val prem = D.Seq(L,con,list_to_ctx([R1,([],[B])]))

		in
			D.Rule(bang_name^" R",D.Right,conc,[prem])
		end

	fun bangL1 () = 
		let
			val R = list_to_ctx([([generic_ctx_var_D()],[]),([generic_ctx_var_D()],[])])

			val G = generic_ctx_var_G()
			val Gb = ([generic_ctx_var_G()])

			val B = generic_form_B()
			val Bb = bang_form(B)

			val conc = D.Seq(list_to_ctx([([G],[Bb]),(Gb,[])]),con,R)
			val prem = D.Seq(list_to_ctx([([G],[]),(Gb,[Bb])]),con,R)
		in
			D.Rule(bang_name^" L1",D.Left,conc,[prem])
		end

	fun bangL2 () = 
		let
			val R = list_to_ctx([([generic_ctx_var_D()],[]),([generic_ctx_var_D()],[])])

			val G = generic_ctx_var_G()

			val B = generic_form_B()
			val Bb = bang_form(B)

			val Gb = ([generic_ctx_var_G()],[Bb])

			val conc = D.Seq(list_to_ctx([([G],[]),Gb]),con,R)
			val prem = D.Seq(list_to_ctx([([G],[B]),Gb]),con,R)
		in
			D.Rule(bang_name^" L2",D.Left,conc,[prem])
		end


	fun quesR1 () = 
		let
			val L = list_to_ctx([([generic_ctx_var_G()],[]),([generic_ctx_var_G()],[])])

			val D = generic_ctx_var_D()
			val Dq = [generic_ctx_var_D()]

			val B = generic_form_B()
			val Bq = quest_form(B)

			val conc = D.Seq(L,con,list_to_ctx([(Dq,[]),([D],[Bq])]))
			val prem = D.Seq(L,con,list_to_ctx([(Dq,[Bq]),([D],[])]))
		in
			D.Rule( ques_mark^" R1",D.Left,conc,[prem])
		end

	fun quesR2 () = 
		let
			val L = list_to_ctx([([generic_ctx_var_G()],[]),([generic_ctx_var_G()],[])])

			val D = generic_ctx_var_D()
			

			val B = generic_form_B()
			val Bq = quest_form(B)

			val Dq = ([generic_ctx_var_D()],[Bq])

			val conc = D.Seq(L,con,list_to_ctx([Dq,([D],[])]))
			val prem = D.Seq(L,con,list_to_ctx([Dq,([D],[B])]))
		in
			D.Rule( ques_mark^" R2",D.Left,conc,[prem])
		end

	fun quesL () = 
		let
			val Dq = generic_ctx_var_D()
			val Gb = generic_ctx_var_G()

			val B = generic_form_B()
			val Bq = quest_form(B)

			val R = list_to_ctx([([Dq],[]),([],[])])
			val L2 = ([Gb],[])

			val conc = D.Seq(list_to_ctx([([],[Bq]),L2]),con,R)
			val prem = D.Seq(list_to_ctx([([],[B]),L2]),con,R)
		in
			D.Rule(ques_mark^" L",D.Left,conc,[prem])
		end
	(*/////////////////////////////////////////////////////////////////////*)

	
	fun oneR () = 
		let
			val L = list_to_ctx([([],[]),([generic_ctx_var_G()],[])])
			val R = list_to_ctx([([generic_ctx_var_D()],[]),([],[one])])
			val conc = D.Seq(L,con,R)
		in
			D.Rule("1R",D.Right,conc,[])
		end

	fun oneL () = 
		let
			val R = list_to_ctx([([generic_ctx_var_D()],[]),([generic_ctx_var_D()],[])])

			val G = generic_ctx_var_G()
			val Gb = generic_ctx_var_G()

			val conc = D.Seq(list_to_ctx([([G],[one]),([Gb],[])]),con,R) 
			val prem = D.Seq(list_to_ctx([([G],[]),([Gb],[])]),con,R) 
		in
			D.Rule("1L",D.Left,conc,[prem])
		end

	fun botR () =
		let
			val L = list_to_ctx([([generic_ctx_var_G()],[]),([generic_ctx_var_G()],[])])

			val D = generic_ctx_var_D()
			val Dq = generic_ctx_var_D()

			val conc = D.Seq(L,con,list_to_ctx([([Dq],[]),([D],[bot])]))
			val prem = D.Seq(L,con,list_to_ctx([([Dq],[]),([D],[])]))
		in
			D.Rule("\\bot R",D.Right,conc,[prem])
		end
		

	fun botL () = 
		let
			val L = list_to_ctx([([],[bot]),([generic_ctx_var_G()],[])])
			val R = list_to_ctx([([generic_ctx_var_D()],[]),([],[])])
			val conc = D.Seq(L,con,R)
		in
			D.Rule("\\bot L",D.Left,conc,[])
		end

	fun id() = 
		let 
			val P = generic_atom_P()
			val L = list_to_ctx([([],[P]),([generic_ctx_var_G()],[])])
			val R = list_to_ctx([([generic_ctx_var_D()],[]),([],[P])])
			val conc = D.Seq(L,con,R)
		in
			D.Rule("id",D.None, conc,[])
		end


	(*for every rule, val <rule> = [<rule>()]*)

	fun test'(R1,nil) = raise Fail "no R2"
  		| test'(R1,[R2]) = P.permutes(R1,R2,[],([],[]))
  		| test'(R1,R2::rest) = P.permutes(R1,R2,[],([],[]))
  				(*case test'(R1,rest) of
  					SOME true => test'(R1,rest)
  					| result => result*)
  
  fun test ([],_) = []
  	| test  (x::L,r2) = test'(x,r2)
  	(*case test(L,r2) of
  		SOME true => test'(x,r2)
  		| x => x*)

  fun res_to_result ((ts,fs),set2) = 
  	case (ts,fs) of
  		([],[]) => None
  		| (_::_,[]) => True
  		| ([], _::_) => False
  		| (_,_) => Some

  fun process_result ((test:string,[])) = (test,NONE)
  	| process_result ((test:string,x)) = (test,SOME (List.map res_to_result x))

  fun latex_res (tree1,tree2) = "\\[\n"^
  			Latex.der_tree_toLatex(tree1)^
  			"\n\\]\n\n\n$\\leadsto$\n\n\n\\[\n"^
  			Latex.der_tree_toLatex(tree2)^
  			"\n\\]\n"

  fun result_to_latex_strings (((true_list,fail_list),set2)) = 
  	let
  		val true_strings = List.map (latex_res) true_list
  		val fail_strings = List.map (fn (_,dvt) => Latex.der_tree_toLatex(dvt)) fail_list
  		val set2_strings = List.map (fn (_,dvt) => Latex.der_tree_toLatex(dvt)) set2
  	in
  		(true_strings,(fail_strings,set2_strings))
  	end

  fun string_result ((test:string,[])) = (test,NONE)
  	| string_result ((test:string,x)) = (test,SOME (List.map result_to_latex_strings x))



  fun inorder (x) = List.map process_result x

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

  val par_R = [parR()]
  val par_L = [parL()]

  (*val bang*)
  val bang_R = [bangR()]
  val bang_L1 =[bangL1()]
  val bang_L2 =[bangL2()]

  val ques_R1 = [quesR1()]
  val ques_R2 = [quesR2()]
  val ques_L = [quesL()]

  val one_R = [oneR()]

  val one_L = [oneL()]

  val bot_R = [botR()]
  val bot_L = [botL()]

	val A = generic_atom_P()
	val B = generic_atom_P()

    val weak_rule_list =  [tensorR(),tensorL(),lolliR(),lolliL(),plusR1(),plusR2(),plusL(),
							withR(), withL1(), withL2(), parR(), parL(), bangR(),bangL1(),
							bangL2(),quesR1(),quesR2(),quesL(),oneR(),oneL(),botR(),botL()]
	
	
	val init_rule_list = [id()]
	val rule_pairs_no_init = [(tensor_connective,[tensorR()],[tensorL()]),
							  (lolli_connective,[lolliR()],[lolliL()]),
							  (plus_connective,[plusR1(),plusR2()],[plusL()]),
							  (with_connective,[withR()],[withL1(),withL2()]),
							  (par_connective,[parR()],[parL()]),
							  (bang_connective,[bangR()],[bangL1(),bangL2()]),
							  (ques_connective,[quesR1(),quesR2()],[quesL()])]

	val axiom_list = [oneR(), botL()]

	fun weak_test  () = P.weakening(weak_rule_list)
	fun weak_test2 () = List.map (fn x => P.weakening([x])) weak_rule_list
	
	val id_rule = id()

	fun init_coherence_test () = P.init_coherence(rule_pairs_no_init,init_rule_list,axiom_list)
	fun init_coherence_test2 () = List.map (fn x => P.init_coherence_con(x,id_rule,axiom_list)) rule_pairs_no_init
  
  (*testing tensor L permutes up*)
  fun tensorL_permute () = 
	let
	  
		val tensorL_tensorR = test(tensorL1,tensorR1)
		val tensorL_tensorL = test(tensorL1,tensorL2)
		val tensorL_lolliR = test(tensorL1,lolli_R)
		val tensorL_lolliL = test(tensorL1,lolli_L)
		val tensorL_oplusR = test(tensorL1,oplusR1)
		val tensorL_oplusL = test(tensorL1,oplusL)
		val tensorL_withR = test(tensorL1,withR1)
		val tensorL_withL = test(tensorL1,withL)
		val tensorL_parR = test(tensorL1,par_R)
		val tensorL_parL = test(tensorL1,par_L)
		val tensorL_bangR = test(tensorL1,bang_R)
		val tensorL_bangL1 = test(tensorL1,bang_L1)
		val tensorL_bangL2 = test(tensorL1,bang_L2)
		val tensorL_quesR1 = test(tensorL1,ques_R1)
		val tensorL_quesR2 = test(tensorL1,ques_R2)
		val tensorL_quesL = test(tensorL1,ques_L)
		val tensorL_oneR = test(tensorL1, one_R)
		val tensorL_oneL = test(tensorL1, one_L)
		val tensorL_botR = test(tensorL1, bot_R)
		val tensorL_botL = test(tensorL1, bot_L)

		val tensorL_inorder = [("tensorL_tensorR",tensorL_tensorR),
													("tensorL_tensorL",tensorL_tensorL),
													("tensorL_lolliR",tensorL_lolliR),
													("tensorL_lolliL",tensorL_lolliL),
													("tensorL_oplusR",tensorL_oplusR),
													("tensorL_oplusL",tensorL_oplusL),
													("tensorL_withR",tensorL_withR),
													("tensorL_withL",tensorL_withL),
													("tensorL_parR",tensorL_parR),
														("tensorL_parL",tensorL_parL),
													("tensorL_bangR",tensorL_bangR), 
														("tensorL_bangL1",tensorL_bangL1),
														("tensorL_bangL2",tensorL_bangL2),
														("tensorL_quesR1",tensorL_quesR1),
														("tensorL_quesR2",tensorL_quesR2),
														("tensorL_quesL",tensorL_quesL),
													("tensorL_oneR",tensorL_oneR),
													("tensorL_oneL",tensorL_oneL),
													("tensorL_botR",tensorL_botR),
													("tensorL_botL",tensorL_botL)]
	in 
		tensorL_inorder
	end

  (*testing tensor R permutes up*)
	fun tensorR_permute () =
		let 
			val tensorR_tensorR = test(tensorR1,tensorR2)
			val tensorR_tensorL = test(tensorR1,tensorL1)
			val tensorR_lolliR = test(tensorR1,lolli_R)
			val tensorR_lolliL = test(tensorR1,lolli_L)
			val tensorR_oplusR = test(tensorR1,oplusR1)
			val tensorR_oplusL = test(tensorR1,oplusL)
			val tensorR_withR = test(tensorR1,withR1)
			val tensorR_withL = test(tensorR1,withL)
			val tensorR_parR = test(tensorR1,par_R)
			val tensorR_parL = test(tensorR1,par_L)
			val tensorR_bangR = test(tensorR1,bang_R)
			val tensorR_bangL1 = test(tensorR1,bang_L1)
			val tensorR_bangL2 = test(tensorR1,bang_L2)
			val tensorR_quesR1 = test(tensorR1,ques_R1)
			val tensorR_quesR2 = test(tensorR1,ques_R2)
			val tensorR_quesL = test(tensorR1,ques_L)
			val tensorR_oneR = test(tensorR1, one_R)
			val tensorR_oneL = test(tensorR1, one_L)
			val tensorR_botR = test(tensorR1, bot_R)
			val tensorR_botL = test(tensorR1, bot_L)

			val tensorR_inorder = [("tensorR_tensorR",tensorR_tensorR),
														("tensorR_tensorL",tensorR_tensorL),
														("tensorR_lolliR",tensorR_lolliR),
														("tensorR_lolliL",tensorR_lolliL),
														("tensorR_oplusR",tensorR_oplusR),
														("tensorR_oplusL",tensorR_oplusL),
														("tensorR_withR",tensorR_withR),
														("tensorR_withL",tensorR_withL),
														("tensorR_parR",tensorR_parR),
															("tensorR_parL",tensorR_parL),
														("tensorR_bangR",tensorR_bangR), 
															("tensorR_bangL1",tensorR_bangL1),
															("tensorR_bangL2",tensorR_bangL2),
															("tensorR_quesR1",tensorR_quesR1),
															("tensorR_quesR2",tensorR_quesR2),
															("tensorR_quesL",tensorR_quesL),
														("tensorR_oneR",tensorR_oneR),
														("tensorR_oneL",tensorR_oneL),
														("tensorR_botR",tensorR_botR),
														("tensorR_botL",tensorR_botL)]
		in
			tensorR_inorder
		end

  (*testing plus R permutes up*)
  fun oplus_permute () = 
	let
		val oplusR_tensorR = test(oplusR1,tensorR1)
		val oplusR_tensorL = test(oplusR1,tensorL1)
		val oplusR_lolliR = test(oplusR1,lolli_R)
		val oplusR_lolliL = test(oplusR1,lolli_L)
		val oplusR_oplusR = test(oplusR1,oplusR2)
		val oplusR_oplusL = test(oplusR1,oplusL)
		val oplusR_withR = test(oplusR1,withR1)
		val oplusR_withL = test(oplusR1,withL)
		val oplusR_parR = test(oplusR1, par_R)
		val oplusR_parL = test(oplusR1, par_L)
		val oplusR_bangR = test(oplusR1,bang_R)
		val oplusR_bangL1 = test(oplusR1,bang_L1)
		val oplusR_bangL2 = test(oplusR1,bang_L2)
		val oplusR_quesR1 = test(oplusR1,ques_R1)
		val oplusR_quesR2 = test(oplusR1,ques_R2)
		val oplusR_quesL = test(oplusR1,ques_L)
		val oplusR_oneR = test(oplusR1, one_R)
		val oplusR_oneL = test(oplusR1, one_L)
		val oplusR_botR = test(oplusR1, bot_R)
		val oplusR_botL = test(oplusR1, bot_L)

		val oplusR_inorder =  [("oplusR_tensorR",oplusR_tensorR),
								("oplusR_tensorL",oplusR_tensorL),
								("oplusR_lolliR",oplusR_lolliR),
								("oplusR_lolliL",oplusR_lolliL),
								("oplusR_oplusR",oplusR_oplusR),
								("oplusR_oplusL",oplusR_oplusL),
								("oplusR_withR",oplusR_withR),
								("oplusR_withL",oplusR_withL),
								("oplusR_parR",oplusR_parR),
								("oplusR_parL",oplusR_parL),
								("oplusR_bangR",oplusR_bangR), 
								("oplusR_bangL1",oplusR_bangL1),
								("oplusR_bangL2",oplusR_bangL2),
								("oplusR_quesR1",oplusR_quesR1),
								("oplusR_quesR2",oplusR_quesR2),
								("oplusR_quesL",oplusR_quesL),
								("oplusR_oneR",oplusR_oneR),
								("oplusR_oneL",oplusR_oneL),
								("oplusR_botR",oplusR_botR),
								("oplusR_botL",oplusR_botL)]
	in
		oplusR_inorder
	end

  (*testing with R permutes up*)
	fun withR_permute () = 
		let
		val withR_tensorR = test(withR1,tensorR1)
		val withR_tensorL = test(withR1,tensorL1)
		val withR_lolliR = test(withR1,lolli_R)
		val withR_lolliL = test(withR1,lolli_L)
		val withR_oplusR = test(withR1,oplusR1)
		val withR_oplusL = test(withR1,oplusL)
		val withR_withR = test(withR1,withR2)
		val withR_withL = test(withR1,withL)
		val withR_parR = test(withR1, par_R)
		val withR_parL = test(withR1, par_L)
		val withR_bangR = test(withR1,bang_R)
		val withR_bangL1 = test(withR1,bang_L1)
		val withR_bangL2 = test(withR1,bang_L2)
		val withR_quesR1 = test(withR1,ques_R1)
		val withR_quesR2 = test(withR1,ques_R2)
		val withR_quesL = test(withR1,ques_L)
		val withR_oneR = test(withR1, one_R)
		val withR_oneL = test(withR1, one_L)
		val withR_botR = test(withR1, bot_R)
		val withR_botL = test(withR1, bot_L)

		val withR_inorder =   [("withR_tensorR",withR_tensorR),
								("withR_tensorL",withR_tensorL),
								("withR_lolliR",withR_lolliR),
								("withR_lolliL",withR_lolliL),
								("withR_oplusR",withR_oplusR),
								("withR_oplusL",withR_oplusL),
								("withR_withR",withR_withR),
								("withR_withL",withR_withL),
								("withR_parR",withR_parR),
								("withR_parL",withR_parL),
								("withR_bangR",withR_bangR), 
								("withR_bangL1",withR_bangL1),
								("withR_bangL2",withR_bangL2),
								("withR_quesR1",withR_quesR1),
								("withR_quesR2",withR_quesR2),
								("withR_quesL",withR_quesL),
								("withR_oneR",withR_oneR),
								("withR_oneL",withR_oneL),
								("withR_botR",withR_botR),
								("withR_botL",withR_botL)]
	in
		withR_inorder
	end



end
