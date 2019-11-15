signature PROPERTIES = 
sig
	structure D : DATATYPES
	structure U : UNIFICATION
	type constraint = D.ctx_var * (D.ctx_var list) * (D.ctx_var list)
	
	(* formula with connective * (left rules * right rules) * init rule * axioms*)
	val init_coherence_con : ((D.form * D.rule list * D.rule list) * D.rule* D.rule list) -> bool

	(* formula with connective * (left rules * right rules) * init rules * axioms*)
	(* checks init_coherence_con for each init rule *)
	val init_coherence_mult_init : ((D.form * D.rule list * D.rule list) * D.rule list* D.rule list) -> bool list

	(* checks if init_coherence_con is true for all connectives for each init rule *)
	val init_coherence : ((D.form * D.rule list * D.rule list) list * D.rule list* D.rule list) -> bool list
	
	val weakening_rule_context : (D.rule * (D.side * int)) -> bool
	val weakening_context : (D.rule list * (D.side * int)) -> bool
	val weakening : D.rule list -> (bool list) * (bool list)

	val check_premises' : (constraint list * D.der_tree)*(constraint list * D.der_tree) * (bool list * bool list) -> bool
	val permutes : D.rule * D.rule * D.rule list * (bool list * bool list) -> ((((D.der_tree * D.der_tree) list) * ((constraint list * D.der_tree) list)) * (constraint list * D.der_tree) list) list
end

