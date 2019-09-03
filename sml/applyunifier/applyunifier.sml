structure applyunifierImpl : APPLYUNIFIER = struct
    structure DAT = datatypesImpl

    type sub = DAT.sub

    type form = DAT.form
    type ctx_var = DAT.ctx_var
    fun apply_form_Unifier (item, []) = item
        | apply_form_Unifier (DAT.Form(c, subforms), subs) = DAT.Form(c, apply_subform_Unifier(subforms, subs)) 
        | apply_form_Unifier (item, DAT.Fs(f1,f2)::subs) = 
            if DAT.form_eq(item, f1) then f2 else apply_form_Unifier (item, subs)
        | apply_form_Unifier (item, a::subs) = apply_form_Unifier (item, subs)
    and apply_subform_Unifier (fl, subs) = List.map(fn item => apply_form_Unifier (item, subs))fl
    fun apply_formL_Unifier (fl, subs) = List.map(fn item => apply_form_Unifier (item, subs))fl
    fun apply_formL_allUnifiers (itemL, subsL) = List.map(fn sb => apply_formL_Unifier(itemL, sb))subsL


    type ctx = DAT.ctx
    fun apply_ctx_var_Unifier (item, []) = ([item], [])
        | apply_ctx_var_Unifier (item, DAT.CVs(f1,DAT.Ctx(a,b))::subs) = 
            if DAT.ctx_var_eq(item, f1) then (a,b) else apply_ctx_var_Unifier (item, subs)
        | apply_ctx_var_Unifier (item, a::subs) = apply_ctx_var_Unifier (item, subs)
    fun apply_ctx_varL_Unifier (vl, subs) = List.map(fn item => apply_ctx_var_Unifier (item, subs))vl
    fun apply_ctx_varL_allUnifiers (itemL, subsL) = List.map(fn sb => apply_ctx_varL_Unifier(itemL, sb))subsL


    type ctx_struct = DAT.ctx_struct
    fun apply_ctx_struct_Unifier (DAT.Empty, subs) = DAT.Empty
        | apply_ctx_struct_Unifier (DAT.Single(DAT.Ctx(cL, fL)), subs) = 
            let 
                val form_app = apply_formL_Unifier(fL, subs)
                val (clist, flist) = ListPair.unzip(apply_ctx_varL_Unifier(cL, subs))
            in 
                DAT.Single(DAT.Ctx(List.concat clist, form_app @ List.concat flist))
            end
        | apply_ctx_struct_Unifier (DAT.Mult(con, DAT.Ctx(cL, fL), ctxStruct), subs) = 
            let 
                val form_app = apply_formL_Unifier(fL, subs)
                val (clist, flist) = ListPair.unzip(apply_ctx_varL_Unifier(cL, subs))
                val new_ctxStruct = apply_ctx_struct_Unifier (ctxStruct, subs)
            in 
                DAT.Mult(con, DAT.Ctx(List.concat clist, form_app @ List.concat flist), new_ctxStruct)
            end
    fun apply_ctx_struct_allUnifiers (ctx_struct, []) = [ctx_struct]
        | apply_ctx_struct_allUnifiers (ctx_struct, subsL) = List.map(fn sb => apply_ctx_struct_Unifier(ctx_struct, sb))subsL


    type seq = DAT.seq
    fun apply_seq_Unifier (DAT.Seq(l, c, r), subs) = DAT.Seq(apply_ctx_struct_Unifier(l, subs), c, apply_ctx_struct_Unifier(r, subs))
    fun apply_seq_allUnifier (sequent, []) = [sequent]
        | apply_seq_allUnifier (sequent, sub::subsL) = List.map(fn sb => apply_seq_Unifier(sequent, sb))subsL


    type dev_tree = DAT.dev_tree
    fun apply_dev_tree_Unifier(DAT.DevTree(id, sq, rq, pq), subs) = 
        let val new_sq = apply_seq_Unifier (sq, subs)
            val new_pq = List.map(fn p => apply_dev_tree_Unifier(p, subs))pq
        in DAT.DevTree(id, new_sq, rq, new_pq) end


    fun compose (DAT.Fs(a,b), sigma) = (DAT.Fs(a, apply_form_Unifier(b, sigma)), DAT.form_eq(a,b))
        | compose (DAT.CVs(a, DAT.Ctx(vls, fls)), sigma) =  let val fls1 = apply_formL_Unifier(fls, sigma)
                                                        val (vls2, fls2) = ListPair.unzip(apply_ctx_varL_Unifier(vls, sigma))
                                                    in 
                                                        (DAT.CVs(a, DAT.Ctx(List.concat vls2, fls1 @ List.concat fls2)), false)
                                                    end
    fun UnifierComposition' (sigma1, []) = sigma1
        | UnifierComposition' ([], sigma2) = sigma2
        | UnifierComposition' (s::sigma1, sigma2) = 
            let val (s', equivalent) = compose(s, sigma2) 
                val sigma1temp = UnifierComposition'(sigma1, sigma2)
                val sigma1new = if equivalent then sigma1temp else (s')::sigma1temp
                val sigma2new = List.filter (fn s2 => not 
                            (List.exists (fn s1 => DAT.sub_prefix_eq(s2, s1)) 
                            sigma2)) (if equivalent then sigma1new else (s')::sigma1new)
            in 
                sigma1new
            end

    fun UnifierComposition (sigma1,sigma2)=
        let
            val sigma2new = List.filter (fn s2 => not 
                            (List.exists (fn s1 => DAT.sub_prefix_eq(s2, s1)) 
                            sigma1)) sigma2
        in
            UnifierComposition'(sigma1,sigma2new)
        end

end
