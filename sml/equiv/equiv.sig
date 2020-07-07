(*  Sequoia  Copyright (C) 2020  Mohammed Hashim
    This program comes with ABSOLUTELY NO WARRANTY; for details see LICENSE.
    This is free software, and you are welcome to redistribute it
    under certain conditions; see LICENSE for details.
*)

signature EQUIVALENCE = 
sig
	structure Dat : DATATYPES

	type constraint = (Dat.ctx_var * Dat.ctx_var list * Dat.ctx_var list)

	val ctx_equiv : Dat.ctx * Dat.ctx -> bool

	val ctx_struct_equiv : Dat.ctx_struct * Dat.ctx_struct -> bool
	
	val seq_equiv : Dat.seq*Dat.seq -> bool
	
	val check_consistent : (Dat.ctx_var * Dat.ctx_var list * Dat.ctx_var list) list * 
	 Dat.ctx_var list * Dat.ctx_var list-> bool

	val extract_constraints : (Dat.seq * Dat.seq) -> constraint list
	val check_premises : ((string * Dat.seq) list * Dat.der_tree * 
	 (Dat.ctx_var * Dat.ctx_var list * Dat.ctx_var list) list*
	  Dat.ctx_var list * Dat.ctx_var list) -> Dat.der_tree option
	
	val check_premises_wk : ((string * Dat.seq) list * Dat.der_tree * 
	 (Dat.ctx_var * Dat.ctx_var list * Dat.ctx_var list) list*
	  (bool list * bool list) *  Dat.ctx_var list * Dat.ctx_var list) -> Dat.der_tree option

end