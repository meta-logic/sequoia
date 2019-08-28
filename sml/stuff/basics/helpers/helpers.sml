structure helpersImpl : HELPERS = struct

    fun remove (_, [], _) = []
        | remove (f, e::ls, cmpf) = if cmpf(f,e) then ls else e::remove (f, ls, cmpf)

    (* Checks if two multisets, encoded as lists, are the same *)
    fun mset_eq ([], [], _) = true 
        | mset_eq (a :: l1, l2, eq) = 
            let val l1' = List.filter (fn x => not (eq (x, a)) ) l1
                val l2' = List.filter (fn x => not (eq (x, a)) ) l2
            in
                List.length (a::l1) = List.length l2 andalso
                mset_eq (l1', l2', eq)
            end
        | mset_eq _ = false

    fun chooseK (forms, k, cmpf) = 
        let
            fun set_chosen ([], cmpf) = []
                | set_chosen ((x,y)::ls, cmpf) = 
                let val filtered = List.filter(fn (ck, _) => not (mset_eq (ck, x, cmpf)))ls in
                (x,y) :: set_chosen (filtered, cmpf) end
            val formSize = List.length(forms)
            fun choose (forms, 0, rest) = [(nil, rest@forms)]
                | choose (nil, k, rest) = []
                | choose (f::forms', k, rest) = case List.length(f::forms') < k of
                    true => []
                    | false => 
                        let val f_picked = choose (forms', k-1, rest)  
                            val f_skipped = choose (forms', k, rest@[f])
                        in
                            (List.map(fn (c,r) => (f::c, r))f_picked) @  f_skipped
                        end
        in
            case Int.compare(k, Int.div(formSize, 2)) of 
                GREATER => set_chosen(choose(forms, k, []), cmpf)
                | _ => set_chosen(List.map(fn (a,b) => (b,a))(choose(forms, formSize-k, [])), cmpf)
        end

    fun chooseDP (forms, k) =
        let val DPA = Array2.tabulate(Array2.RowMajor)(k+1, List.length(forms)+1, 
                fn(i,j) => if i = 0 then SOME([nil]) else if i > j then SOME([]) else NONE)
            fun choose ([], _) = []
                | choose (f::forms', k) = case Array2.sub(DPA, k, List.length(f::forms')) of
                    SOME(a) => a
                    | NONE =>
                        (let 
                            val sub_chosen = choose (forms', k-1)
                            val () = Array2.update(DPA, k-1, List.length(forms'), SOME(sub_chosen))
                            val sub_skipped = choose (forms', k)
                            val () = Array2.update(DPA, k, List.length(forms'), SOME(sub_skipped))
                        in
                            (List.map(fn ls => f::ls)sub_chosen) @ sub_skipped
                        end)
        in
            choose (forms, k)
        end 

    (* Returns a list with all possible permutations of the argument *)
    fun permutations [] = [[]]
        | permutations (x :: l) =
        let
            fun ins_x [] = [[x]]
                | ins_x (a :: l) = (x :: a :: l) :: List.map (fn lx => a :: lx) (ins_x l) 
        in
            List.foldl (fn (p, ps) => ps @ (ins_x p)) [] (permutations l)
        end

    fun distribute (ctx, f) = List.tabulate(List.length(ctx), fn i => 
                        List.take(ctx, i) @ [List.nth(ctx, i) @ [f]] @ List.drop(ctx, i+1)) 

    fun partition_into (n, forms) = 
        let
            fun partition (ctxs, []) = ctxs
                | partition (ctxs, f::forms) = 
                    partition(List.concat(List.map(fn c => distribute(c, f))ctxs), forms)
        in
            partition([List.tabulate(n, fn _ => [])], forms)
        end

    fun remove_similar ([], ls2, _) = ([], ls2)
        | remove_similar (x::ls1, ls2, cmpf) = 
            let val lsp2 = remove (x, ls2, cmpf) in
            if List.length(lsp2) = List.length(ls2) then 
            let val (a,b) = remove_similar (ls1, ls2, cmpf) in (x::a,b) end
            else remove_similar (ls1, lsp2, cmpf) end 

    fun remove_duplicates ([], _) = []
        | remove_duplicates ((x,y)::ls, cmpf) = 
            let val filtered = List.filter(fn (ck, _) => not (mset_eq (ck, x, cmpf)))ls in
            (x,y) :: remove_duplicates (filtered, cmpf) end

end
