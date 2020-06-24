(*  Sequoia  Copyright (C) 2020  Zan Naeem, Mohammed Hashim
    This program comes with ABSOLUTELY NO WARRANTY; for details see LICENSE.
    This is free software, and you are welcome to redistribute it
    under certain conditions; see LICENSE for details.
*)



structure Utilities =
struct
    structure D = datatypesImpl
    structure Dat = D
    structure H = helpersImpl
    structure T = treefuncImpl
    structure Latex = latexImpl
    structure App = applyunifierImpl
    structure C = Constraints
    structure U = unifyImpl
    structure E = Equivalence
    structure Set = SplaySetFn(CtxVarKey);
    structure FSet = SplaySetFn(FormKey);
    val index = ref 1;

    val ind = ref 1;

    fun set_to_1 () = (ind := U.get_index();U.change_index(1))
    fun reset () = (U.change_index(!ind))
    

    type constraint = D.ctx_var * (D.ctx_var list) * (D.ctx_var list)
    type tree = constraint list * D.der_tree
	type proof = tree * (tree option)

    exception Arity


    val color2 = "blue"
    val color = "red"
    fun set_color (x) = "\\color{"^color^"} {"^x^"}"
    fun set_color2 (x) = "\\color{"^color2^"} {"^x^"}"


    fun constraintL_toString(l)=
        let
            fun constraint_toString (_,l,r) = (Dat.ctx_varL_toString(l)) ^ "=" ^ (Dat.ctx_varL_toString(r))
            val list_format = ListFormat.fmt {init = "{", sep = "\\\\ ", final = "}" , fmt = constraint_toString}
        in
            list_format l
        end


    fun writeFD fd content = 
        let
            val out = Posix.FileSys.wordToFD (SysWord.fromInt(fd))
            val text = Word8VectorSlice.full (Byte.stringToBytes(content))
            val _ = Posix.IO.writeVec(out,text)
        in () end

    fun generic_seq( D.Seq(a, c, b)) =
        let
            fun gen_out(D.Empty) = D.Empty
                | gen_out(D.Single(D.Ctx(vl,fl))) =
                let val () = () in index := !index + 1;
                D.Single(D.Ctx([D.CtxVar (NONE,"\\Gamma_{" ^ Int.toString(!index)^"}")],nil)) end
                | gen_out(D.Mult(con,D.Ctx(vl,fl),rest)) =
                let val () = () in index := !index + 1;
                D.Mult(con,D.Ctx([D.CtxVar (NONE,"\\Gamma_{" ^ Int.toString(!index)^"}")],nil),gen_out rest) end
        in
            D.Seq(gen_out a, c, gen_out b)
        end

    fun generic_ctx_var( D.Seq(a, c, b)) =
        let
            fun gen_out(D.Empty) = D.Empty
                | gen_out(D.Single(D.Ctx(vl,fl))) =
                let val () = () in index := !index + 1;
                D.Single(D.Ctx([D.CtxVar (NONE,"\\Gamma_{" ^ Int.toString(!index)^"}")],fl)) end
                | gen_out(D.Mult(con,D.Ctx(vl,fl),rest)) =
                let val () = () in index := !index + 1;
                D.Mult(con,D.Ctx([D.CtxVar (NONE,"\\Gamma_{" ^ Int.toString(!index)^"}")],fl),gen_out rest) end
        in
            D.Seq(gen_out a, c, gen_out b)
        end


    fun set_u_index(x) = index := x

    fun fresh'(x:string):string = (x ^"^{"^ (Int.toString(!index)) ^"}")

    val hat = #"^"

    fun remove_hat' (nil) = nil
        |remove_hat' (x::L) = if (x=hat) then [] else x::remove_hat'(L)

    fun remove_hat (x) = String.implode(remove_hat'(String.explode(x)))
    (* nuke version *)
    fun fresh(x:string):string = fresh'(remove_hat(x))

    val string_to_fresh = fresh

    

    fun ctx_var_to_fresh(D.CtxVar(a,x)) = D.CtxVar(a,string_to_fresh(x)) before (index := !index + 1)

    

    

    fun ctx_to_fresh(D.Ctx(ctx_vars,forms)) = D.Ctx(List.map ctx_var_to_fresh ctx_vars,forms)

    fun ctx_struct_to_fresh(D.Empty) = D.Empty
        | ctx_struct_to_fresh (D.Single (ctx)) = D.Single(ctx_to_fresh(ctx))
        | ctx_struct_to_fresh (D.Mult (con,ctx,ctx_struct)) = D.Mult(con,ctx_to_fresh(ctx),ctx_struct_to_fresh(ctx_struct))

    fun seq_to_fresh(D.Seq(ctx_s,con,ctx_s2)) = D.Seq(ctx_struct_to_fresh(ctx_s),con,ctx_struct_to_fresh(ctx_s2))

    

    fun print_seq_list (nil) = print "\n_______________________________\n"
        | print_seq_list (x::L) = let
            val _ = print (D.seq_toString(x)^"\n")
        in
            print_seq_list(L)
        end

    fun get_ctx_var_ctx (D.Ctx(A,_)) = A

    fun get_ctx_var_ctx_struct (D.Empty) = []
        | get_ctx_var_ctx_struct (D.Single (ctx)) = get_ctx_var_ctx ctx
        | get_ctx_var_ctx_struct (D.Mult (_,ctx,ctx_struct)) = get_ctx_var_ctx(ctx)@get_ctx_var_ctx_struct(ctx_struct)

    fun get_ctx_var_seq ( D.Seq(A,_,B)) = get_ctx_var_ctx_struct(A)@get_ctx_var_ctx_struct(B)

    fun get_ctx_vars_der_tree (D.DerTree(_,S,_,L)) = get_ctx_var_seq(S)@get_ctx_vars_der_tree_list(L)
    and get_ctx_vars_der_tree_list ([]) = []
        |get_ctx_vars_der_tree_list (D::L) = get_ctx_vars_der_tree(D)@get_ctx_vars_der_tree_list(L)

    fun get_ctx_vars_from_constraint((_,A,B)) = A@B

    fun get_ctx_vars_from_constraints(nil) = []
        |get_ctx_vars_from_constraints(x::L) = get_ctx_vars_from_constraint(x)@get_ctx_vars_from_constraints(L)

    fun generate_leaf_name (name_ref) = ("\\mathcal{"^(Char.toString(!name_ref))^"}") before (name_ref := Char.succ(!name_ref))

    fun rename_ids_h (D.DerTree(id,seq,rule,prems),name_ref) = 
        (case List.length(prems) of
           0 => D.DerTree (generate_leaf_name(name_ref),seq,rule,prems)
         | _ => D.DerTree (id,seq,rule, List.map (fn prem => rename_ids_h (prem,name_ref)) prems))

    fun rename_ids (cons,dvt) = (cons,rename_ids_h(dvt,ref (#"D")))

    
    fun print_var_list (l) = print ((ListFormat.listToString
      (Dat.ctx_var_toString) l)^"\n")

    fun print_cons (_,l1,l2) = (print "[\n";print_var_list l1;print
      "=\n";print_var_list l2; print "]\n")
    fun print_consL l = (List.app print_cons l; print "_____\n_____\n")

    fun check_premises'((cn1,dvt1),(cn2,dvt2),weak) =
        let
            val D.DerTree(_,sq1,_,_) = dvt1
            val D.DerTree(_,sq2,_,_) = dvt2
            val t1_prems = List.map (fn (D.DerTree(id,seq,_,_)) => (id,seq)) (T.get_open_prems(dvt1))
            
            (*val goal = create_constraint(sq1,sq2)*)
            val constraints = cn1@cn2
            (*val _ = last1 := dvt1*)
            (*val _ = last2 := dvt2*)
           
            val goal_cons = E.extract_constraints(sq1,sq2)
            val constraints = goal_cons@constraints
            val cn1 = goal_cons@cn1


            val t1_vars = (get_ctx_vars_der_tree(dvt1)@get_ctx_vars_from_constraints(cn1))
            val t2_vars = (get_ctx_vars_der_tree(dvt2)@get_ctx_vars_from_constraints(cn2))
            val t1_vars = Set.addList(Set.empty,t1_vars)   
            val t2_vars = Set.addList(Set.empty,t2_vars)
            val t1_vars = Set.difference(t1_vars,t2_vars)
            val t1_vars = Set.listItems t1_vars
            val t2_vars = Set.listItems t2_vars
            (* val _ = print_seq_list(t1_prems)
            val _ = print_seq_list(t2_prems)
            val _ = print ("\n\n\n") *)
           
            val res = E.check_premises_wk(t1_prems,dvt2,constraints,weak,t1_vars,t2_vars)
            (* val _ = if res then print("true\n\n\n\n\n\n\n") else print("false\n\n\n\n\n\n\n") *)
        in
            Option.map (fn x => (cn2,x)) res
        end

    

    fun fresh_tree(tree) = 
        let
            val ctx_vars = get_ctx_vars_der_tree(tree)
            val ctx_vars_no_dup = Set.listItems(Set.addList(Set.empty,ctx_vars))
            val subs = List.map (fn var => Dat.CTXs(var,Dat.Ctx([C.fresh_ctx_var(var)],[]))) ctx_vars_no_dup
        in
            App.apply_der_tree_Unifier(tree,subs)
        end

    (****************************************************)
    fun get_start_char () = ref (#"A",0)

    fun char_succ (x) = 
        (case !x of
            (#"Z",i) => x := (#"A",i+1)
            | (c,i) => x := (Char.succ(c),i))


    fun char_to_string (x) = 
        (case !x of
            (c,0) => Char.toString(c)
           |(c,i) => (Char.toString(c))^"^{"^(Int.toString(i))^"}")

    fun get_char_update_func () = 
        let
            val start = get_start_char()
            fun change_str x = (char_to_string(start)) before (char_succ(start))
        in
            change_str
        end

    fun set_insert(set,form) = set := (FSet.add(!set,form))

    fun form_insert(set,form) =
        (case form of
              Dat.AtomVar(x) => set_insert(set,form)
            | Dat.FormVar(x) => set_insert(set,form)
            | Dat.Form(_,fl) => ignore(List.map (fn form => form_insert(set,form)) fl)
            | _ => ())

    fun form_insert2(set,form) = 
        (case form of
              Dat.Form(_) => form_insert(set,form)
            | _ => ())
 
    fun form_to_sub(form,update) = 
        (case form of
              f as Dat.AtomVar(x) => Dat.Fs(f,Dat.AtomVar(update x))
             | f as Dat.FormVar(x) => Dat.Fs(f,Dat.FormVar(update x))
             | _ => raise Fail "unexpected formula, form_to_sub, utilities"
        )

    fun collect_ctx (Dat.Ctx(_,fl),(set,insert)) = ignore (List.map (fn form =>
      insert(set,form)) fl)

    fun collect_ctx_struct (Dat.Empty,_) = ()
      | collect_ctx_struct (Dat.Single(ctx),f) = collect_ctx(ctx,f)
      | collect_ctx_struct (Dat.Mult(_,ctx,ctx_struct),f) = (collect_ctx(ctx,f))
      before (collect_ctx_struct(ctx_struct,f))

    fun collect(Dat.Seq(l,_,r),f) =
      (collect_ctx_struct(l,f);collect_ctx_struct(r,f))

    fun color_form (Dat.Form(Dat.Con(c),fl),color) = Dat.Form(Dat.Con(color c),fl)
      | color_form (f , _ ) = f

    fun color_ctx (Dat.Ctx(vl,fl),color) = Dat.Ctx(vl,List.map (fn form =>
      color_form(form,color)) fl)

    fun color_ctx_struct (Dat.Empty,_) = Dat.Empty
      | color_ctx_struct (Dat.Single(ctx),color) =
      Dat.Single(color_ctx(ctx,color))
      | color_ctx_struct (Dat.Mult(c,ctx,ctx_struct),color)=
      Dat.Mult (c,color_ctx(ctx,color),color_ctx_struct(ctx_struct,color))

    fun color_seq(Dat.Seq(l,con,r),color) =
      Dat.Seq(color_ctx_struct(l,color),con,color_ctx_struct(r,color))



    fun update_rule(Dat.Rule(nm,side,conc,prems),insert,update) = 
        let
            val set = ref FSet.empty
            val _ = List.map (fn seq => collect(seq,(set,insert))) (conc::prems)
            val vars = FSet.listItems(!set)
            val subs = List.map (fn var => form_to_sub(var,update)) vars
            val new_conc = App.apply_seq_Unifier(conc,subs)
            val new_prems = List.map (fn seq => App.apply_seq_Unifier(seq,subs)) prems
        in
            Dat.Rule(nm,side,new_conc,new_prems)
        end

    fun update_rule_characters(rule, update) = update_rule(rule,form_insert,update)

    fun update_rule_colors(rule,color_fn) = 
        let
            val Dat.Rule(nm,side,conc,prems) = update_rule(rule,form_insert2,color_fn)
            val conc = color_seq(conc,color_fn)
            val prems = List.map (fn seq => color_seq(seq,color_fn)) prems
            val nm = color_fn nm
        in
            Dat.Rule(nm,side,conc,prems)
        end

    (******************************************************)

    fun atomize(Dat.Atom(x)) = Dat.Atom(x)
      | atomize(Dat.AtomVar(x)) = Dat.Atom(x)
      | atomize(Dat.FormVar(x)) = Dat.Atom(x)
      | atomize(Dat.Form(con,forms)) = Dat.Form(con, List.map atomize forms)

    fun atomize_context_struct (Dat.Empty) = Dat.Empty
      | atomize_context_struct (Dat.Single(Dat.Ctx(v,forms))) = Dat.Single(Dat.Ctx(v,List.map atomize forms))
      | atomize_context_struct (Dat.Mult(con,Dat.Ctx(v,forms),ctx_struct)) = Dat.Mult(con,
                                             Dat.Ctx(v,List.map atomize forms)
                                            ,atomize_context_struct(ctx_struct))

    fun atomize_seq (Dat.Seq(A,con,B)) = Dat.Seq(atomize_context_struct(A),con,atomize_context_struct(B))

    fun atomize_rule (Dat.Rule(name,side,conc,prems)) = Dat.Rule(name,side,atomize_seq(conc),List.map atomize_seq prems)


    fun subformula (A, D.Form(_,subforms) ) = List.exists (fn x => D.form_eq(A,x) orelse subformula(A,x)) subforms
        | subformula (_,_) = false

    fun find_arity_ctx (con, Dat.Ctx(_,forms)) = 
        Option.map 
        (fn Dat.Form(_,l) => List.length(l) | _ => raise Fail "find_arity_ctx Option.map")
        (List.find (fn (Dat.Form(c,_)) => Dat.conn_eq(c,con) | _ => false ) forms)

    fun find_arity_ctx_struct (_ , Dat.Empty) = NONE
        | find_arity_ctx_struct (con, Dat.Single (ctx) ) = find_arity_ctx(con,ctx)
        | find_arity_ctx_struct (con, Dat.Mult (_,ctx,rest)) = 
            (case find_arity_ctx(con,ctx) of
               NONE => find_arity_ctx_struct(con,rest)
             | a => a)

    fun find_arity (con: Dat.conn, Dat.Seq(L,_,R): Dat.seq) = case find_arity_ctx_struct(con,L) of
       NONE => find_arity_ctx_struct(con,R)
     | a => a

    fun check_arity_ctx (con,arity,Dat.Ctx(_,forms)) = 
        let
            val relevant = List.mapPartial 
            (fn (Dat.Form(c,l)) => (if Dat.conn_eq(con,c) then SOME(List.length(l)) else NONE) 
            | _ => NONE) forms
        in
            List.all (fn x => arity=x) relevant        
        end

    fun check_arity_ctx_struct (_,_,Dat.Empty) = true
        |check_arity_ctx_struct (con,arity,Dat.Single(ctx)) = check_arity_ctx(con,arity,ctx)
        |check_arity_ctx_struct (con,arity,Dat.Mult(_,ctx,rest)) =
        check_arity_ctx(con,arity,ctx) andalso check_arity_ctx_struct(con,arity,rest)

    fun check_arity(con: Dat.conn, arity: int, Dat.Rule(_,_,Dat.Seq(L,_,R),_)) = 
    check_arity_ctx_struct(con,arity,L) andalso check_arity_ctx_struct(con,arity,R)

    fun print_helper((clist1,tree1),SOME((clist2,tree2))) = 
        "$$"^Latex.der_tree_toLatex2(tree1)^"$$"
        ^"$$"^constraintL_toString(clist1)^"$$"
        ^"$$ \\leadsto $$"
        ^"$$"^Latex.der_tree_toLatex2(tree2)^"$$"
        ^"$$"^constraintL_toString(clist2)^"$$"
    | print_helper((clist1,tree1),NONE) = 
        "$$"^Latex.der_tree_toLatex2(tree1)^"$$"
        ^"$$"^constraintL_toString(clist1)^"$$"


end
