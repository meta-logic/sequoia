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

structure CtxVarKey : ORD_KEY = 
struct
    structure D = datatypesImpl
    type ord_key = D.ctx_var
    fun compare_con (D.CtxVar(a,_),D.CtxVar(b,_)) = 
        (case (a,b) of
           (NONE,NONE) => EQUAL
         | (SOME (D.Con a'),SOME (D.Con b')) => String.compare(a',b')
         | (NONE, SOME _) => LESS
         | _ => GREATER )
    fun compare (a as D.CtxVar(_,na),b as D.CtxVar(_,nb)) = 
        (case compare_con(a,b) of
           LESS => LESS
         | GREATER => GREATER
         | _ => String.compare(na,nb))
end

structure Constraints : CONSTRAINTS =
struct
    structure Dat = datatypesImpl
    structure F = FreshVar
    structure H = helpersImpl
    structure Map = BinaryMapFn (CtxVarConKey)
    structure Map2 = BinaryMapFn (CtxVarKey)
    structure Set = SplaySetFn(CtxVarKey)
    structure App =applyunifierImpl

    exception NotFound = LibBase.NotFound

    type constraint = (Dat.ctx_var * Dat.ctx_var list * Dat.ctx_var list)
    type constraint' = (Dat.ctx_var * Dat.ctx_var ref list * Dat.ctx_var ref list)

    val get_index = F.get_index
    val change_index = F.change_index
    val fresh = F.fresh

    fun fresh_ctx_var (Dat.CtxVar(a,name)) = Dat.CtxVar(a,fresh(name))

    val no_con = Dat.CtxVar (NONE,"")

    fun get_con (Dat.CtxVar(a,_)) = a

    fun my_insert (var,map) = 
        let
            val res = Map.find(map,var)
        in
            (case res of
               SOME (a,b,c) => Map.insert (map,var,(a,var::b,c))
             | NONE => let val new = fresh_ctx_var(var) in 
             Map.insert(map,var,(new,[var],[])) end)
        end
    
    fun initial_set' (var_list) = List.foldr my_insert Map.empty var_list

    (* combines several variables with the same connective *)
    fun initial_set (var_list:Dat.ctx_var list): (constraint Map.map) = 
        let
            val set = initial_set'(var_list)
        in
            set
        end
        
    fun remove_common(var_l1,var_l2) = H.remove_similar(var_l1,var_l2,Dat.ctx_var_eq)

    fun empty_sub(var) = Dat.CTXs(var,Dat.Ctx([],[]))

    fun create_empty_subs (_,l1,_) = List.map empty_sub l1

    
    fun gen_constraints((var,left,_),(cons,l2)) = 
        (case get_con var of
           NONE => (
                let
                    val new_l2 = Map.map (fn (var,a,b) => (var,a,fresh_ctx_var(var)::b)) l2
                    val new_vars = List.map (fn (var,a,b) => List.hd(b)) (Map.listItems new_l2)
                    val new_cons = (var,left,new_vars)
                in
                    (new_cons::cons,new_l2)
                end
           )
         | _ => (
                let
                    val right_side = []
                    (* no connective check *)
                    val (right_side,l2) = 
                    (case Map.find(l2,no_con) of
                       NONE => (right_side,l2)
                     | SOME (var2,a,b) => let val new_var = fresh_ctx_var var 
                        in (new_var::right_side,Map.insert(l2,var2,(var2,a,new_var::b))) end)
                    (* same connective check *)
                    val (right_side,l2) = 
                    (case Map.find(l2,var) of
                       NONE => (right_side,l2)
                     | SOME (var2,a,b) => let val new_var = fresh_ctx_var var 
                        in (new_var::right_side,Map.insert(l2,var2,(var2,a,new_var::b))) end)
                    val new_cons = (var,left,right_side)
                in
                    (new_cons::cons,l2)
                end
         )
         )

    fun create_sub (var,[a],b) = Dat.CTXs(a,Dat.Ctx(b,[]))
        | create_sub _ = raise Fail "unexpected input create_sub"

    fun seperate' (constraint as (var,left,right),(cons,subs,map)) = 
        (case (List.length(left),List.length(right)) of
           (_,0) => (cons,create_empty_subs(constraint)@subs,map)
         | (1,_) => (cons,create_sub(constraint)::subs,map)
         | (_,1) => (cons,subs,Map2.insert(map,List.hd(right),constraint))
         | _ => (constraint::cons,subs,map))

    fun seperate (cons_list) = List.foldl seperate' ([],[],Map2.empty) cons_list

    fun join ((key,constraint as (var,left,_)),(cons,l2)) =
        (let
            val (new_l2,(var2,left2,_)) = Map2.remove(l2,key)
            val new_cons = (var,left,left2)
        in
            (new_cons::cons,new_l2)
        end)
        handle (NotFound) => (constraint::cons,l2)
    
    fun get_constraints' (var_l1,var_l2) =
        let
            val (var_l1',var_l2') = remove_common(var_l1 , var_l2)
            val l1_comp = initial_set(var_l1')
            val l2_comp = initial_set(var_l2')
            val (l1_cons,l2_map) = List.foldl gen_constraints ([],l2_comp) (Map.listItems l1_comp)
            val l2_cons = Map.listItems (l2_map)
        in
            (l1_cons,l2_cons)
        end 

    fun get_constraints (var_l1,var_l2) =
        let
            val (var_l1',var_l2') = remove_common(var_l1 , var_l2)
            val base_vars = List.foldl Set.add' Set.empty (var_l1'@var_l2')
            val (l1_cons,l2_cons) = get_constraints'(var_l1',var_l2')
            val (l1_partial_cons,l1_subs,l1_map) = seperate (l1_cons)
            val (l2_partial_cons,l2_subs,l2_map) = seperate (l2_cons)
            val (joined_cons,l2_map) = List.foldl join ([],l2_map) (Map2.listItemsi (l1_map))
            val l2_final_cons = (Map2.listItems (l2_map))@l2_partial_cons
            val final_cons = l1_partial_cons@joined_cons@l2_final_cons
            val final_subs = l1_subs@l2_subs
        in
            (final_cons,final_subs)
        end 

    fun test() = 
        let
            val con1 = NONE
            val con2 = SOME (Dat.Con("a"))
            val con3 = SOME (Dat.Con("b"))
            val con4 = SOME (Dat.Con("c"))
            val con5 = SOME (Dat.Con("d"))
            val c1 = Dat.CtxVar(con1,"1")
            val c2 = Dat.CtxVar(con2,"2")
            val c3 = Dat.CtxVar(con3,"3")
            val c4 = Dat.CtxVar(con4,"4")
            val c5 = Dat.CtxVar(con5,"5")
            val f = fresh_ctx_var
            val l1 = [f c1]
            val l2 = [f c1,f c2]
        in
            (l1,l2,get_constraints(l1,l2))
        end

end