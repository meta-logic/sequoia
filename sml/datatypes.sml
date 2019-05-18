(*Datatypes*)

datatype conn = Con of string

datatype form = Atom of string 
              | AtomVar of string 
              | FormVar of string 
              | Form of conn * form list

datatype ctx_var = CtxVar of string

datatype ctx = Ctx of ctx_var list * form list

datatype ctx_struct = Empty 
                    | Single of ctx 
                    | Mult of conn * ctx * ctx_struct

datatype seq = Seq of ctx_struct * conn * ctx_struct


(*Printing functions for the above datatypes*)

fun join (L, sep, to_string) = let
  fun join_ [] = ""
    | join_ [x] = to_string x
    | join_ (x::l) = (to_string x) ^ sep ^ (join_ l)
  in
    join_ L
  end

fun form_to_string (Atom s) = s
  | form_to_string (AtomVar s) = s
  | form_to_string (FormVar s) = s
  | form_to_string (Form (Con c, fl)) = c ^ "(" ^ (join (fl, ", ", form_to_string)) ^ ")"

fun ctx_var_to_string (CtxVar s) = s

fun ctx_to_string (Ctx ([],[])) = ""
  | ctx_to_string (Ctx ([],fl)) = join (fl, ", ", form_to_string)
  | ctx_to_string (Ctx (vl,[])) = join (vl, ", ", ctx_var_to_string)
  | ctx_to_string (Ctx (vl,fl)) = (join (vl, ", ", ctx_var_to_string)) ^ ", " ^ (join (fl, ", ", form_to_string))

fun ctx_struct_to_string Empty = ""
  | ctx_struct_to_string (Single ctx) = ctx_to_string ctx
  | ctx_struct_to_string (Mult (Con c, ctx, rest)) = 
      (ctx_to_string ctx) ^ " " ^ c ^ " " ^ (ctx_struct_to_string rest)

fun seq_to_string (Seq (ctx1, Con c, ctx2)) = (ctx_struct_to_string ctx1) ^ " " ^ c ^ " " ^ (ctx_struct_to_string ctx2)

