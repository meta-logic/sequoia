structure unifyImpl : UNIFICATION = struct
    structure H = helpersImpl
    structure DAT = datatypesImpl
    structure APP = applyunifierImpl


    type sub = DAT.sub
    type form = DAT.form
    type ctx_var = DAT.ctx_var
    type ctx = DAT.ctx
    type ctx_struct = DAT.ctx_struct
    type seq = DAT.seq

    val init_fresh = ref 100;

    val var_index = ref 1;

    fun change_index (x:int): unit = ignore (var_index := x)

    fun get_index ():int = !var_index

    fun fresh'(x:string):string = (x ^"^{"^ (Int.toString(!var_index)) ^"}") before (var_index := !var_index + 1)

    val hat::_ = String.explode("^")

    fun remove_hat' (nil) = nil
        |remove_hat' (x::L) = (case (x=hat) of true => [] | false => x::remove_hat'(L))

    fun remove_hat (x) = String.implode(remove_hat'(String.explode(x)))
    (* nuke version *)
    fun fresh(x:string):string = fresh'(remove_hat(x))


    (*TODO: remove duplicate or remove both*)
    fun printF (NONE) = []
        | printF (SOME(sigma)) = 
            List.map(fn ls => 
                List.map(fn sb => 
                    (case sb of DAT.Fs(a,b) => (DAT.form_toString a ^ " => " ^ DAT.form_toString b)
                            |  DAT.CTXs(a,b) =>  (DAT.ctx_var_toString a ^ " => " ^ DAT.ctx_toString b)
                            |  DAT.CVs(a,b) => (DAT.ctx_var_toString a ^ " => " ^ DAT.ctx_var_toString b)
                    ))ls)sigma

    fun printS ([]) = []
        | printS (sigma) = 
            List.map(fn ls => 
                List.map(fn sb => 
                    (case sb of DAT.Fs(a,b) => (DAT.form_toString a ^ " => " ^ DAT.form_toString b)
                            |  DAT.CTXs(a,b) => (DAT.ctx_var_toString a ^ " => " ^ DAT.ctx_toString b)
                            |  DAT.CVs(a,b) => (DAT.ctx_var_toString a ^ " => " ^ DAT.ctx_var_toString b)
                    ))ls)sigma

    fun printC ([]) = []
        | printC (cons) = 
            List.map(fn ls => 
                List.map(fn (g1,g2,g3) => 
                    if (List.length g2 = 0) andalso (List.length g3 = 0) then "NO CONSTRAINT"
                    else DAT.ctx_var_toString g1 ^ " |- " ^ DAT.ctx_varL_toString g2 ^ " = " ^ DAT.ctx_varL_toString g3)ls)cons

    fun print_sigs_cons (NONE) = []
        | print_sigs_cons (SOME sc_ls) = let val (s,c) = ListPair.unzip(sc_ls) in ListPair.zip (printS s, printC c) end


    fun Unify_form (x,y) = 
        let
            fun cat_compose(sigma1, unilst) = 
                let val pair = ListPair.zip(sigma1, unilst) 
                in List.concat(
                        List.map(fn(a, b) =>  
                        (case b of NONE => [] 
                                | SOME(bls) => List.map(fn bv => APP.UnifierComposition(a, bv))bls)
                        )pair)end

            fun search (f1, DAT.Form(c, fls)) = 
                    List.exists (fn f2 => DAT.form_eq(f1, f2) orelse search (f1, f2)) fls
                | search (_, _) = false

            fun Unify_f (DAT.AtomVar(x), DAT.AtomVar(y)) = if x=y then SOME[nil] else
                        SOME([ [DAT.Fs(DAT.AtomVar(x), DAT.AtomVar(y))] ])
                | Unify_f (DAT.AtomVar(x), DAT.FormVar(y)) = SOME([ [DAT.Fs(DAT.FormVar(y), DAT.AtomVar(x))] ])
                | Unify_f (DAT.AtomVar(x), DAT.Atom(y)) = SOME([ [DAT.Fs(DAT.AtomVar(x), DAT.Atom(y))] ])
                | Unify_f (DAT.Atom(x), DAT.AtomVar(y)) = SOME([ [DAT.Fs(DAT.AtomVar(y), DAT.Atom(x))] ])
                | Unify_f (DAT.Atom(x), DAT.FormVar(y)) = SOME([ [DAT.Fs(DAT.FormVar(y), DAT.Atom(x))] ])
                | Unify_f (DAT.FormVar(x), DAT.AtomVar(y)) = SOME([ [DAT.Fs(DAT.FormVar(x), DAT.AtomVar(y))] ])
                | Unify_f (DAT.FormVar(x), DAT.FormVar(y)) = if x=y then SOME([nil]) else 
                        SOME([ [DAT.Fs(DAT.FormVar(x), DAT.FormVar(y))] ])
                | Unify_f (DAT.FormVar(x), DAT.Atom(y)) = SOME([ [DAT.Fs(DAT.FormVar(x), DAT.Atom(y))] ])
                | Unify_f (DAT.FormVar(x), DAT.Form(c, fls)) = if search(DAT.FormVar(x), DAT.Form(c, fls)) 
                        then NONE else SOME([ [DAT.Fs(DAT.FormVar(x), DAT.Form(c, fls))] ])
                | Unify_f (DAT.Form(c, fls), DAT.FormVar(x)) = if search(DAT.FormVar(x), DAT.Form(c, fls)) 
                        then NONE else SOME([ [DAT.Fs(DAT.FormVar(x), DAT.Form(c, fls))] ])
                | Unify_f (DAT.Form(c1, fls1), DAT.Form(c2, fls2)) = 
                    if DAT.form_eq(DAT.Form(c1, fls1), DAT.Form(c2, fls2)) then SOME([nil])
                    else if DAT.conn_eq(c1,c2) then Unify_sf (fls1, fls2) else NONE
                | Unify_f (_, _) = NONE
            and Unify_sf ([], []) = NONE
                | Unify_sf ([x], [y]) = Unify_f(x,y)
                | Unify_sf (f1::fls1, f2::fls2) = 
                    (case Unify_f(f1,f2) of
                        NONE => NONE
                        | SOME(sigma1) => 
                            let val sigma1fls1 = APP.apply_formL_allUnifiers (fls1, sigma1)
                                val sigma1fls2 = APP.apply_formL_allUnifiers (fls2, sigma1)
                                val sigma1flspair = ListPair.zip(sigma1fls1,sigma1fls2)
                                val unis = List.map(fn(a,b) => Unify_sf(a,b))sigma1flspair 
                            in
                                SOME(cat_compose(sigma1, unis))
                            end)
                | Unify_sf (_, _) = NONE
        in
            Unify_f(x,y)
        end


    fun Unify_formL (x, y) = 
        let
            fun cat_compose(sigma1, unilst) = 
                let val pair = ListPair.zip(sigma1, unilst) 
                in List.concat(
                        List.map(fn(a, b) =>  
                        (case b of NONE => [] 
                                | SOME(bls) => List.map(fn bv => APP.UnifierComposition(a, bv))bls ) 
                        )pair)end

            fun Unify_fL ([], []) = SOME(nil)
                | Unify_fL ([x], [y]) = Unify_form(x,y)
                | Unify_fL (f1::fls1, f2::fls2) = 
                    (case Unify_form(f1,f2) of
                        NONE => NONE
                        | SOME(sigma1) => 
                            let val sigma1fls1 = APP.apply_formL_allUnifiers (fls1, sigma1)
                                val sigma1fls2 = APP.apply_formL_allUnifiers (fls2, sigma1)
                                val sigma1flspair = ListPair.zip(sigma1fls1,sigma1fls2)
                                val unis = List.map(fn(a,b) => Unify_fL(a,b))sigma1flspair 
                            in
                                SOME(cat_compose(sigma1, unis))
                            end)
                | Unify_fL (_, _) = NONE  
        in
            Unify_fL(x,y)
        end


    fun Unify_ctx (DAT.Ctx(vl1, fl1), DAT.Ctx(vl2, fl2)) =
        let
            

            fun update_ctx_var (DAT.CtxVar(x)) = DAT.CtxVar(fresh(x))

            fun get_constraint (g1, g2) =
                let val () = () in init_fresh := !init_fresh + 1;
                (DAT.CtxVar("Gamma_" ^ Int.toString(!init_fresh)), g1, g2) end

            fun post_ctx (sigma) = List.concat(List.map(fn DAT.CTXs(_, DAT.Ctx(cv, _)) => cv 
                                                        | _ => raise Fail "post_ctx fun in Unify_ctx") sigma)

            fun try_permutations (chosen_l1, chosen_l2) =
                if List.length(chosen_l1) = 0 andalso List.length(chosen_l2) = 0 then [nil] else
                if not (List.length(chosen_l1) = List.length(chosen_l2))  then [] else
                    List.concat(
                        List.mapPartial (fn x => x)
                            (List.map(fn (perm_l1, perm_l2) => Unify_formL(perm_l1, perm_l2))
                                (List.map(fn p1 => (p1, chosen_l2))
                                    (H.permutations(chosen_l1))
                                )
                            )
                        )

            fun part (vl1, fl1, vl2) =
                if List.length(fl1) = 0 andalso List.length(vl2) = 0 then [nil] else
                    let val part = H.partition_into (List.length(vl2), fl1)
                        val vl_sigmas =
                            List.map(fn pf =>
                                List.map(fn (p,g) =>
                                    if List.length(p) = 0 then
                                        if List.length(vl1) = 0 then DAT.CTXs(g, DAT.Ctx([], []))
                                        else DAT.CTXs(g, DAT.Ctx([update_ctx_var(g)], [])) 
                                    else 
                                        if List.length(vl1) = 0 then DAT.CTXs(g, DAT.Ctx([], p))
                                        else DAT.CTXs(g, DAT.Ctx([update_ctx_var(g)], p))
                                )(ListPair.zip(pf, vl2))
                            )part
                    in vl_sigmas end

            (* form_list1, variable_list1, form_list2, var_list2 ??? *)
            fun try_partitions (fl1, vl1, fl2, vl2) =
                let val sigma1 = part (vl1, fl1, vl2)
                    val sigma2 = part (vl2, fl2, vl1)
                in
                    if List.length(sigma1) = 0 then [] else
                    if List.length(sigma2) = 0 then [] else
                    let val temp =
                        List.concat(
                            List.map(fn s1 => 
                                List.map(fn s2 => 
                                    let val (subs, (fresh_g, set1, set2)) = 
                                        (s1 @ s2, get_constraint(post_ctx s1, post_ctx s2))
                                    in 
                                        (case (List.length(set1),List.length(set2)) of
                                           (0,0) => (subs, [])
                                         | (1,_) => (List.take(
                                        APP.UnifierComposition(subs,[DAT.CTXs(List.hd(set1),DAT.Ctx(set2,nil))]),
                                        List.length subs),[])
                                         | (_,1) => (List.take(
                                        APP.UnifierComposition(subs,[DAT.CTXs(List.hd(set2),DAT.Ctx(set1,nil))]),
                                        List.length subs),[])
                                         | _ => (subs, [(fresh_g, set1, set2)]))
                                    end
                                )sigma1
                            )sigma2)
                    in 
                        List.map(fn (sb,c) => (List.filter(fn DAT.CTXs(cx, DAT.Ctx(cxs, _)) => 
                            not (List.length(cxs) = 1 andalso DAT.ctx_var_eq (List.hd cxs, cx))
                                                            | _ => raise Fail "try_partitions in Unify_ctx")sb, c))temp
                    end
                end

            fun unify_specific_k (vl1, fl1, vl2, fl2, i) =
                let val k_fl1 = H.chooseK(fl1, i, DAT.form_eq)
                    val k_fl2 = H.chooseK(fl2, i, DAT.form_eq)
                    val everyMatchOfK  = 
                        List.concat(
                            List.map(fn (chosen_l2, left_l2) => 
                                List.concat(
                                    List.map(fn (chosen_l1, left_l1) => 
                                        let val permSubs_chl1_chl2 = try_permutations (chosen_l1, chosen_l2)
                                            val partSubs_left1_left2 = try_partitions (left_l1, vl1, left_l2, vl2)
                                        in
                                            List.concat(
                                                List.map(fn p1 => 
                                                    List.map(fn (p2, c) => (APP.UnifierComposition(p2,p1), c)
                                                    )partSubs_left1_left2
                                                )permSubs_chl1_chl2)
                                        end
                                    )k_fl1)
                            )k_fl2)
                in
                    everyMatchOfK
                end

            fun Unify_ctx_AUX (DAT.Ctx([], fl1), DAT.Ctx([], fl2)) = 
                    let val subs = try_permutations (fl1, fl2)
                        val cons = List.map(fn (s) => [])subs
                    in if List.length(subs) = 0 then NONE
                    else SOME(ListPair.zip(subs, cons)) end
                | Unify_ctx_AUX (DAT.Ctx(vl1, fl1), DAT.Ctx([], fl2)) = 
                    if List.length(fl1) > List.length(fl2) then NONE
                    else SOME(unify_specific_k(vl1, fl1, [], fl2, List.length fl1))
                | Unify_ctx_AUX (DAT.Ctx([], fl1), DAT.Ctx(vl2, fl2)) = 
                    if List.length(fl1) < List.length(fl2) then NONE
                    else SOME(unify_specific_k([], fl1, vl2, fl2, List.length fl2))
                | Unify_ctx_AUX (DAT.Ctx(vl1, fl1), DAT.Ctx(vl2, fl2)) = 
                    let val minforms = Int.min(List.length fl1, List.length fl2)
                        val sc = List.concat(List.tabulate(minforms+1, fn i => 
                                            unify_specific_k(vl1, fl1, vl2, fl2, i)))
                    in SOME(sc) end
        in
            let val (fl1,fl2) = H.remove_similar (fl1, fl2, DAT.form_eq) in
                case Unify_ctx_AUX(DAT.Ctx(vl1, fl1), DAT.Ctx(vl2, fl2)) of
                    NONE => NONE
                    | SOME(sb) => SOME(H.remove_duplicates (sb, DAT.sub_eq))
            end
        end


    fun Unify_ctx_struct (DAT.Empty, DAT.Empty) = SOME([])
        | Unify_ctx_struct (DAT.Single(ctx1), DAT.Single(ctx2)) = Unify_ctx(ctx1, ctx2)
        | Unify_ctx_struct (DAT.Mult(c1,ctx1,ctx_struct1), DAT.Mult(c2,ctx2,ctx_struct2)) = 
            (case DAT.conn_eq(c1,c2) of
                false => NONE
                | _ => (case Unify_ctx(ctx1, ctx2) of 
                            NONE => NONE
                            | SOME(sigma1_const1) => 
                                let 
                                    val (sigma1, const1) = ListPair.unzip(sigma1_const1) 
                                    val newStructPair = ListPair.zip(APP.apply_ctx_struct_allUnifiers(ctx_struct1,sigma1), 
                                                                    APP.apply_ctx_struct_allUnifiers(ctx_struct2,sigma1))
                                    val sigma2_const2 = List.map(fn (r1, r2) => Unify_ctx_struct(r1,r2))newStructPair
                                    val sigma_const_Pair = ListPair.zip(sigma1_const1, sigma2_const2)
                                    val sc_list = List.mapPartial (fn (s,SOME x) => SOME (s,x) | (_,NONE) => NONE) sigma_const_Pair 
                                    val combo = List.concat(
                                                List.map(fn ((sub1,con1), sc) => 
                                                    List.map(fn (subs,cons) => 
                                                        (APP.UnifierComposition(sub1, subs), con1 @ cons))sc
                                                )sc_list)
                                in
                                    SOME(combo)
                                end))
        | Unify_ctx_struct (_, _) = NONE


    fun Unify_seq (DAT.Seq(l1, c1, r1), DAT.Seq(l2, c2, r2)) = 
        (case DAT.conn_eq(c1,c2) of
                false => NONE
                | _ => (case Unify_ctx_struct(l1, l2) of 
                            NONE => NONE
                            | SOME(sigma1_const1) => 
                                let 
                                    val (sigma1, const1) = ListPair.unzip(sigma1_const1) 
                                    val newStructPair = ListPair.zip(APP.apply_ctx_struct_allUnifiers(r1,sigma1), 
                                                                    APP.apply_ctx_struct_allUnifiers(r2,sigma1))
                                    val sigma2_const2 = List.map(fn (r1, r2) => Unify_ctx_struct(r1,r2))newStructPair
                                    val sigma_const_Pair = ListPair.zip(sigma1_const1, sigma2_const2)
                                    val sc_list = List.mapPartial (fn (s,SOME x) => SOME (s,x) | (_,NONE) => NONE) sigma_const_Pair 
                                    val combo = List.concat(
                                                List.map(fn ((sub1,con1), sc) => 
                                                    List.map(fn (subs,cons) => 
                                                        (APP.UnifierComposition(sub1, subs), con1 @ cons))sc
                                                )sc_list)
                                in
                                    SOME(combo)
                                end))

end
