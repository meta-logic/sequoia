signature PROPERTIES = 
sig
	structure D : DATATYPES
	structure U : UNIFICATION
	val permutes : D.rule * D.rule * D.rule list * bool * bool -> bool option

	val last1 : (D.dev_tree ) ref
	val last2 : (D.dev_tree ) ref
  

end

