signature PROPERTIES = 
sig
	structure D : DATATYPES
	structure U : UNIFICATION
	val permutes : D.rule * D.rule * D.rule list * bool * bool -> bool option
  

end

