signature UNIFICATION = sig

    structure DAT : DATATYPES
    type sub = DAT.sub
    type form = DAT.form
    type ctx_var = DAT.ctx_var
    type ctx_struct = DAT.ctx_struct
    type ctx = DAT.ctx
    type seq = DAT.seq

    val Unify_form : form * form -> sub list list option
    val Unify_formL : form list * form list -> sub list list option
    val Unify_ctx : ctx * ctx
        -> (sub list * (ctx_var * ctx_var list * ctx_var list) list) list option
    val Unify_ctx_struct : ctx_struct * ctx_struct
        -> (sub list * (ctx_var * ctx_var list * ctx_var list) list) list option
    val Unify_seq : seq * seq
        -> (sub list * (ctx_var * ctx_var list * ctx_var list) list) list option
    val print_sigs_cons : (sub list * (ctx_var * ctx_var list * ctx_var list) list) list option
        -> (string list * string list) list

end