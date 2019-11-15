signature PROPERTIES = 
sig
	structure D : DATATYPES
	structure U : UNIFICATION
	type constraint = D.ctx_var * (D.ctx_var list) * (D.ctx_var list)

	val check_premises' : (constraint list * D.der_tree)*(constraint list * D.der_tree) -> bool
	val permutes : D.rule * D.rule * D.rule list * bool * bool -> ((((D.der_tree * D.der_tree) list) * ((constraint list * D.der_tree) list)) * (constraint list * D.der_tree) list) list
end

