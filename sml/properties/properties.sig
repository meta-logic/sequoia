(*  Sequoia  Copyright (C) 2020  Zan Naeem, Mohammed Hashim
    This program comes with ABSOLUTELY NO WARRANTY; for details see LICENSE.
    This is free software, and you are welcome to redistribute it
    under certain conditions; see LICENSE for details.
*)

signature PROPERTIES = 
sig
	structure D : DATATYPES
	type constraint = D.ctx_var * (D.ctx_var list) * (D.ctx_var list)
	type tree = constraint list * D.der_tree
	type proof = tree * (tree option)
	
	(* formula with connective * (left rules * right rules) * init rule * axioms*)
	val init_coherence_con : ((D.conn * D.rule list * D.rule list) * D.rule* D.rule list) -> bool * proof

	(* formula with connective * (left rules * right rules) * init rules * axioms*)
	(* checks init_coherence_con for each init rule *)
	val init_coherence_mult_init : ((D.conn * D.rule list * D.rule list) * D.rule list* D.rule list) -> bool * proof

	(* checks if init_coherence_con is true for all connectives for each init rule *)
	val init_coherence : ((D.conn * D.rule list * D.rule list) list * D.rule list* D.rule list) -> bool * (bool * proof) list
	val init_coherence_print : ((D.conn * D.rule list * D.rule list) list * D.rule list* D.rule list) -> unit
	
	val weakening_rule_context : (D.rule * (D.side * int)) -> bool * proof list
	val weakening_context : (D.rule list * (D.side * int)) -> bool * proof list
	val weakening_proofs : D.rule list -> ((bool * proof list) list) * ((bool * proof list) list)
	val weakening : D.rule list -> (bool list) * (bool list)
	val weakening_print : D.rule list -> unit

	val check_premises' : (constraint list * D.der_tree)*(constraint list * D.der_tree) * (bool list * bool list) -> tree option
	val permute : D.rule * D.rule * D.rule list * (bool list * bool list) -> 
	(((((constraint list * D.der_tree) * (constraint list * D.der_tree)) list) * 
	((constraint list * D.der_tree) list)) * (constraint list * D.der_tree) list) list
	val permute_final : D.rule * D.rule * D.rule list * (bool list * bool list) -> string
	val permute_print : D.rule * D.rule * D.rule list * (bool list * bool list) -> unit


	val cut_axiom : D.rule * D.form * D.rule * (bool list * bool list) -> bool * proof list
	val cut_rank_reduction : D.rule * D.form * D.rule * (bool list * bool list) -> bool * proof list
	val cut_grade_reduction : D.rule * (D.conn * D.rule list * D.rule list) * 
	D.form * (bool list * bool list) -> bool * proof list

	val cut_elim: (D.rule * D.form) list * (D.conn * D.rule list * D.rule list) list * (D.rule list) * (bool list * bool list) 
		-> (bool * ((bool * proof list) list) *
			((bool * proof list) list) *
			((bool * proof list) list)) list
	
	val cut_elim_print' : int -> (D.rule * D.form) * (D.conn * D.rule list * D.rule list) list * (D.rule list) * (bool list * bool list) -> unit
	val cut_elim_print : (D.rule * D.form) * (D.conn * D.rule list * D.rule list) list * (D.rule list) * (bool list * bool list) -> unit
		

end

