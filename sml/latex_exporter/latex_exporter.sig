signature EXPORTLATEX = sig

    structure DAT : DATATYPES
    type der_tree = DAT.der_tree
    val export_toLatex : string -> der_tree -> unit

end