signature EXPORTLATEX = sig

    structure Dat : DATATYPES
    type dev_tree = Dat.dev_tree
    val export_toLatex : string -> dev_tree -> unit

end