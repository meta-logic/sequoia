(*Datatypes*)
datatype conn = Con of string 
datatype form = Atom of string | Form of form * conn * form | Uform of conn * form
datatype ctx = Single of form list | Mult of form list * conn * ctx
type seq = ctx * conn * ctx

fun wedge R ((Single (\Gamma), Con (\vdash), Single ((Form (Form (A), Con ("\wedge"), Form (B)))::\Delta))) = [(Single (\Gamma), Con (\vdash), Single (Form (A)::\Delta)),(Single (\Gamma), Con (\vdash), Single (Form (B)::\Delta))]
	| wedge R _ = []
