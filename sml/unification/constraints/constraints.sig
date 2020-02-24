signature CONSTRAINTS =
sig
    structure Dat : DATATYPES
    type constraint = (Dat.ctx_var * Dat.ctx_var list * Dat.ctx_var list)

    val get_index : unit -> int
    val change_index : int -> unit
    val fresh : string -> string

    val get_constraints: Dat.ctx_var list * Dat.ctx_var list -> constraint list
end