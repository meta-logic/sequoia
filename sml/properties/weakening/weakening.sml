(*  Sequoia  Copyright (C) 2020  Zan Naeem, Mohammed Hashim
    This program comes with ABSOLUTELY NO WARRANTY; for details see LICENSE.
    This is free software, and you are welcome to redistribute it
    under certain conditions; see LICENSE for details.
*)

structure Weakening = 
struct
    structure Dat = datatypesImpl
    structure T = treefuncImpl
    structure Latex = latexImpl
    structure Ut = Utilities

    fun weakening_rule_context (rule: (Dat.rule) , (side,context_num) : Dat.side * int) = 
        let
            val _ = Ut.set_to_1()
            val res = false
            val weak_form = Dat.Atom (Ut.set_color("W^*"))

            fun add_to_ctx(Dat.Empty,1) = Dat.Empty
                | add_to_ctx(Dat.Single(Dat.Ctx(vars,forms)),1) = Dat.Single(Dat.Ctx(vars,weak_form::forms))
                | add_to_ctx(Dat.Mult(con,ctx as Dat.Ctx(vars,forms),rest),index) = 
                    (case Int.compare(index,1) of
                        EQUAL => Dat.Mult(con,Dat.Ctx(vars,weak_form::forms),rest)
                        | GREATER => Dat.Mult(con,ctx,add_to_ctx(rest,index-1))
                        (* if it fails, then changing nothing would still cause it to return false *)
                        | LESS => Dat.Mult(con,ctx,rest))
                | add_to_ctx (a,_) = a

            fun add_to_seq (s as Dat.Seq(L,con,R)) = 
                (case side of
                   Dat.Left => Dat.Seq(add_to_ctx(L,context_num),con,R)
                 | Dat.Right => Dat.Seq(L,con,add_to_ctx(R,context_num))
                 | _ => s)

            fun make_weak_bool (side,context_num) = 
                let
                    
                    fun add_false (1,list) = list
                        | add_false (n , list) = (case Int.compare(n,1) of GREATER => add_false(n-1,false::list) | _ => [])
                    val res = add_false(context_num,[true]) 
                in
                    (case side of Dat.Right => ([],res) | Dat.Left => (res,[]) | _ => ([],[]))
                end


            
            val Dat.Rule(_,_,base,_) = rule
            val base = Ut.atomize_seq(base)
            val base = Ut.generic_ctx_var(base)
            val rule = Ut.update_rule(rule,fn x => x)
            val base2 = Ut.generic_ctx_var(add_to_seq(base))
            val rule_applied_list = List.map (fn (_,cons,tree) => (cons,tree)) (T.apply_rule(([],[],Dat.DerTree("0",base,NONE,[])),rule,"0"))
            val rule_applied_list_weak = List.map (fn (_,cons,tree) => (cons,tree)) (T.apply_rule(([],[],Dat.DerTree("0",base2,NONE,[])),rule,"0"))

            val rule_applied_list = List.map (fn tree => Ut.rename_ids(tree)) rule_applied_list

            val res2 = List.map (fn (t1) => (t1,List.mapPartial (fn (t2) => 
            Ut.check_premises'(t1,t2,make_weak_bool(side,context_num)) )
             rule_applied_list_weak ) ) rule_applied_list
            


            val res2 = List.map (fn (t1,[]) => (t1,NONE) | (t1,x::_) => (t1,SOME x)) res2

            val res = List.all (fn (_,r) => Option.isSome(r)) res2

            (* val res2 = if res then res2 else List.filter (fn (_,r) => false = Option.isSome(r)) res2 *)
            val _ = Ut.reset()
        in
          (res,res2)
        end

    
    fun weakening_context (rules,ctx) = 
        let
            val tests = List.map (fn rule => weakening_rule_context(rule,ctx)) rules
            val (bools,proofs) = ListPair.unzip tests
            val res = List.all (fn x => x) bools
            val res2 = List.concat proofs
        in
            (res,res2)
        end

    fun count_contexts (ctx_struct,index) = 
        (case ctx_struct of
           Dat.Mult(_,_,rest) => count_contexts(rest,index+1)
         | _ => index)

    fun weakening_proofs ([]) = ([],[])
        | weakening_proofs (rules as Dat.Rule(_,_,conc,_)::_) = 
        let
            val Dat.Seq(L,_,R) = conc
            val (l_num,r_num) = (count_contexts(L,1), count_contexts (R,1))
            val (l_ctx,r_ctx) = (List.tabulate (l_num,fn i => (Dat.Left,i+1)) , List.tabulate (r_num,fn i => (Dat.Right,i+1)) )
            fun test x = weakening_context(rules,x) 
        in
            (List.map test l_ctx, List.map test r_ctx)
        end
    
    fun weakening (rules) = 
        let
            val (left,right) = weakening_proofs(rules)
            val res_map = List.map (fn (bool,_) => bool)
        in
            (res_map left, res_map right)
        end


    fun weakening_print rules = 
        let 
            val print_helper = Ut.print_helper
        in
            let val (L,R) = weakening_proofs(rules)
                val tL = List.map(fn (bl,pfs) => if bl 
                        then "T###"^(List.foldr (fn (a,b) => print_helper(a)^"&&&"^b) "" pfs)
                        else "F###"^(List.foldr (fn (a,b) => print_helper(a)^"&&&"^b) "" pfs)) L
                val tR = List.map(fn (bl,pfs) => if bl 
                        then "T###"^(List.foldr (fn (a,b) => print_helper(a)^"&&&"^b) "" pfs)
                        else "F###"^(List.foldr (fn (a,b) => print_helper(a)^"&&&"^b) "" pfs)) R
                val bool = if (List.all (fn ((bl,pfs)) => bl) L) andalso (List.all (fn ((bl,pfs)) => bl) R)
                        then "T" else "F"
                val pL = List.foldr (fn (a,b) => a^"@@@"^b) "" tL
                val pR = List.foldr (fn (a,b) => a^"@@@"^b) "" tR
                val pLR = bool ^ "%%%" ^ pL ^ "%%%" ^ pR
            in Ut.writeFD 3 pLR end
        end


end
