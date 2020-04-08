(*  Sequoia  Copyright (C) 2020  Zan Naeem
    This program comes with ABSOLUTELY NO WARRANTY; for details type `show w'.
    This is free software, and you are welcome to redistribute it
    under certain conditions; type `show c' for details.
*)

signature EXPORTHTML = sig

    structure Dat : DATATYPES
    type der_tree = Dat.der_tree

    val der_tree_toHtml : der_tree -> string

    val der_tree_toHtml2 : der_tree -> string

end
