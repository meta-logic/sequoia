signature EXPORTLATEX = sig

    structure DAT : DATATYPES
    type dev_tree = DAT.dev_tree
    val export_toLatex : string -> dev_tree -> unit

end