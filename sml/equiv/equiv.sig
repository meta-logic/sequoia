signature EQUIVALENCE = 
sig
	structure Dat : DATATYPES

	val ctx_struct_equiv : Dat.ctx_struct * Dat.ctx_struct -> bool
	
	val seq_equiv : Dat.seq*Dat.seq -> bool
	
	val check_consistent : (Dat.ctx_var * Dat.ctx_var list * Dat.ctx_var list) list * 
	 Dat.ctx_var list * Dat.ctx_var list-> bool

	
	val check_premises : ((string * Dat.seq) list * Dat.der_tree * 
	 (Dat.ctx_var * Dat.ctx_var list * Dat.ctx_var list) list*
	  Dat.ctx_var list * Dat.ctx_var list) -> Dat.der_tree option
	
	val check_premises_wk : ((string * Dat.seq) list * Dat.der_tree * 
	 (Dat.ctx_var * Dat.ctx_var list * Dat.ctx_var list) list*
	  (bool list * bool list) *  Dat.ctx_var list * Dat.ctx_var list) -> Dat.der_tree option

end