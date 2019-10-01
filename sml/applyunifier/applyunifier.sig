signature APPLYUNIFIER = sig

    structure DAT : DATATYPES
    type sub = DAT.sub
    type form = DAT.form
    type ctx_var = DAT.ctx_var
    type ctx_struct = DAT.ctx_struct
    type seq = DAT.seq
    type der_tree = DAT.der_tree

    val apply_form_Unifier : form * sub list -> form
    val apply_formL_Unifier : form list * sub list -> form list
    val apply_formL_allUnifiers : form list * sub list list -> form list list
    
    val apply_ctx_var_Unifier : ctx_var * sub list -> ctx_var list * form list
    val apply_ctx_varL_Unifier : ctx_var list * sub list -> (ctx_var list * form list) list
    val apply_ctx_varL_allUnifiers : ctx_var list * sub list list -> (ctx_var list * form list) list list
    
    val apply_ctx_struct_Unifier : ctx_struct * sub list -> ctx_struct
    val apply_ctx_struct_allUnifiers : ctx_struct * sub list list -> ctx_struct list
    
    val apply_seq_Unifier : seq * sub list -> seq
    val apply_seq_allUnifier : seq * sub list list -> seq list
    
    val apply_der_tree_Unifier : der_tree * sub list -> der_tree
    
    val compose : sub * sub list -> sub * bool
    val UnifierComposition : sub list * sub list -> sub list

end