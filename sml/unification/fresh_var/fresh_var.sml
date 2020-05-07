(*  Sequoia  Copyright (C) 2020  Mohammed Hashim
    This program comes with ABSOLUTELY NO WARRANTY; for details see LICENSE.
    This is free software, and you are welcome to redistribute it
    under certain conditions; see LICENSE for details.
*)


signature FRESHVAR =
sig
    val get_index : unit -> int
    val change_index : int -> unit
    val fresh : string -> string
end

structure FreshVar =
struct
    structure Map = BinaryMapFn(StringKey)
    
    val var_index = ref 1;

    val map: int Map.map ref = ref (Map.empty)


    fun change_index (x:int): unit = (var_index := x) before (map := Map.empty)

    fun get_index ():int =
        let
            val inds = Map.listItems(!map)
        in
            List.foldr Int.max 0 inds
        end

    fun add_index (x:string,i:int):string = (x ^"^{"^ Int.toString(i) ^"}") 

    fun fresh'(x:string):string = 
        let
            val ind = (case Map.find(!map,x) of
               NONE => !var_index
             | SOME index => index)
            val new_string = add_index(x,ind)
            val () = map:= ( Map.insert(!map,x,ind+1) )
        in
            new_string
        end

    val hat = #"^"

    fun remove_hat' (nil) = nil
        |remove_hat' (x::L) = (case (x=hat) of true => [] | false => x::remove_hat'(L))

    fun remove_hat (x) = String.implode(remove_hat'(String.explode(x)))
    (* nuke version *)
    fun fresh(x:string):string = fresh'(remove_hat(x))
end