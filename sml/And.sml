(*Datatypes*)
datatype conn = Con of string 
datatype form = Atom of string | Form of form * conn * form | Uform of conn * form
datatype ctx = Single of form list | Mult of form list * conn * ctx
type seq = ctx * conn * ctx

fun And (Form(Form(Atom (A),Con ("\\wedge"),Atom (B)),(Con ("\\Rightarrow")),(Atom (C))),C,D) = [Form((Atom (A)),(Con ("\\Rightarrow")),(Atom (C)))]
	| And _ = []
