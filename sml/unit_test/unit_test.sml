structure UnitTest = 
struct
    structure Q = QCheck
    structure G = Gen
    structure U = U_Pred
    structure D = datatypesImpl

    val seq_reader =  (Q.Gen.zip(G.seq_gen,G.seq_gen),SOME (fn (x,y) =>
    (D.seq_toString x) ^" and "^ (D.seq_toString y)))
    val prop = ("if u is a unifier for S1 and S2, then S1 u = S2 u",U_Pred.unification_prop)
    fun res () = Q.checkGen seq_reader prop

end
