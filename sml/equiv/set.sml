(*  Sequoia  Copyright (C) 2020  Mohammed Hashim
    This program comes with ABSOLUTELY NO WARRANTY; for details type `show w'.
    This is free software, and you are welcome to redistribute it
    under certain conditions; type `show c' for details.
*)

structure StringKey:ORD_KEY = 
struct
	type ord_key = string
	val compare = String.compare
end