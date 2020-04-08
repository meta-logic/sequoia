(*  Sequoia  Copyright (C) 2020  Mohammed Hashim
    This program comes with ABSOLUTELY NO WARRANTY; for details type `show w'.
    This is free software, and you are welcome to redistribute it
    under certain conditions; type `show c' for details.
*)

signature CONSTRAINTS =
sig
    structure Dat : DATATYPES
    type constraint = (Dat.ctx_var * Dat.ctx_var list * Dat.ctx_var list)

    val get_index : unit -> int
    val change_index : int -> unit
    val fresh : string -> string
    val fresh_ctx_var : Dat.ctx_var -> Dat.ctx_var
    val get_constraints' : Dat.ctx_var list * Dat.ctx_var list -> constraint list * constraint list
    val get_constraints: Dat.ctx_var list * Dat.ctx_var list -> constraint list * Dat.sub list
end