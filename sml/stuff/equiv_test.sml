structure EquivTest = 
struct
	structure Dat = datatypesImpl

	structure E = Equivalence

	
	val t1_vars = [Dat.CtxVar("g"),Dat.CtxVar("1"),Dat.CtxVar("2"),Dat.CtxVar("3"),Dat.CtxVar("4")]
	val t2_vars = [Dat.CtxVar("p"),Dat.CtxVar("p1"),Dat.CtxVar("p2"),Dat.CtxVar("p3"),Dat.CtxVar("p4")]
	val constraints = [(Dat.CtxVar("test"),[Dat.CtxVar("g")],[Dat.CtxVar("1"),Dat.CtxVar("2")]),
					   (Dat.CtxVar("test"),[Dat.CtxVar("2")],[Dat.CtxVar("3"),Dat.CtxVar("4")]),
					   (Dat.CtxVar("test"),[Dat.CtxVar("p")],[Dat.CtxVar("p1"),Dat.CtxVar("p2")]),
					   (Dat.CtxVar("test"),[Dat.CtxVar("p1")],[Dat.CtxVar("p3"),Dat.CtxVar("p4")]),
					   (Dat.CtxVar("test"),[Dat.CtxVar("1")],[Dat.CtxVar("p3")]),
					   (Dat.CtxVar("test"),[Dat.CtxVar("3")],[Dat.CtxVar("p4")]),
					   (Dat.CtxVar("test"),[Dat.CtxVar("4")],[Dat.CtxVar("p2")])]
	val goal = [(Dat.CtxVar("test"),[Dat.CtxVar("g")],[Dat.CtxVar("p")])]

	(*test 1, should succeed. G = G1,G2| G2 = G3,G4 | G' = G1',G2' | G1' =G3',G4' | G1 = G3' | G3 = G4' | G4 = G2'*)
	(*checking if G = G'*)

	val test1 = E.check_consistent (constraints,goal,t1_vars,t2_vars)

	val t1_vars2 = [Dat.CtxVar("g"),Dat.CtxVar("1"),Dat.CtxVar("2")]
	val t2_vars2 = [Dat.CtxVar("p")]
	val constraints2 = [(Dat.CtxVar("test"),[Dat.CtxVar("g")],[Dat.CtxVar("1"),Dat.CtxVar("2")]),
					   (Dat.CtxVar("test"),[Dat.CtxVar("1")],[Dat.CtxVar("p")]),
					   (Dat.CtxVar("test"),[Dat.CtxVar("2")],[Dat.CtxVar("p")])]
	(*test 2, should fail. G = G1,G2 | G1 = G' | G2 = G' |, checking if G = G'*)				 
	val test2 = E.check_consistent (constraints2,goal,t1_vars2,t2_vars2)
  

	val constraints3 = [(Dat.CtxVar("test"),[Dat.CtxVar("g")],[Dat.CtxVar("1"),Dat.CtxVar("2")]),
					   (Dat.CtxVar("test"),[Dat.CtxVar("2")],[Dat.CtxVar("3"),Dat.CtxVar("4")]),
					   (Dat.CtxVar("test"),[Dat.CtxVar("p")],[Dat.CtxVar("p1"),Dat.CtxVar("p2")]),
					   (Dat.CtxVar("test"),[Dat.CtxVar("p1")],[Dat.CtxVar("p3"),Dat.CtxVar("p4")]),
					   (Dat.CtxVar("test"),[Dat.CtxVar("1")],[Dat.CtxVar("p3")]),
					   (Dat.CtxVar("test"),[Dat.CtxVar("3")],[Dat.CtxVar("p4")]),
					   (Dat.CtxVar("test"),[Dat.CtxVar("4")],[Dat.CtxVar("p2")]),
					   (Dat.CtxVar("test"),[Dat.CtxVar("g")],[Dat.CtxVar("p3")])]
	val test3 = E.check_consistent (constraints3,goal,t1_vars,t2_vars)

	val goal4 = [(Dat.CtxVar("left"),[Dat.CtxVar("g")],[Dat.CtxVar "gp"]),(Dat.CtxVar("right"),[Dat.CtxVar("d")],[Dat.CtxVar "dp"])]
	val constraints4 = [(Dat.CtxVar("test4"),[Dat.CtxVar("g")],[Dat.CtxVar("g1"),Dat.CtxVar("g2")]),
					   (Dat.CtxVar("test4"),[Dat.CtxVar("d")],[Dat.CtxVar("d1"),Dat.CtxVar("d2")]),
					   (Dat.CtxVar("test4"),[Dat.CtxVar("gp")],[Dat.CtxVar("gp1"),Dat.CtxVar("gp2")]),
					   (Dat.CtxVar("test4"),[Dat.CtxVar("dp")],[Dat.CtxVar("dp1"),Dat.CtxVar("dp2")]),
					   (Dat.CtxVar("match"),[Dat.CtxVar("g1")],[Dat.CtxVar("gp1")]),
					   (Dat.CtxVar("match"),[Dat.CtxVar("d1")],[]),
					   (Dat.CtxVar("match"),[Dat.CtxVar("g2")],[Dat.CtxVar("gp2")])]
	val t_left_vars = [Dat.CtxVar("g"),Dat.CtxVar("g1"),Dat.CtxVar("g2"),Dat.CtxVar("d"),Dat.CtxVar("d1"),Dat.CtxVar("d2")]
	val t_right_vars = [Dat.CtxVar("gp"),Dat.CtxVar("gp1"),Dat.CtxVar("gp2"),Dat.CtxVar("dp"),Dat.CtxVar("dp1"),Dat.CtxVar("dp2")]


	val test4 = E.check_consistent (constraints4,goal4,t_left_vars,t_right_vars)
	val test5 = E.check_consistent (constraints4,goal4,t_right_vars,t_left_vars)


	val true = test1
	val false = test2
	val false = test3
	val false = test4
	val true = test5

end