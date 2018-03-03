(*Datatypes*)
datatype conn = Con of string 
datatype form = Atom of string | Form of form * conn * form | Uform of conn * form
datatype ctx = Single of form list | Mult of form list * conn * ctx
type seq = ctx * conn * ctx

fun vee (Single ((Form (Atom (A), Con ("\vee"), Atom (B)))::Atom (A1)::nil)) = [Single (Atom (A)::nil)]
	| vee _ = []
