signature EXPORTHTML = sig

    structure Dat : DATATYPES
    type der_tree = Dat.der_tree

    val der_tree_toLatex : der_tree -> string

    val der_tree_toLatex2 : der_tree -> string

    val export_string_toLatex : string -> string -> unit

    val export_toLatex : string -> der_tree -> unit

end
