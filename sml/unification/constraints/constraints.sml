structure CtxVarKey : ORD_KEY = 
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

structure Constraints =
struct
    structure Dat = datatypesImpl
    structure F = FreshVar
    structure H = helpersImpl
    structure Map = BinaryMapFn (CtxVarKey)


    type constraint = (Dat.ctx_var * Dat.ctx_var list * Dat.ctx_var list)
    type constraint' = (Dat.ctx_var * Dat.ctx_var ref list * Dat.ctx_var ref list)

    val get_index = F.get_index
    val change_index = F.change_index
    val fresh = F.fresh

    fun fresh_ctx_var (Dat.CtxVar(a,name)) = Dat.CtxVar(a,fresh(name))

    fun my_insert (var,map) = 
        let
            val res = Map.find(map,var)
        in
            (case res of
               SOME (a,b,c) => Map.insert (map,var,(a,b,var::c))
             | NONE => let val new = fresh_ctx_var(var) in 
             Map.insert(map,var,(new,[new],[var])) end)
        end
    
    fun initial_set' (var_list) = List.foldr my_insert Map.empty var_list

    fun handle_rename (var,a,b) = 
        (case b of
           [old_var] => ( (old_var,[old_var],[old_var]))
         | _ => ((var,a,b)))

    (* combines several variables with the same connective *)
    (* generates a new list with the variables combined, *)
    (* and a constraint list mapping new variables to old ones *)
    fun initial_set (var_list:Dat.ctx_var list): (constraint' Map.map * constraint Map.map) = 
        let
            val set = initial_set'(var_list)
            val set = Map.map (handle_rename) set
            val constraints = Map.filter (fn (_,_,b) => List.length(b)<>1) set
            val updated = Map.map (fn (a,b,_) => (a,[ref a],[])) set
            (* filter renames *)
        in
            (updated,constraints)
        end
        
    fun remove_common(var_l1,var_l2) = H.remove_similar(var_l1,var_l2,Dat.ctx_var_eq)

    fun empty_sub(var) = Dat.CTXs(var,Dat.Ctx([],[]))

    fun create_empty_subs (var,comp) = 
        (let
            val (comp',(_,_,c)) = Map.remove(comp,var)

        in
            (List.map empty_sub c,comp')
        end)
        handle (LibBase.NotFound) => ([empty_sub var],comp)

    fun rename_vars (l) = (List.app (fn x => x := fresh_ctx_var(!x)) l;l)

    fun rename_cons_con ((var,l1,l2),comp: constraint Map.map) = 
        (case List.length(l2) of
           1 => (NONE,[],comp)
         | 2 => (SOME (var,l1,rename_vars l2),[],comp)
         | 0 => let val (subs,comp') = create_empty_subs(var,comp) in (NONE,subs,comp') end
         | _ => (SOME (var,l1,l2),[],comp))
    fun rename_cons_gen ((var,l1,l2),comp) = 
        (case List.length(l2) of
           1 => (case Dat.ctx_var_eq(var,!(List.hd l2)) of true => (NONE,[],comp)
                                 | false => (SOME (var,l1,l2),[],comp))
         | 2 => (SOME (var,l1,l2),[],comp)
         | 0 => let val (subs,comp') = create_empty_subs(var,comp) in (NONE,subs,comp') end
         | _ => (SOME (var,l1,l2),[],comp))

    fun rename_cons (cons as (var,l1,l2),comp) = 
        (case var of
           Dat.CtxVar(NONE,_) => rename_cons_gen(cons,comp)
         | _ => rename_cons_con(cons,comp))

    (*NONE maps to everything, SOME(a) *)
    fun gen_constraints (var,(map,constraints,subs,comp)) =
        (case var of
           Dat.CtxVar(NONE,_) => 
                (let
                    val new_map = Map.map (fn (a,b,c) => (a,b,(ref a)::c)) map
                    val equiv_vars = List.map (fn (_,_,c) => List.hd c) (Map.listItems new_map)
                    val gen_cons = (var,[ref var],equiv_vars)
                    val (constraints,subs,comp) = (case rename_cons (gen_cons,comp) of
                       (NONE,new_subs,new_comp) => (constraints,new_subs@subs,new_comp)
                     | (SOME a,new_subs,new_comp) => (a::constraints,new_subs@subs,new_comp))
                in
                    (new_map,constraints,subs,comp)
                end )
         | Dat.CtxVar(SOME _,_) => 
            (let
                val right_side = []
                val new_cons = []
                (* same connective, add var to both, add constraint *)
                val (right_side,new_cons,map) = (case Map.find (map,var) of
                    (* no match *)
                   NONE => (right_side,new_cons,map)
                   (* found var *)
                 | SOME (a,b,c) => let val (var',a') = (ref var,ref a)
                 in (var'::right_side,(var,[var'],[a'])::new_cons,Map.insert (map,a,(a,b,a'::c))) end)
                (* find no connective, add var to both, no constraint *)
                val (right_side,map) = (case Map.find(map,Dat.CtxVar(NONE,"")) of
                    (* no generic *)
                   NONE => (right_side,map)
                 | SOME (a,b,c) => (let val var' = ref var
                 in (var'::right_side,Map.insert(map,a,(a,b,var'::c))) end))
                val var_cons = (var,[ref var], right_side)
                val (new_cons,subs',comp') = (case rename_cons (var_cons,comp) of
                   (NONE,new_subs,new_comp) => (new_cons,new_subs,new_comp)
                 | (SOME a,new_subs,new_comp) => (a::new_cons,new_subs,new_comp))
            in
                (map,(new_cons)@constraints,subs'@subs,comp')
            end))

    
    fun rename_cons_list(cons,(cons_rest,subs,comp))=
        let
            val (new_cons,new_subs,new_comp) = rename_cons(cons,comp)
            val new_cons_rest = (case new_cons of
               NONE => cons_rest
             | SOME a => a :: cons_rest)
        in
            (new_cons_rest,new_subs@subs,new_comp)
        end
    fun fix_names (l) = List.map op! l

    fun fix_constraint ((var,l1,l2):constraint') = (var,fix_names l1, fix_names l2)

    fun get_constraints (var_l1,var_l2) =
        let
            val (var_l1',var_l2') = remove_common(var_l1 , var_l2)
            val (l1_comp,l1_cons) = initial_set(var_l1')
            val (l2_comp,l2_cons) = initial_set(var_l2')
            val l1 = List.map (fn (a,_,_) => a) (Map.listItems l1_comp)
            val (l2_comp,gen_cons_refs,empty_subs,l1_cons) = List.foldl (gen_constraints) (l2_comp,[],[],l1_cons) l1
            val l2_pre_rename = Map.listItems l2_comp
            val fold = List.foldl rename_cons_list ([],[],l2_cons)
            val (l2_cons_refs,l2_empty_subs,l2_cons) = fold l2_pre_rename
            val var_split_cons = List.map fix_constraint (l2_cons_refs@gen_cons_refs)
            val comp_cons = (Map.listItems l1_cons)@ (Map.listItems l2_cons)
            val final_cons = comp_cons@var_split_cons
            val all_empty_subs = l2_empty_subs@empty_subs
        in
            (final_cons,all_empty_subs)
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