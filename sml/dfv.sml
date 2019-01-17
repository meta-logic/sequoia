(*Datatypes*)
datatype conn = Con of string 
datatype form = Atom of string | Form of form * conn * form | Uform of conn * form
datatype ctx = Single of form list | Mult of form list * conn * ctx
type seq = ctx * conn * ctx


fun form_toString (Atom (s)) = s
	| form_toString (Form (f1, Con (c), f2)) = form_toString (f1) ^ " " ^ c ^ " " ^ form_toString (f2)
	| form_toString (Uform (Con (c), f)) = c ^ " " ^ form_toString(f)
	
fun formL_toString (x::nil) = form_toString(x)
	| formL_toString (x::l) = formL_toString(l) ^ ", " ^ form_toString(x)

fun ctx_toString (Single (fl)) = formL_toString(fl)
	| ctx_toString (Mult (fl, Con (c), ctx)) = formL_toString(fl) ^ " " ^ c ^ " " ^ ctx_toString(ctx)

fun seq_toString (ctx1, Con (c), ctx2) = ctx_toString(ctx1) ^ " " ^ c ^ " " ^ ctx_toString(ctx2)

fun toString (s) = seq_toString(s)


fun dfv ((Single (Atom (A)::Gamma), Con ("\\vdash"), Single (Atom (A1)::nil))) = []
	| dfv _ = []
