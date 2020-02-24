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

    (* combines several variables with the same connective *)
    (* generates a new list with the variables combined, *)
    (* and a constraint list mapping new variables to old ones *)
    fun initial_set (var_list:Dat.ctx_var list): (constraint Map.map * constraint Map.map) = 
        let
            val set = initial_set'(var_list)
            val constraints = Map.listItems(set)
            val updated = Map.map (fn (a,b,_) => (a,b,[])) set
        in
            (updated,set)
        end
        
    fun remove_common(var_l1,var_l2) = H.remove_similar(var_l1,var_l2,Dat.ctx_var_eq)

    (*NONE maps to everything, SOME(a) *)
    fun gen_constraints (var,(map,constraints)) =
        (case var of
           Dat.CtxVar(NONE,_) => 
                (let
                    val new_map = Map.map (fn (a,b,c) => (a,b,fresh_ctx_var(a)::c)) map
                    val equiv_vars = List.map (fn (_,_,c) => List.hd c) (Map.listItems new_map)
                in
                    (new_map,(var,[var],equiv_vars)::constraints)
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
                 | SOME (a,b,c) => let val (var',a') = (fresh_ctx_var(var),fresh_ctx_var(a))
                 in (var'::right_side,(var,[var'],[a'])::new_cons,Map.insert (map,a,(a,b,a'::c))) end)
                (* find no connective, add var to both, no constraint *)
                val (right_side,map) = (case Map.find(map,Dat.CtxVar(NONE,"")) of
                    (* no generic *)
                   NONE => (right_side,map)
                 | SOME (a,b,c) => (let val var' = fresh_ctx_var(var)
                 in (var'::right_side,Map.insert(map,a,(a,b,var'::c))) end))
            in
                (map,(new_cons)@((var,[var],right_side)::constraints))                
            end))


    
    fun get_constraints (var_l1,var_l2) =
        let
            (* TODO: filter constraints that only rename *)
            (* TODO: propogate empty constaints *)
            val (var_l1',var_l2') = remove_common(var_l1,var_l2)
            val (l1_comp,l1_cons) = initial_set(var_l1)
            val (l2_comp,l2_cons) = initial_set(var_l2)
            val l1 = List.map (fn (a,_,_) => a) (Map.listItems l1_comp)
            val cons = (Map.listItems l1_cons)@(Map.listItems l2_cons)
            val (l2_comp,new_cons) = List.foldl (gen_constraints) (l2_comp,cons) l1 
            val final_cons = (Map.listItems(l2_comp))@new_cons
        in
            final_cons
        end 

end