(*  Sequoia  Copyright (C) 2020  Mohammed Hashim
    This program comes with ABSOLUTELY NO WARRANTY; for details type `show w'.
    This is free software, and you are welcome to redistribute it
    under certain conditions; type `show c' for details.
*)

signature HELPERS = sig

    val remove : 'a * 'a list * ('a * 'a -> bool) -> 'a list
    val mset_eq : 'a list * 'a list * ('a * 'a -> bool) -> bool
    val mset_subset : 'a list * 'a list * ('a * 'a -> bool) -> bool
    val chooseK : 'a list * int * ('a * 'a -> bool) -> ('a list * 'a list) list
    val chooseDP : 'a list * int -> 'a list list
    val permutations : 'a list -> 'a list list
    val distribute : 'a list list * 'a -> 'a list list list
    val partition_into : int * 'a list -> 'a list list list
    val remove_similar : 'a list * 'a list * ('a * 'a -> bool) -> ('a list * 'a list)
    val remove_duplicates : ('a list * 'b) list * ('a * 'a -> bool) -> ('a list * 'b) list

end
