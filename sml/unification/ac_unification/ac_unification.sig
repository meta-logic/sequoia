(*  Sequoia  Copyright (C) 2020  Mohammed Hashim
    This program comes with ABSOLUTELY NO WARRANTY; for details type `show w'.
    This is free software, and you are welcome to redistribute it
    under certain conditions; type `show c' for details.
*)

signature ACUNIFICATION =
sig
    structure D : DATATYPES

    type constraint = (D.ctx_var * D.ctx_var list * D.ctx_var list)
    val change_start_index : int -> unit


    (* given a constraint, return the most general unifier *)
    val solve_constraint : constraint -> D.sub list

    (* given a list of constraints, return the most general unifier *)
    val solve_constraints : constraint list -> D.sub list
end