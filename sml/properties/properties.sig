signature PROPERTIES = 
sig
	structure D : DATATYPES
	structure U : UNIFICATION
	type constraint = D.ctx_var * (D.ctx_var list) * (D.ctx_var list)
	type tree = constraint list * D.der_tree
	type proof = tree * (tree option)
	
	(* formula with connective * (left rules * right rules) * init rule * axioms*)
	val init_coherence_con : ((D.form * D.rule list * D.rule list) * D.rule* D.rule list) -> bool * proof

	(* formula with connective * (left rules * right rules) * init rules * axioms*)
	(* checks init_coherence_con for each init rule *)
	val init_coherence_mult_init : ((D.form * D.rule list * D.rule list) * D.rule list* D.rule list) -> bool * proof

	(* checks if init_coherence_con is true for all connectives for each init rule *)
	val init_coherence : ((D.form * D.rule list * D.rule list) list * D.rule list* D.rule list) -> bool * (bool * proof) list
	val init_coherence_print : ((D.form * D.rule list * D.rule list) list * D.rule list* D.rule list) -> unit
	
	val weakening_rule_context : (D.rule * (D.side * int)) -> bool * proof list
	val weakening_context : (D.rule list * (D.side * int)) -> bool * proof list
	val weakening_proofs : D.rule list -> ((bool * proof list) list) * ((bool * proof list) list)
	val weakening : D.rule list -> (bool list) * (bool list)
	val weakening_print : D.rule list -> unit

	val check_premises' : (constraint list * D.der_tree)*(constraint list * D.der_tree) * (bool list * bool list) -> tree option
	val permutes : D.rule * D.rule * D.rule list * (bool list * bool list) -> (((((constraint list * D.der_tree) * (constraint list * D.der_tree)) list) * ((constraint list * D.der_tree) list)) * (constraint list * D.der_tree) list) list
	val permute_print : D.rule * D.rule * D.rule list * (bool list * bool list) -> unit
end

