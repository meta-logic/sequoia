signature PROPERTIES = 
sig
	structure D : DATATYPES
	structure U : UNIFICATION
	type constraint = D.ctx_var * (D.ctx_var list) * (D.ctx_var list)
	
	(* formula with connective * left rule * right rule * init rule *)
	val init_coherence_con : (D.form * D.rule list * D.rule list * D.rule) -> bool
	
	val check_premises' : (constraint list * D.der_tree)*(constraint list * D.der_tree) * (bool list * bool list) -> bool
	val permutes : D.rule * D.rule * D.rule list * (bool list * bool list) -> ((((D.der_tree * D.der_tree) list) * ((constraint list * D.der_tree) list)) * (constraint list * D.der_tree) list) list
end

