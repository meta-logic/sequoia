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

structure Constraints =
struct
    structure Dat = datatypesImpl
    structure F = FreshVar
    structure H = helpersImpl
    structure Map = BinaryMapFn (CtxVarConKey)
    structure Set = SplaySetFn(CtxVarKey)
    structure App =applyunifierImpl


    type constraint = (Dat.ctx_var * Dat.ctx_var list * Dat.ctx_var list)
    type constraint' = (Dat.ctx_var * Dat.ctx_var ref list * Dat.ctx_var ref list)

    val get_index = F.get_index
    val change_index = F.change_index
    val fresh = F.fresh

    fun fresh_ctx_var (Dat.CtxVar(a,name)) = Dat.CtxVar(a,fresh(name))

    val no_con = Dat.CtxVar (NONE,"")

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

    fun split((var,l1,_),other_map) = 
        (case var of
           Dat.CtxVar(NONE,_) => 
            let
                val right_side = List.tabulate(Map.numItems(other_map),fn _ => fresh_ctx_var(var))
            in
                (var,l1,right_side)
            end
         | Dat.CtxVar(SOME _,_) => 
            let
                val right_side = []
                val right_side = (case Map.find(other_map,var) of
                   SOME _ => fresh_ctx_var(var)::right_side
                 | NONE => right_side)
                val right_side = (case Map.find(other_map,no_con) of
                   SOME _ => fresh_ctx_var(var)::right_side
                 | NONE => right_side)
            in
                (var,l1,right_side)
            end)

    fun extract ((a,b,c),(right_side,to_insert)) = 
    (List.hd(c)::right_side,(a,b,List.tl(c))::to_insert)
    
    fun ins (cons as (var,_,_),mp) = Map.insert(mp,var,cons)

    fun match'([],other_map,res) = res
        | match'((var,l1,_)::rest, other_map,res) = 
            let
                val keys = [var,no_con]
                val items = (case var of
                   Dat.CtxVar(NONE,_) => Map.listItems(other_map)
                 | Dat.CtxVar(SOME _,_) => List.mapPartial (fn key => Map.find(other_map,key)) keys)
                val (right_side,to_insert) = List.foldl extract ([],[]) items
                val new_map = List.foldl ins other_map to_insert
                val res = (case List.length(right_side) of
                   0 => res
                 | _ => (var,l1,right_side)::res)
            in
                match'(rest,new_map,res)
            end
    
    fun match(l1,l2) = match'(Map.listItems l1,l2,[])


    
    fun get_constraints (var_l1,var_l2) =
        let
            val (var_l1',var_l2') = remove_common(var_l1 , var_l2)
            val base_vars = List.foldl Set.add' Set.empty (var_l1'@var_l2')
            val (l1_comp) = initial_set(var_l1')
            val (l2_comp) = initial_set(var_l2')
            val l1_split = Map.map (fn x => split(x,l2_comp)) l1_comp
            val l2_split = Map.map (fn x => split(x,l1_comp)) l2_comp
            val l1_matched = match (l1_split,l2_split)
            val l2_matched = match (l2_split,l1_split)
            val l1_split = Map.listItems l1_split
            val l2_split = Map.listItems l2_split
            val var_split = l1_split@l2_split
            val (rejects,split_cons) = List.partition (fn (_,_,c) => List.null c) var_split
            val final_cons = l1_matched@l2_matched@split_cons
            val empty_subs = List.concat ( List.map create_empty_subs rejects)
            val result = (final_cons,empty_subs)
        in
            result
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