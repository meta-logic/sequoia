structure datatypesImpl : DATATYPES = struct
    structure H = helpersImpl

    datatype conn = Con of string
    fun conn_toString(Con(a)) = a
    fun conn_eq (Con(a), Con(b)) = a=b


    datatype form = Atom of string | AtomVar of string | FormVar of string | Form of conn * form list
    fun form_toString (Atom (s)) = s 
        | form_toString (AtomVar(s)) = s 
        | form_toString (FormVar (s)) = s
        | form_toString (Form (Con (c), fl)) = subforms_toString(c, fl)
    and subforms_toString (c, nil) = ""
        | subforms_toString (c, [x]) = (case x of 
            Form (Con (cn), fl) => c ^ "(" ^ form_toString(x) ^ ")"
            | _ => c ^ form_toString(x))
        | subforms_toString (c, [x,y]) = (case x of
            Form (Con (cn), fl) => (case y of
                Form (Con (cn), fl) =>  "(" ^ form_toString(x) ^ ") " ^ c ^ " (" ^ form_toString(y) ^ ")"
                | _ => "(" ^ form_toString(x) ^ ") " ^ c ^ " " ^ form_toString(y))
            | _ => (case y of
                Form (Con (cn), fl) => form_toString(x) ^ " " ^ c ^ " (" ^ form_toString(y) ^ ")"
                | _ => form_toString(x) ^ " " ^ c ^ " " ^ form_toString(y)))
        | subforms_toString (c, x::l) = (case x of
            Form (Con (cn), fl) => "(" ^ form_toString(x) ^ ") " ^ c ^ " " ^ subforms_toString(c, l)
            | _ => form_toString(x) ^ " " ^ c ^ " " ^ subforms_toString(c, l))
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


    datatype ctx_var = CtxVar of string
    fun ctx_var_toString (CtxVar(s)) = s
    fun ctx_var_eq (CtxVar(a), CtxVar(b)) = a=b
    fun ctx_varL_toString (nil) = ""
        | ctx_varL_toString ([x]) = ctx_var_toString(x)
        | ctx_varL_toString (x::l) = ctx_var_toString(x) ^ ", " ^ ctx_varL_toString (l)
    fun const_toString (_,[],[]) = ""
        | const_toString (_,y,[]) = ctx_varL_toString y ^" = "^ "EMPTY"
        | const_toString (_,[],z) = ctx_varL_toString z ^" = "^ "EMPTY"
        | const_toString (_,y,z) = ctx_varL_toString y ^" = "^ ctx_varL_toString z

    datatype ctx = Ctx of ctx_var list * form list
    fun ctx_toString (Ctx([],[])) = ""
        | ctx_toString (Ctx([],fl)) = formL_toString(fl)
        | ctx_toString (Ctx(vl,[])) = ctx_varL_toString(vl)
        | ctx_toString (Ctx(vl,fl)) = ctx_varL_toString(vl) ^ ", " ^ formL_toString(fl)
    fun ctx_eq (Ctx(vl1,fl1), Ctx(vl2,fl2)) = H.mset_eq(vl1,vl2,ctx_var_eq) andalso H.mset_eq(fl1,fl2,form_eq)
    fun ctx_alpha_eq (Ctx(vl1,fl1), Ctx(vl2,fl2)) = H.mset_eq(fl1,fl2,form_eq)


    datatype ctx_struct = Empty | Single of ctx | Mult of conn * ctx * ctx_struct
    fun ctx_struct_toString (Empty) = ""
        | ctx_struct_toString (Single ctx) = ctx_toString(ctx)
        | ctx_struct_toString (Mult (Con (c), ctx, rest)) = 
            ctx_toString(ctx) ^ " " ^ c ^ " " ^ ctx_struct_toString(rest)
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

    datatype seq = Seq of ctx_struct * conn * ctx_struct
    fun seq_toString (Seq(ctx1, Con (c), ctx2)) = ctx_struct_toString(ctx1) ^ " " ^ c ^ " " ^ ctx_struct_toString(ctx2)
    fun seq_eq (Seq(ctxL1,conn1,ctxR1), Seq(ctxL2,conn2,ctxR2)) = 
        conn_eq(conn1, conn2) andalso ctx_struct_eq(ctxL1, ctxL2) andalso ctx_struct_eq(ctxR1, ctxR2)
    fun seq_alpha_eq (Seq(ctxL1,conn1,ctxR1), Seq(ctxL2,conn2,ctxR2)) = 
        conn_eq(conn1, conn2) andalso ctx_struct_alpha_eq(ctxL1, ctxL2) andalso ctx_struct_alpha_eq(ctxR1, ctxR2)

    datatype side = Left | Right | None | Cut
    datatype rule = Rule of string * side * seq * seq list
    fun rule_eq(Rule(name1, Left, sq1, pq1), Rule(name2, Left, sq2, pq2)) = 
        name1 = name2 andalso seq_eq(sq1,sq2) andalso 
        List.all(fn (a,b) => seq_eq(a,b))(ListPair.zip(pq1,pq2))
        | rule_eq(Rule(name1, Right, sq1, pq1), Rule(name2, Right, sq2, pq2)) = 
        name1 = name2 andalso seq_eq(sq1,sq2) andalso 
        List.all(fn (a,b) => seq_eq(a,b))(ListPair.zip(pq1,pq2))
        | rule_eq(Rule(name1, None, sq1, []), Rule(name2, None, sq2, [])) =
        name1 = name2 andalso seq_eq(sq1,sq2)
        | rule_eq(Rule(name1, Cut, sq1, []), Rule(name2, Cut, sq2, [])) =
        name1 = name2 andalso seq_eq(sq1,sq2)
        | rule_eq(_, _) = false


    datatype sub = Fs of form * form | CTXs of ctx_var * ctx | CVs of ctx_var * ctx_var
    fun sub_eq (Fs(a1,b1), Fs(a2,b2)) = form_eq(a1,a2) andalso form_eq(b1,b2)
        | sub_eq (CTXs(a1,b1), CTXs(a2,b2)) = ctx_var_eq(a1,a2) andalso ctx_eq(b1,b2) 
        | sub_eq (_, _) = false
    fun sub_prefix_eq (Fs(a,_), Fs(b,_)) = form_eq(a,b)
        | sub_prefix_eq (CTXs(a,_), CTXs(b,_)) = ctx_var_eq(a,b)
        | sub_prefix_eq (_, _) = false

    datatype rule_name = NoRule | RuleName of string
    datatype der_tree = DerTree of string * seq * rule_name * der_tree list

end