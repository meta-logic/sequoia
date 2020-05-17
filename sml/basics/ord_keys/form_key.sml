(*  Sequoia  Copyright (C) 2020  Mohammed Hashim
    This program comes with ABSOLUTELY NO WARRANTY; for details see LICENSE.
    This is free software, and you are welcome to redistribute it
    under certain conditions; see LICENSE for details.
*)

(*order: Atom, AtomVar, FormVar, Form (connective then formulas)*)

structure FormKey : ORD_KEY = 
struct
    structure Dat = datatypesImpl
    type ord_key = Dat.form
    val cmp = String.compare
    fun compare (A,B) = 
        (case (A,B) of
          (Dat.Atom(a),Dat.Atom(b))=> cmp(a,b) 
        | (Dat.AtomVar(a),Dat.AtomVar(b))=> cmp(a,b)
        | (Dat.FormVar(a),Dat.FormVar(b))=> cmp(a,b)
        | (Dat.Form(Dat.Con(c1),fl1),Dat.Form(Dat.Con(c2),fl2)) => 
            (case cmp(c1,c2) of
                EQUAL => compare_form_list(fl1,fl2)
                | res => res
            ) 
        | (Dat.Atom(_),_) => LESS
        | (_, Dat.Atom(_)) => GREATER
        | (Dat.AtomVar(_),_) => LESS
        | (_,Dat.AtomVar(_)) => GREATER
        | (Dat.FormVar(_),_) => LESS
        | (_,Dat.FormVar(_)) => GREATER
        )
    and compare_form_list (l1,l2) =
        (case (l1,l2) of
          ([],[]) => EQUAL
        | ([],_) => LESS
        | (_,[]) => GREATER
        | (a::l1',b::l2') => 
            (case compare(a,b) of
                  EQUAL => compare_form_list(l1',l2')
                | res => res)
        )
end
