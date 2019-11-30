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