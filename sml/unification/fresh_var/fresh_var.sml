signature FRESHVAR =
sig
    val get_index : unit -> int
    val change_index : int -> unit
    val fresh : string -> string
end

structure FreshVar =
struct
    val var_index = ref 1;

    fun change_index (x:int): unit = ignore (var_index := x)

    fun get_index ():int = !var_index

    fun fresh'(x:string):string = (x ^"^{"^ (Int.toString(!var_index)) ^"}") before (var_index := !var_index + 1)

    val hat = #"^"

    fun remove_hat' (nil) = nil
        |remove_hat' (x::L) = (case (x=hat) of true => [] | false => x::remove_hat'(L))

    fun remove_hat (x) = String.implode(remove_hat'(String.explode(x)))
    (* nuke version *)
    fun fresh(x:string):string = fresh'(remove_hat(x))
end