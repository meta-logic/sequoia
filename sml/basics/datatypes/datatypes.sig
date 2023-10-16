(*  Sequoia  Copyright (C) 2020  Zan Naeem
    This program comes with ABSOLUTELY NO WARRANTY; for details see LICENSE.
    This is free software, and you are welcome to redistribute it
    under certain conditions; see LICENSE for details.
*)

signature DATATYPES =
sig

  (* See implementation for more information about the datatypes *)
  
  datatype conn = Con of string
                           
  datatype form = Atom of string
                | AtomVar of string
                | FormVar of string
                | Form of conn * form list
                                      
  datatype ctx_var = CtxVar of conn option * string
                                               
  datatype ctx = Ctx of ctx_var list * form list
                                            
  datatype ctx_struct = Empty
                      | Single of ctx
                      | Mult of conn * ctx * ctx_struct
                                               
  datatype seq = Seq of ctx_struct * conn * ctx_struct
                                              
  datatype side = Left
                | Right
                | None
                    
  datatype rule = Rule of string * side * seq * seq list
                                                    
  datatype sub = Fs of form * form
               | CTXs of ctx_var * ctx
                                     
  type rule_name = string option
  datatype der_tree = DerTree of string * seq * rule_name * der_tree list

  val conn_toString : conn -> string
  val conn_eq : conn * conn -> bool
                                 
  val form_toString : form -> string
  val form_stringify : form -> string
  val form_eq : form * form -> bool
  val form_alpha_eq : form * form -> bool
  val form_larger : form * form -> bool
  val formL_toString : form list -> string
  val form_update : (form -> form) -> form -> form
                                                
  val ctx_var_toString : ctx_var -> string
  val ctx_var_stringify : ctx_var -> string
  val ctx_var_eq : ctx_var * ctx_var -> bool
  val ctx_varL_toString : ctx_var list -> string
  val ctx_var_update : (ctx_var -> ctx_var) -> ctx_var -> ctx_var
  val const_toString : ctx_var * ctx_var list * ctx_var list -> string
  val const_stringify : ctx_var * ctx_var list * ctx_var list -> string
                                                                   
  val ctx_toString : ctx -> string
  val ctx_stringify : ctx -> string
  val ctx_eq : ctx * ctx -> bool
  val ctx_alpha_eq : ctx * ctx -> bool
  val ctx_update : ((ctx_var -> ctx_var)*(form -> form)) -> ctx -> ctx
                                                                     
  val ctx_struct_toString : ctx_struct -> string
  val ctx_struct_stringify : ctx_struct -> string
  val ctx_struct_eq : ctx_struct * ctx_struct -> bool
  val ctx_struct_alpha_eq : ctx_struct * ctx_struct -> bool
  val ctx_struct_update : ((ctx_var -> ctx_var)*(form -> form)) -> ctx_struct -> ctx_struct
                                                                                   
  val seq_toString : seq -> string
  val seq_stringify : seq -> string
  val seq_eq : seq * seq -> bool
  val seq_alpha_eq : seq * seq -> bool
  val seq_update : ((ctx_var -> ctx_var)*(form -> form)) -> seq -> seq
                                                                     
  val rule_eq : rule * rule -> bool
                                 
  val sub_eq : sub * sub -> bool
  val sub_prefix_eq : sub * sub -> bool
  val sub_to_string : sub -> string
  val subs_to_string : sub list -> string
end
