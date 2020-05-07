(*  Sequoia  Copyright (C) 2020  Mohammed Hashim
    This program comes with ABSOLUTELY NO WARRANTY; for details see LICENSE.
    This is free software, and you are welcome to redistribute it
    under certain conditions; see LICENSE for details.
*)

structure CtxVarConKey : ORD_KEY = 
struct
    structure D = datatypesImpl
    type ord_key = D.ctx_var
    fun compare (D.CtxVar(a,_),D.CtxVar(b,_)) = 
        (case (a,b) of
           (NONE,NONE) => EQUAL
         | (SOME (D.Con a'),SOME (D.Con b')) => String.compare(a',b')
         | (NONE, SOME _) => LESS
         | _ => GREATER )
end