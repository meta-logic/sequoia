structure ACUnify =
struct
    structure V = Vector
    
    structure D = datatypesImpl
    
    structure H = helpersImpl

    val start_index = ref 99
    type constraint = (D.ctx_var * D.ctx_var list * D.ctx_var list)

    (* changes the start index (for variable naming purposes)*)
    fun change_start_index( x: int) : unit = ignore (start_index := x)

    fun constraint_to_equation' ([],[]) = (([],[]),([],[]))
       |constraint_to_equation' (left,right) = 
       let
            val current_var = (case (left,right) of (x::_,_) =>x| ([],x::_) =>x | (_,_) => raise Fail "shouldn't happen as both cant be empty")
            val (left_amnt, left_other) = List.partition (fn x => D.ctx_var_eq(current_var,x)) left
            val (right_amnt, right_other) = List.partition (fn x => D.ctx_var_eq(current_var,x)) right
            val amount = List.length(left_amnt) - List.length(right_amnt)
            val res as (left2 as (left_vals,left_names), right2 as (right_vals,right_names)) = constraint_to_equation' (left_other,right_other)
       in
            (case (Int.compare(amount,0)) of
               EQUAL => res
             | GREATER => ((amount::left_vals,current_var::left_names),right2)
             | LESS => (left2,((~1 * amount)::right_vals,current_var::right_names)))
       end
    (* takes a constraint, transforms it into a list corresponding to an equation*)
    fun constraint_to_equation (_,left,right) = constraint_to_equation' (left,right)
    (* takes an equation, transforms it into 2 vectors, one for each side *)
    fun equations_to_vectors (left,right) = (V.fromList(left),V.fromList(right))

    (* takes a pair of vectors (A,B) corresponding to A=B, and transforms them into a graph *)
    (* based on the construction from the paper *)
    (* the graph is just going to be a bool array to indicate whether a node was visited,
       a pair of vectors for the edges used (same as original vectors), and a pair of indices *)
    (* (bool_array as (B vec,check,set), edges_vec, min_ind,max_ind,min_left,min_right) *)
    fun vectors_to_graph (left,right) = 
        let
            val edges = (V.map (fn _ => 0) left, V.map (fn _ => 0) right)
            (* bool_vector, with a check function and a set function *)
            val max_right = V.foldr (Int.max) 0 right
            val max_left = V.foldr Int.max 0 left
            fun check (B, i):bool = V.sub(B,i+max_right)
            fun set (B, i) = ( V.update(B, i+max_right, true))
            val bool_array = ( V.tabulate(max_left + max_right+1, (fn _=> false)))
        in
            (bool_array,check,set,edges,max_right*(~1),max_left)
        end


    (* verifies that a given solution is minimal*)
    fun verify_solution (sol as (sleft,sright)) (check,set,min_n,max_n,left_e,right_e,bool_array,node,(cur_l,cur_r),left_min,right_min) = 
        (case (Int.compare(node,0), V.exists (fn x => x) bool_array, check(bool_array,node)) of
          (EQUAL,true,_) => ((V.collate Int.compare (sleft,cur_l)) = EQUAL) andalso ( (V.collate Int.compare (sright, cur_r))= EQUAL)
         |(_,_,true) => false
         |(_,_,_) =>
            let
                val bool_array = set(bool_array,node)
                val cmp = Int.compare(node,0)
                fun map_function (ind,value) = 
                    (case cmp of
                       LESS => if ( (ind < left_min) orelse (V.sub(cur_l,ind) = V.sub(sleft,ind)) orelse ((node+value) > max_n)) then false 
                       else (verify_solution sol (check,set,min_n,max_n,left_e,right_e,bool_array,node+value,(V.update(cur_l,ind,V.sub(cur_l,ind)+1),cur_r),ind,right_min))
                     | _ => if ((ind < right_min) orelse (V.sub(cur_r,ind) = V.sub(sright,ind)) orelse (node-value < min_n) ) then false 
                        else (verify_solution sol (check,set,min_n,max_n,left_e,right_e,bool_array,node-value,(cur_l,V.update(cur_r,ind,V.sub(cur_r,ind)+1)),left_min,ind)))
                val check_list = (case cmp of LESS => left_e | _ => right_e)
            in
              V.exists (fn x => x) (V.mapi map_function check_list)
            end)

    (* given a graph and input vectors, finds all minimal solutions to the equation*)
    fun find_solutions (check,set,min_n,max_n,left_e,right_e,bool_array,node,cur_l,cur_r,left_min,right_min) = 
        (case (Int.compare(node,0), V.exists (fn x => x) bool_array, check(bool_array,node)) of
           (EQUAL,true,_) => if (verify_solution (cur_l,cur_r) (check,set,min_n,max_n,left_e,right_e,
                            (V.tabulate ((max_n-min_n+1),(fn _ => false))),0,(V.map (fn _ => 0) left_e, V.map (fn _ => 0) right_e),0,0))
                             then [(cur_l,cur_r)] else []
         | (_,_,true) => []
         | _ => 
            let
                val bool_array = set(bool_array,node)
                val cmp = Int.compare(node,0)
                val check_list = (case cmp of LESS => left_e | _ => right_e)
                fun map_function (ind,value) = 
                    (case cmp of
                       LESS => if ((ind < left_min) orelse (node+value > max_n)) then [] 
                       else (find_solutions (check,set,min_n,max_n,left_e,right_e,bool_array,node+value,(V.update(cur_l,ind,V.sub(cur_l,ind)+1)),cur_r,ind,right_min))
                     | _ => if ((ind < right_min) orelse (node-value < min_n))then [] 
                       else (find_solutions (check,set,min_n,max_n,left_e,right_e,bool_array,node-value,cur_l,(V.update(cur_r,ind,V.sub(cur_r,ind)+1)),left_min,ind)))
                val results = V.mapi map_function check_list
            in
              V.foldr op@ [] results
            end) 

    (* used incase we transform the equation to an injective one *)
    fun expand_solutions _ = raise Fail "unimplemented"

    (* maps the set of solutions to a substitution that corresponds to the MGU for the constraint*)
    fun solutions_to_MGU _ = raise Fail "unimplemented"

    (* given a constraint, return the most general unifier *)
    fun solve_constraint A = 
        let
            val ((value_l,name_l),(value_r,name_r)) = constraint_to_equation(A)
            val (left_e,right_e) = equations_to_vectors (value_l,value_r)
            val (bool,check,set,(cur_l,cur_r),min_n,max_n) = vectors_to_graph (left_e,right_e)
            val solution = find_solutions (check,set,min_n,max_n,left_e,right_e,bool,0,cur_l,cur_r,0,0)
        in
            ((name_l,name_r),solution)
        end

    (* given a list of constraints, return the most general unifier *)
    fun solve_constraints _ = raise Fail "unimplemented"

    val cons1 = (D.CtxVar("lol"), [D.CtxVar("E"), D.CtxVar("E"), D.CtxVar("B"), D.CtxVar("C")], [D.CtxVar("A"), D.CtxVar("A"), D.CtxVar("D")])
    val cons2 = (D.CtxVar("lol"), [D.CtxVar("A"), D.CtxVar("A")], [D.CtxVar("B"), D.CtxVar("C")])
    val cons3 = (D.CtxVar("lol"), [D.CtxVar("B"), D.CtxVar("C")], [D.CtxVar("A"), D.CtxVar("D")])

    fun test1 () = solve_constraint(cons1)
    fun test2 () = solve_constraint(cons2)
    fun test3 () = solve_constraint(cons3)

    
end