structure Sequent_calculus =
struct
  structure D = datatypesImpl

  val t = ref 1000000000

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

end
