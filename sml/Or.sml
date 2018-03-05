(*Datatypes*)
datatype conn = Con of string 
datatype form = Atom of string | Form of form * conn * form | Uform of conn * form
datatype ctx = Single of form list | Mult of form list * conn * ctx
type seq = ctx * conn * ctx

fun Or (Single ((Form (Form (A), Con ("\vee"), Form (B)))::nil)) = [Single (Form (A)::nil)]
	| Or _ = []
