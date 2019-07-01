

signature EQUIVALENCE = 
sig
	structure Dat : DATATYPES
	type eq_constraint = (string * Dat.ctx_var list * Dat.ctx_var list)

	val ctx_struct_equiv : Dat.ctx_struct * Dat.ctx_struct -> bool
	
	val seq_equiv : Dat.seq*Dat.seq -> bool
	
	val check_consistent : eq_constraint list * eq_constraint list-> bool

	
	val check_premises : (Dat.seq list * Dat.seq list * eq_constraint list* eq_constraint list * bool list) -> bool
	


	val test1 : bool
	val test2 : bool
end


structure Equivalence :> EQUIVALENCE = 
struct
	structure Set = SplaySetFn(StringKey);
	(*constraint form: String*ctx_var list*ctx_var list *)
	structure Dat = datatypesImpl

	structure H = helpersImpl


	type eq_constraint = (string * Dat.ctx_var list * Dat.ctx_var list)


	(*given 2 sequents, check if they are equivalent*)
	fun ctx_struct_equiv (Dat.Empty,Dat.Empty):bool = true
		|ctx_struct_equiv (Dat.Single (ctxA),Dat.Single(ctxB)) = ctx_equiv(ctxA,ctxB)
		|ctx_struct_equiv (Dat.Mult (connA,ctxA,ctx_struct_A),Dat.Mult (connB,ctxB,ctx_struct_B)) = (connA=connB) 
																							andalso ctx_equiv(ctxA,ctxB)
																							andalso ctx_struct_equiv(ctx_struct_A,ctx_struct_B)
		|ctx_struct_equiv (_,_) = false
	and ctx_equiv(Dat.Ctx(ctx_vars_A,forms_A),Dat.Ctx(ctx_vars_B,forms_B)) = ctx_vars_equiv(ctx_vars_A,ctx_vars_B)
																			andalso forms_eq(forms_A,forms_B)
	and forms_eq (forms_A, forms_B) = H.mset_eq(forms_B,forms_A,Dat.form_eq)
	and ctx_vars_equiv (_,_) = true

	fun seq_equiv (Dat.Seq(A1,con1,A2),Dat.Seq(B1,con2,B2)) = ctx_struct_equiv(A1,B1) andalso con1=con2 andalso ctx_struct_equiv(A2,B2)

	fun ctx_var_list_to_string([]) = ""
		|ctx_var_list_to_string([x]) = x
		|ctx_var_list_to_string(x::L) = x^","^ctx_var_list_to_string(L)



	fun eq_to_string ((_,L1,L2)) S=
		let
			fun mp (Dat.CtxVar(x)) = "g"^x
			val L1p = List.map mp L1
			val L2p = List.map mp L2
			val L1S = Set.addList(S,L1p)
			val L1sorted = ListMergeSort.sort (fn (x,y) => x>y) L1p
			val L1string= "["^ctx_var_list_to_string(L1sorted)^"]" 
			val L2S = Set.addList(L1S,L2p)
			val L2sorted = ListMergeSort.sort (fn (x,y) => x>y) L2p
			val L2string= "["^ctx_var_list_to_string(L2sorted)^"]"
		in
			("eq("^L1string^","^L2string^")",L2S)
		end

	fun cons_to_string ([]) S= ("\n",S)
		|cons_to_string (x::L) S =
		let
		 	val (str,Sp) = cons_to_string L S
		 	val (xp, Spp) = eq_to_string x Sp
		 in
		 	(xp^".\n"^str,Spp)
		 end 

	fun goal_to_string ([]) S = (".\n\n", S)
	   |goal_to_string (x::L) S = 
	   let
	   	 	val (xs, Sp) = eq_to_string x S
	   	 	val (rest, Spp) = goal_to_string L Sp
	   	 in
	   	 	case L of
	   	 		nil => (xs^rest^"goal("^xs^").\n",Spp)
	   	 		| _ => (xs^","^rest^"goal("^xs^").\n",Spp)
	   	 end	 

	fun less_predicates (x::nil) = "\n"
		|less_predicates (nil) = "\n"
		|less_predicates (x::y::L) = less_predicates(y::L)^"less("^x^","^y^").\n"


	(*taken from: https://stackoverflow.com/questions/33597175/how-to-write-to-a-file-in-sml*)
	fun writeFile filename content =
	    let val fd = TextIO.openOut filename
	        val _ = TextIO.output (fd, content) handle e => (TextIO.closeOut fd; raise e)
	        val _ = TextIO.closeOut fd
	    in () end

	(*goal has atleast one constraint*)
	fun check_consistent (constraints,goals) =
		let
			val (constraintS,S) = cons_to_string constraints Set.empty
			val (goal1,Sp) = goal_to_string goals S
			val (goal_final, less) = ("ok :- "^goal1, less_predicates(Set.listItems(Sp)))
			val _ = writeFile "check.dlv" (constraintS^goal_final^less)
			val result = Dlv.main_check("check.dlv")
			val _ = OS.FileSys.remove("check.dlv")
		in
			result
		end


	val constraints = [("test",[Dat.CtxVar("")],[Dat.CtxVar("1"),Dat.CtxVar("2")]),
					   ("test",[Dat.CtxVar("2")],[Dat.CtxVar("3"),Dat.CtxVar("4")]),
					   ("test",[Dat.CtxVar("p")],[Dat.CtxVar("p1"),Dat.CtxVar("p2")]),
					   ("test",[Dat.CtxVar("p1")],[Dat.CtxVar("p3"),Dat.CtxVar("p4")]),
					   ("test",[Dat.CtxVar("1")],[Dat.CtxVar("p3")]),
					   ("test",[Dat.CtxVar("3")],[Dat.CtxVar("p4")]),
					   ("test",[Dat.CtxVar("4")],[Dat.CtxVar("p2")])]
	val goal = [("test",[Dat.CtxVar("")],[Dat.CtxVar("p")])]

	(*test 1, should succeed. G = G1,G2| G2 = G3,G4 | G' = G1',G2' | G1' =G3',G4' | G1 = G3' | G3 = G4' | G4 = G2'*)
	(*checking if G = G'*)

	val test1 = check_consistent (constraints,goal)

	val constraints2 = [("test",[Dat.CtxVar("")],[Dat.CtxVar("1"),Dat.CtxVar("2")]),
					   ("test",[Dat.CtxVar("1")],[Dat.CtxVar("p")]),
					   ("test",[Dat.CtxVar("2")],[Dat.CtxVar("p")])]
	(*test 2, should fail. G = G1,G2 | G1 = G' | G2 = G' |, checking if G = G'*)				 
	val test2 = check_consistent (constraints2,goal)
  
	val true = test1
	val false = test2
  
	fun check_premises _ = true

	fun extract_constraints'' (Dat.Ctx (a,_), Dat.Ctx (b,_)) = ("eq",a,b)

	fun extract_constraints' (Dat.Empty,Dat.Empty) = []
		| extract_constraints' (Dat.Single a, Dat.Single b) = [extract_constraints'' (a,b)]
		| extract_constraints' (Dat.Mult(_,a,A),Dat.Mult(_,b,B)) = extract_constraints''(a,b)::extract_constraints'(A,B)
    | extract_constraints' (_,_) = raise Fail "Ctx_structs don't match"

	fun extract_constraints (Dat.Seq(A1,_,A2),Dat.Seq(B1,_,B2)) = extract_constraints'(A1,B1)@extract_constraints'(A2,B2)

	fun check_premises (_,[],constraints,goals,_) = check_consistent(constraints,goals)
		| check_premises (assumed_leaves,x::conc_leaves,cons,goals,wkL) = 
		let
			val possible_premises = List.filter (fn y => seq_equiv (x,y)) assumed_leaves
			fun find_match [] = false
				| find_match (y::L) = 
				let
					val new_cons = extract_constraints (y,x) @ cons
				in
					check_premises (assumed_leaves,conc_leaves,new_cons,goals,wkL) orelse
					find_match L
				end
		in
			find_match possible_premises
		end

	fun ctx_equiv_wk (Dat.Ctx(_,formsA),Dat.Ctx(_,formsB),term,wk_used)=
		case (wk_used,H.mset_eq(formsA,formsB,Dat.form_eq)) of
			(true,true) => (true,true)
			| (true,false) => (false,true)
			| (false,true) => (true,false)
			| (false,false) => if H.mset_eq(term::formsA,formsB,Dat.form_eq) then (true,true) else (false,false)

	fun ctx_struct_equiv_wk (Dat.Empty,Dat.Empty,_,wk) =(true,wk)
		|ctx_struct_equiv_wk (Dat.Single(ctxA),Dat.Single(ctxB),term,wk_used) = ctx_equiv_wk(ctxA,ctxB,term,wk_used)
		|ctx_struct_equiv_wk (Dat.Mult(connA,ctxA,ctx_structA),Dat.Mult(connB,ctxB,ctx_structB),term,wk)=
		let
			val (ctx,wk_used) = ctx_equiv_wk(ctxA,ctxB,term,wk)
			val (ctx_struct,wk_used2) = ctx_struct_equiv_wk (ctx_structA,ctx_structB,term,wk_used)
		in
			(ctx andalso ctx_struct andalso connA=connB,wk_used2)
		end
		|ctx_struct_equiv_wk (_,_,_,wk) = (false,wk) 

	fun seq_equiv_wk (Dat.Seq (leftA,connA,rightA),Dat.Seq(leftB,connB,rightB),term)=
		let
			val (resA,used_Wk) = ctx_struct_equiv_wk(leftA,leftB,term,false)
			val (resB,_) = ctx_struct_equiv_wk(rightA,rightB,term,used_Wk)
		in
			connA=connB andalso (resA andalso resB)
		end
	


	(*check premises with an extra term that can be weakened*)
	fun check_premises_wk (_,[],constraints,goals,_) = check_consistent(constraints,goals)
		|check_premises_wk (assumed_leaves,x::conc_leaves,cons,goals,term) = 
		let
			val possible_premises = List.filter (fn y => seq_equiv_wk (y,x,term)) assumed_leaves
			fun find_match [] = false
				| find_match (y::L) = 
				let
					val new_cons = extract_constraints (y,x) @ cons
				in
					check_premises_wk (assumed_leaves,conc_leaves,new_cons,goals,term) orelse
					find_match L
				end
		in
			find_match possible_premises
		end

	
	(* Body *)
end

