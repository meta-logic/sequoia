signature EXPORTHTML = sig

    structure Dat : DATATYPES
    type der_tree = Dat.der_tree

    val der_tree_toHtml : der_tree -> string

    val der_tree_toHtml2 : der_tree -> string

end
