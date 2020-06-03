structure U_Pred = 
struct
    structure D = datatypesImpl
    structure U = unifyImpl
    structure Q = QCheck
    structure G = Gen
    structure App = applyunifierImpl
    structure E = Equivalence

    fun have_unifier (seq1,seq2) = Option.isSome (U.Unify_seq(seq1,seq2))
    

    fun same_result (seq1,seq2) = 
        let
            val res = Option.valOf (U.Unify_seq(seq1,seq2))
            fun check (subs,constraints) =
              E.seq_equiv(App.apply_seq_Unifier(seq1,subs),App.apply_seq_Unifier(seq2,subs))  
        in
            List.all check res
        end

    val unification_prop = Q.implies (have_unifier, Q.pred same_result)
end

