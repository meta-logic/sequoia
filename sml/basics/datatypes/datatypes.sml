(*  Sequoia  Copyright (C) 2020  Zan Naeem, Mohammed Hashim
    This program comes with ABSOLUTELY NO WARRANTY; for details see LICENSE.
    This is free software, and you are welcome to redistribute it
    under certain conditions; see LICENSE for details.
*)

structure datatypesImpl : DATATYPES = struct
    structure H = helpersImpl

    datatype conn = Con of string
    fun conn_toString(Con(a)) = a

    fun conn_stringify(Con(a)) = "Con(\""^a^"\")"

    fun conn_eq (Con(a), Con(b)) = a=b


    datatype form = Atom of string | AtomVar of string | FormVar of string | Form of conn * form list
    fun form_toString (Atom (s)) = s 
        | form_toString (AtomVar (s)) = s 
        | form_toString (FormVar (s)) = s
        | form_toString (Form (Con (c), fl)) = subforms_toString(c, fl)
    and subforms_toString (c, nil) = ""
        | subforms_toString (c, [x]) = (case x of 
            Form (Con (cn), fl) => c ^ "(" ^ form_toString(x) ^ ")"
            | _ => c ^ " " ^ form_toString(x))
        | subforms_toString (c, [x,y]) = (case x of
            Form (Con (cn), fl) => (case y of
                Form (Con (cn), fl) =>  "(" ^ form_toString(x) ^ ") " ^ c ^ " (" ^ form_toString(y) ^ ")"
                | _ => "(" ^ form_toString(x) ^ ") " ^ c ^ " " ^ form_toString(y))
            | _ => (case y of
                Form (Con (cn), fl) => form_toString(x) ^ " " ^ c ^ " (" ^ form_toString(y) ^ ")"
                | _ => form_toString(x) ^ " " ^ c ^ " " ^ form_toString(y)))
        | subforms_toString (c, l) = c ^ (ListFormat.fmt {init = "(", sep = ",", final = ")", fmt = form_toString} l)
    

    fun form_stringify (Atom (s)) = "Atom (\""^s^"\")"
        | form_stringify (AtomVar (s)) = "AtomVar (\""^s^"\")"
        | form_stringify (FormVar (s)) = "FormVar (\""^s^"\")"
        | form_stringify (Form (c, fl)) = 
            "Form ("^conn_stringify(c)^", ["^(String.concatWith (",") (List.map(form_stringify)fl))^"])"

    fun form_eq (Atom(a), Atom(b)) = a=b
        | form_eq (AtomVar(a), AtomVar(b)) = a=b
        | form_eq (FormVar(a), FormVar(b)) = a=b
        | form_eq (Form(c1, l1), Form(c2, l2)) = conn_eq(c1,c2) andalso subforms_eq(l1,l2)
        | form_eq (_, _) = false
    and subforms_eq (nil, nil) = true
        | subforms_eq (x::l1, y::l2) = form_eq(x,y) andalso subforms_eq(l1,l2)
        | subforms_eq (_, _) = false
    fun form_alpha_eq (Atom(a), Atom(b)) = true
        | form_alpha_eq (AtomVar(a), AtomVar(b)) = true
        | form_alpha_eq (FormVar(a), FormVar(b)) = true
        | form_alpha_eq (Form(c1, l1), Form(c2, l2)) = conn_eq(c1,c2) andalso subforms_alpha_eq(l1,l2)
        | form_alpha_eq (_, _) = false
    and subforms_alpha_eq (nil, nil) = true
        | subforms_alpha_eq (x::l1, y::l2) = form_alpha_eq(x,y) andalso subforms_alpha_eq(l1,l2)
        | subforms_alpha_eq (_, _) = false
    fun form_larger (Form(c1, l1), Atom(b)) = true
        | form_larger (Form(c1, l1), AtomVar(b)) = true
        | form_larger (Form(c1, l1), FormVar(b)) = true
        | form_larger (Form(c1, l1), Form(c2, l2)) = conn_eq(c1,c2) andalso 
            let val (boolean1, boolean2) = 
                List.foldl(fn ((f1,f2), (bl1, bl2)) => 
                    if form_alpha_eq(f1,f2) then (bl1,bl2 andalso true)
                    else if form_larger(f1,f2) then (bl1 andalso true, bl2 andalso true)
                    else (false, false))
                (false,false)(ListPair.zip(l1,l2))
            in boolean1 andalso boolean2 end
        | form_larger (_, _) = false
    fun formL_toString (nil) = ""
        | formL_toString ([x]) = form_toString(x)
        | formL_toString (x::l) = form_toString(x) ^ ", " ^ formL_toString(l)

    fun form_update f form = f(form)



    datatype ctx_var = CtxVar of conn option * string
    fun ctx_var_toString (CtxVar(NONE, s)) = s
        | ctx_var_toString (CtxVar(SOME(c), s)) = conn_toString(c) ^ " " ^ s

    fun ctx_var_stringify (CtxVar(NONE, s)) = "CtxVar(NONE,\""^s^"\")"
        | ctx_var_stringify (CtxVar(SOME(c), s)) = "CtxVar(SOME("^conn_stringify(c)^"),\""^s^"\")"

    fun ctx_var_eq (CtxVar(NONE,a), CtxVar(NONE,b)) = a=b
        | ctx_var_eq (CtxVar(SOME(c1),a), CtxVar(SOME(c2),b)) = a=b andalso conn_eq (c1, c2)
        | ctx_var_eq (_,_) = false
    fun ctx_varL_toString (nil) = ""
        | ctx_varL_toString ([x]) = ctx_var_toString(x)
        | ctx_varL_toString (x::l) = ctx_var_toString(x) ^ ", " ^ ctx_varL_toString (l)
    
    fun ctx_var_update f cv = f(cv)
    
    fun const_toString (_,[],[]) = ""
        | const_toString (_,y,[]) = ctx_varL_toString y ^" = "^ "\\emptyset"
        | const_toString (_,[],z) = ctx_varL_toString z ^" = "^ "\\emptyset"
        | const_toString (_,y,z) = ctx_varL_toString y ^" = "^ ctx_varL_toString z

    fun const_stringify (x,y,z) = 
        "("^ctx_var_stringify x^",["^(String.concatWith (",") (List.map(ctx_var_stringify)y))^"],["^(String.concatWith (",") (List.map(ctx_var_stringify)z))^"])"

    datatype ctx = Ctx of ctx_var list * form list
    fun ctx_toString (Ctx([],[])) = ""
        | ctx_toString (Ctx([],fl)) = formL_toString(fl)
        | ctx_toString (Ctx(vl,[])) = ctx_varL_toString(vl)
        | ctx_toString (Ctx(vl,fl)) = ctx_varL_toString(vl) ^ ", " ^ formL_toString(fl)

    fun ctx_stringify (Ctx(vl,fl)) = 
        "Ctx(["^(String.concatWith (",") (List.map(ctx_var_stringify)vl))^"]"
        ^", ["^(String.concatWith (",") (List.map(form_stringify)fl))^"])"

    fun ctx_eq (Ctx(vl1,fl1), Ctx(vl2,fl2)) = H.mset_eq(vl1,vl2,ctx_var_eq) andalso H.mset_eq(fl1,fl2,form_eq)
    fun ctx_alpha_eq (Ctx(vl1,fl1), Ctx(vl2,fl2)) = H.mset_eq(fl1,fl2,form_eq)

    fun ctx_update (f_ctxvars,f_forms) (Ctx(cvl,fl)) = 
    Ctx(List.map (ctx_var_update f_ctxvars) cvl,
          List.map (form_update f_forms) fl)

    datatype ctx_struct = Empty | Single of ctx | Mult of conn * ctx * ctx_struct
    fun ctx_struct_toString (Empty) = ""
        | ctx_struct_toString (Single ctx) = ctx_toString(ctx)
        | ctx_struct_toString (Mult (Con (c), ctx, rest)) = 
            ctx_toString(ctx) ^ " " ^ c ^ " " ^ ctx_struct_toString(rest)

    fun ctx_struct_stringify (Empty) = "Empty"
        | ctx_struct_stringify (Single ctx) = "Single("^ctx_stringify(ctx)^")"
        | ctx_struct_stringify (Mult (c, ctx, rest)) = 
            "Mult("^conn_stringify(c)^", "^ctx_stringify(ctx)^","^ctx_struct_stringify(rest)^")"

    fun ctx_struct_eq (Empty, Empty) = true
        | ctx_struct_eq (Single(ctx1), Single(ctx2)) = ctx_eq(ctx1, ctx2)
        | ctx_struct_eq (Mult(c1,ctx1,rest1), Mult(c2,ctx2,rest2)) = 
            conn_eq(c1,c2) andalso ctx_eq(ctx1, ctx2) andalso ctx_struct_eq(rest1,rest2)
        | ctx_struct_eq (_, _) = false
    fun ctx_struct_alpha_eq (Empty, Empty) = true
        | ctx_struct_alpha_eq (Single(ctx1), Single(ctx2)) = ctx_alpha_eq(ctx1, ctx2)
        | ctx_struct_alpha_eq (Mult(c1,ctx1,rest1), Mult(c2,ctx2,rest2)) = 
            conn_eq(c1,c2) andalso ctx_alpha_eq(ctx1, ctx2) andalso ctx_struct_alpha_eq(rest1,rest2)
        | ctx_struct_alpha_eq (_, _) = false

    fun ctx_struct_update f (Empty) = Empty
        | ctx_struct_update f (Single(ctx)) = Single(ctx_update f ctx)
        | ctx_struct_update f (Mult(con,ctx,ctx_struct)) = 
            Mult(con,ctx_update f ctx,ctx_struct_update f ctx_struct)

    datatype seq = Seq of ctx_struct * conn * ctx_struct
    fun seq_toString (Seq(ctx1, Con (c), ctx2)) = ctx_struct_toString(ctx1) ^ " " ^ c ^ " " ^ ctx_struct_toString(ctx2)

    fun seq_stringify (Seq(ctx1, c, ctx2)) = 
        "Seq("^ctx_struct_stringify(ctx1)^","^conn_stringify(c)^","^ctx_struct_stringify(ctx2)^")"

    fun seq_eq (Seq(ctxL1,conn1,ctxR1), Seq(ctxL2,conn2,ctxR2)) = 
        conn_eq(conn1, conn2) andalso ctx_struct_eq(ctxL1, ctxL2) andalso ctx_struct_eq(ctxR1, ctxR2)
    fun seq_alpha_eq (Seq(ctxL1,conn1,ctxR1), Seq(ctxL2,conn2,ctxR2)) = 
        conn_eq(conn1, conn2) andalso ctx_struct_alpha_eq(ctxL1, ctxL2) andalso ctx_struct_alpha_eq(ctxR1, ctxR2)

    fun seq_update f (Seq(l,con,r)) = Seq(ctx_struct_update f l,con, ctx_struct_update f r) 

    datatype side = Left | Right | None
    datatype rule = Rule of string * side * seq * seq list
    fun rule_eq(Rule(name1, Left, sq1, pq1), Rule(name2, Left, sq2, pq2)) = 
        name1 = name2 andalso seq_eq(sq1,sq2) andalso 
        List.all(fn (a,b) => seq_eq(a,b))(ListPair.zip(pq1,pq2))
        | rule_eq(Rule(name1, Right, sq1, pq1), Rule(name2, Right, sq2, pq2)) = 
        name1 = name2 andalso seq_eq(sq1,sq2) andalso 
        List.all(fn (a,b) => seq_eq(a,b))(ListPair.zip(pq1,pq2))
        | rule_eq(Rule(name1, None, sq1, []), Rule(name2, None, sq2, [])) =
        name1 = name2 andalso seq_eq(sq1,sq2)


    datatype sub = Fs of form * form | CTXs of ctx_var * ctx 
    fun sub_eq (Fs(a1,b1), Fs(a2,b2)) = form_eq(a1,a2) andalso form_eq(b1,b2)
        | sub_eq (CTXs(a1,b1), CTXs(a2,b2)) = ctx_var_eq(a1,a2) andalso ctx_eq(b1,b2) 
        | sub_eq (_, _) = false
    fun sub_prefix_eq (Fs(a,_), Fs(b,_)) = form_eq(a,b)
        | sub_prefix_eq (CTXs(a,_), CTXs(b,_)) = ctx_var_eq(a,b)
        | sub_prefix_eq (_, _) = false

    type rule_name = string option
    datatype der_tree = DerTree of string * seq * rule_name * der_tree list

end