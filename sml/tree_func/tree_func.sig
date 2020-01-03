signature TREEFUNC = sig

    structure Dat : DATATYPES
    type conn = Dat.conn
    type form = Dat.form
    type ctx_var = Dat.ctx_var
    type ctx = Dat.ctx
    type ctx_struct = Dat.ctx_struct
    type seq = Dat.seq
    type side = Dat.side
    type rule = Dat.rule
    type sub = Dat.sub
    type rule_name = Dat.rule_name
    type der_tree = Dat.der_tree


    val get_tree_height : der_tree -> int
    val get_open_prems : der_tree -> der_tree list
    val closed_tree : der_tree -> bool
    val atomic_transform : seq -> seq
    val get_forms : seq -> form list
    val get_ctx_vars : seq -> ctx_var list
    val filter_bad_subs : (sub list * 'a) list * seq -> (sub list * 'a) list
    val get_premises_of : der_tree * string -> seq list
    val check_rule_of : (ctx_var * ctx_var list * ctx_var list) list * der_tree * string -> bool
    val apply_rule : (form list * (ctx_var * ctx_var list * ctx_var list) list * der_tree) * 
        rule * string
        -> (form list * (ctx_var * ctx_var list * ctx_var list) list * der_tree) 
            list
    val apply_rule_everywhere : (form list * (ctx_var * ctx_var list * ctx_var list) list * der_tree) * 
        rule
        -> (form list * (ctx_var * ctx_var list * ctx_var list) list * der_tree) 
            list
    val apply_rule_all_ways : (form list * (ctx_var * ctx_var list * ctx_var list) list * der_tree) * 
        rule * bool
        -> (form list * (ctx_var * ctx_var list * ctx_var list) list * der_tree) 
            list
    val apply_multiple_rules_all_ways : (form list * (ctx_var * ctx_var list * ctx_var list) list * der_tree) * 
        rule list
        -> (form list * (ctx_var * ctx_var list * ctx_var list) list * der_tree) 
            list
    val translate_premises : der_tree * rule * string * int -> unit
end