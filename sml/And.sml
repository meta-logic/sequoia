(*Datatypes*)
datatype conn = Con of string 
datatype form = Atom of string | Form of form * conn * form | Uform of conn * form
datatype ctx = Single of form list | Mult of form list * conn * ctx
type seq = ctx * conn * ctx

fun And ((Single ((Form (Atom (A), Con ("\\wedge"), Form (B)))::Gamma), Con ("\\rightarrow"), Single (Form (C)::nil))) = [(Single (Atom (A)::Gamma), Con ("\\rightarrow"), Single (Form (C)::nil)),(Single (Form (B)::Gamma), Con ("\\rightarrow"), Single (Form (C)::nil))]
	| And _ = []
