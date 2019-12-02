signature PROPERTIES = 
sig
	structure D : DATATYPES
	structure U : UNIFICATION
	type constraint = D.ctx_var * (D.ctx_var list) * (D.ctx_var list)
	
	(* formula with connective * (left rules * right rules) * init rule * axioms*)
	val init_coherence_con : ((D.form * D.rule list * D.rule list) * D.rule* D.rule list) -> bool * (D.der_tree * (constraint list * D.der_tree) option)

	(* formula with connective * (left rules * right rules) * init rules * axioms*)
	(* checks init_coherence_con for each init rule *)
	val init_coherence_mult_init : ((D.form * D.rule list * D.rule list) * D.rule list* D.rule list) -> bool * (D.der_tree * (constraint list * D.der_tree) option)

	(* checks if init_coherence_con is true for all connectives for each init rule *)
	val init_coherence : ((D.form * D.rule list * D.rule list) list * D.rule list* D.rule list) -> bool
	
	val weakening_rule_context : (D.rule * (D.side * int)) -> bool * ((constraint list * D.der_tree) * (constraint list * D.der_tree) option) list
	val weakening_context : (D.rule list * (D.side * int)) -> bool * ((constraint list * D.der_tree) * (constraint list * D.der_tree) option) list
	val weakening : D.rule list -> (bool list) * (bool list)

	val check_premises' : (constraint list * D.der_tree)*(constraint list * D.der_tree) * (bool list * bool list) -> bool
	val permutes : D.rule * D.rule * D.rule list * (bool list * bool list) -> (((((constraint list * D.der_tree) * (constraint list * D.der_tree)) list) * ((constraint list * D.der_tree) list)) * (constraint list * D.der_tree) list) list
	val permute_final : D.rule * D.rule * D.rule list * (bool list * bool list) -> unit
end

