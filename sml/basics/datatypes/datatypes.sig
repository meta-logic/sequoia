signature DATATYPES = sig

    datatype conn = Con of string
    datatype form = Atom of string | AtomVar of string | FormVar of string | Form of conn * form list
    datatype ctx_var = CtxVar of string
    datatype ctx = Ctx of ctx_var list * form list
    datatype ctx_struct = Empty | Single of ctx | Mult of conn * ctx * ctx_struct
    datatype seq = Seq of ctx_struct * conn * ctx_struct
    datatype side = Left | Right | None
    datatype rule = Rule of string * side * seq * seq list
    datatype sub = Fs of form * form | CVs of ctx_var * ctx
    datatype rule_name = NoRule | RuleName of string
    datatype der_tree = DerTree of string * seq * rule_name * der_tree list

    val conn_toString : conn -> string
    val conn_eq : conn * conn -> bool

    val form_toString : form -> string
    val form_eq : form * form -> bool
    val form_alpha_eq : form * form -> bool
    val form_larger : form * form -> bool
    val formL_toString : form list -> string

    val ctx_var_toString : ctx_var -> string
    val ctx_var_eq : ctx_var * ctx_var -> bool
    val ctx_varL_toString : ctx_var list -> string

    val ctx_toString : ctx -> string
    val ctx_eq : ctx * ctx -> bool
    val ctx_alpha_eq : ctx * ctx -> bool

    val ctx_struct_toString : ctx_struct -> string
    val ctx_struct_eq : ctx_struct * ctx_struct -> bool
    val ctx_struct_alpha_eq : ctx_struct * ctx_struct -> bool

    val seq_toString : seq -> string
    val seq_eq : seq * seq -> bool
    val seq_alpha_eq : seq * seq -> bool

    val rule_eq : rule * rule -> bool

    val sub_eq : sub * sub -> bool
    val sub_prefix_eq : sub * sub -> bool

end