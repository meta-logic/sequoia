function sample_calc(name, id) {
    if (name == "LK") {
        var ret =
        [
            [
                { "symbol" : "A", "type" : "formula variable", "group" : "rule", "calculus" :  id },
                { "symbol" : "B", "type" : "formula variable", "group" : "rule", "calculus" :  id },
                { "symbol" : "\\wedge", "type" : "connective", "group" : "rule", "calculus" :  id },
                { "symbol" : "\\vee", "type" : "connective", "group" : "rule", "calculus" :  id },
                { "symbol" : "\\rightarrow", "type" : "connective", "group" : "rule", "calculus" :  id },
                { "symbol" : "\\neg", "type" : "connective", "group" : "rule", "calculus" :  id },
                { "symbol" : "\\vdash", "type" : "sequent sign", "group" : "rule", "calculus" :  id },
                { "symbol" : "\\Gamma", "type" : "context variable", "group" : "rule", "calculus" :  id },
                { "symbol" : "\\Gamma_1", "type" : "context variable", "group" : "rule", "calculus" :  id },
                { "symbol" : "\\Gamma_2", "type" : "context variable", "group" : "rule", "calculus" :  id },
                { "symbol" : "\\Delta", "type" : "context variable", "group" : "rule", "calculus" :  id },
                { "symbol" : "\\Delta_1", "type" : "context variable", "group" : "rule", "calculus" :  id },
                { "symbol" : "\\Delta_2", "type" : "context variable", "group" : "rule", "calculus" :  id }
            ],
            [
                { "premises" : JSON.stringify([ "" ]), "parsed_prem" : JSON.stringify([ ]), "rule" : "I", "conclusion" : "A \\vdash A", "parsed_conc" : "Seq (Single (Ctx ([], [FormVar (\"A\")])), Con (\"\\vdash\"), Single (Ctx ([], [FormVar (\"A\")])))", "calculus" : id, "connective" : "", "side" : "None", "type" : "Axiom" },
                { "premises" : JSON.stringify([ "\\Gamma_1 \\vdash \\Delta_1, A", "\\Gamma_2, A  \\vdash \\Delta_2" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (\"\\Gamma_1\")], [])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (\"\\Delta_1\")], [FormVar (\"A\")])))", "Seq (Single (Ctx ([CtxVar (\"\\Gamma_2\")], [FormVar (\"A\")])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (\"\\Delta_2\")], [])))" ]), "rule" : "Cut", "conclusion" : "\\Gamma_1, \\Gamma_2 \\vdash \\Delta_1, \\Delta_2", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (\"\\Gamma_1\"), CtxVar (\"\\Gamma_2\")], [])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (\"\\Delta_1\"), CtxVar (\"\\Delta_2\")], [])))", "calculus" : id, "connective" : "", "side" : "None", "type" : "Cut" },
                { "premises" : JSON.stringify([ "\\Gamma, A \\vdash \\Delta" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (\"\\Gamma\")], [FormVar (\"A\")])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (\"\\Delta\")], [])))" ]), "rule" : "\\wedge_{L_1}", "conclusion" : "\\Gamma, A  \\wedge B \\vdash \\Delta", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (\"\\Gamma\")], [Form (Con (\"\\wedge\"), [FormVar (\"A\"),FormVar (\"B\")])])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (\"\\Delta\")], [])))", "calculus" : id, "connective" : "\\wedge", "side" : "Left", "type" : "Logical" },
                { "premises" : JSON.stringify([ "\\Gamma,  B \\vdash \\Delta" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (\"\\Gamma\")], [FormVar (\"B\")])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (\"\\Delta\")], [])))" ]), "rule" : "\\wedge_{L_2}", "conclusion" : "\\Gamma, A  \\wedge B \\vdash \\Delta", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (\"\\Gamma\")], [Form (Con (\"\\wedge\"), [FormVar (\"A\"),FormVar (\"B\")])])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (\"\\Delta\")], [])))", "calculus" : id, "connective" : "\\wedge", "side" : "Left", "type" : "Logical" },
                { "premises" : JSON.stringify([ "\\Gamma\\vdash A, \\Delta" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (\"\\Gamma\")], [])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (\"\\Delta\")], [FormVar (\"A\")])))" ]), "rule" : "\\vee_{R_1}", "conclusion" : "\\Gamma\\vdash A \\vee B, \\Delta", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (\"\\Gamma\")], [])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (\"\\Delta\")], [Form (Con (\"\\vee\"), [FormVar (\"A\"),FormVar (\"B\")])])))", "calculus" : id, "connective" : "\\vee", "side" : "Right", "type" : "Logical"},
                { "premises" : JSON.stringify([ "\\Gamma \\vdash B, \\Delta" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (\"\\Gamma\")], [])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (\"\\Delta\")], [FormVar (\"B\")])))" ]), "rule" : "\\vee_{R_2}", "conclusion" : "\\Gamma \\vdash A \\vee B, \\Delta", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (\"\\Gamma\")], [])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (\"\\Delta\")], [Form (Con (\"\\vee\"), [FormVar (\"A\"),FormVar (\"B\")])])))", "calculus" : id, "connective" : "\\vee", "side" : "Right", "type" : "Logical"},
                { "premises" : JSON.stringify([ "\\Gamma_1, A \\vdash \\Delta_1", "\\Gamma_2, B \\vdash \\Delta_2" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (\"\\Gamma_1\")], [FormVar (\"A\")])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (\"\\Delta_1\")], [])))", "Seq (Single (Ctx ([CtxVar (\"\\Gamma_2\")], [FormVar (\"B\")])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (\"\\Delta_2\")], [])))" ]), "rule" : "\\vee_L", "conclusion" : "\\Gamma_1, \\Gamma_2, A \\vee B \\vdash \\Delta_1, \\Delta_2", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (\"\\Gamma_1\"), CtxVar (\"\\Gamma_2\")], [Form (Con (\"\\vee\"), [FormVar (\"A\"),FormVar (\"B\")])])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (\"\\Delta_1\"), CtxVar (\"\\Delta_2\")], [])))", "calculus" : id, "connective" : "\\vee", "side" : "Left", "type" : "Logical"},
                { "premises" : JSON.stringify([ "\\Gamma_1 \\vdash A, \\Delta_1", "\\Gamma_2 \\vdash B, \\Delta_2" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (\"\\Gamma_1\")], [])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (\"\\Delta_1\")], [FormVar (\"A\")])))", "Seq (Single (Ctx ([CtxVar (\"\\Gamma_2\")], [])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (\"\\Delta_2\")], [FormVar (\"B\")])))" ]), "rule" : "\\wedge_R", "conclusion" : "\\Gamma_1, \\Gamma_2 \\vdash A \\wedge B, \\Delta_1, \\Delta_2", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (\"\\Gamma_1\"), CtxVar (\"\\Gamma_2\")], [])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (\"\\Delta_1\"), CtxVar (\"\\Delta_2\")], [Form (Con (\"\\wedge\"), [FormVar (\"A\"),FormVar (\"B\")])])))", "calculus" : id, "connective" : "\\wedge", "side" : "Right", "type" : "Logical"},
                { "premises" : JSON.stringify([ "\\Gamma_1 \\vdash A, \\Delta_1", "\\Gamma_2, B \\vdash \\Delta_2" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (\"\\Gamma_1\")], [])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (\"\\Delta_1\")], [FormVar (\"A\")])))", "Seq (Single (Ctx ([CtxVar (\"\\Gamma_2\")], [FormVar (\"B\")])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (\"\\Delta_2\")], [])))" ]), "rule" : "\\rightarrow_L", "conclusion" : "\\Gamma_1, \\Gamma_2, A \\rightarrow B \\vdash \\Delta_1, \\Delta_2", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (\"\\Gamma_1\"), CtxVar (\"\\Gamma_2\")], [Form (Con (\"\\rightarrow\"), [FormVar (\"A\"),FormVar (\"B\")])])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (\"\\Delta_1\"), CtxVar (\"\\Delta_2\")], [])))", "calculus" : id, "connective" : "\\rightarrow", "side" : "Left", "type" : "Logical"},
                { "premises" : JSON.stringify([ "\\Gamma, A \\vdash B, \\Delta" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (\"\\Gamma\")], [FormVar (\"A\")])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (\"\\Delta\")], [FormVar (\"B\")])))" ]), "rule" : "\\rightarrow_R", "conclusion" : "\\Gamma \\vdash A \\rightarrow B, \\Delta", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (\"\\Gamma\")], [])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (\"\\Delta\")], [Form (Con (\"\\rightarrow\"), [FormVar (\"A\"),FormVar (\"B\")])])))", "calculus" : id, "connective" : "\\rightarrow", "side" : "Right", "type" : "Logical"},
                { "premises" : JSON.stringify([ "\\Gamma \\vdash A, \\Delta" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (\"\\Gamma\")], [])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (\"\\Delta\")], [FormVar (\"A\")])))" ]), "rule" : "\\neg_L", "conclusion" : "\\Gamma, \\neg A \\vdash \\Delta", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (\"\\Gamma\")], [Form (Con (\"\\neg\"), [FormVar (\"A\")])])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (\"\\Delta\")], [])))", "calculus" :  id, "connective" : "\\neg", "side" : "Left", "type" : "Logical"},
                { "premises" : JSON.stringify([ "\\Gamma, A \\vdash  \\Delta" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (\"\\Gamma\")], [FormVar (\"A\")])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (\"\\Delta\")], [])))" ]), "rule" : "\\neg_R", "conclusion" : "\\Gamma \\vdash \\neg A,  \\Delta", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (\"\\Gamma\")], [])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (\"\\Delta\")], [Form (Con (\"\\neg\"), [FormVar (\"A\")])])))", "calculus" :  id, "connective" : "\\neg", "side" : "Right", "type" : "Logical"},
                { "premises" : JSON.stringify([ "\\Gamma \\vdash \\Delta" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (\"\\Gamma\")], [])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (\"\\Delta\")], [])))" ]), "rule" : "W_L", "conclusion" : "\\Gamma, A \\vdash \\Delta", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (\"\\Gamma\")], [FormVar (\"A\")])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (\"\\Delta\")], [])))", "calculus" :  id, "connective" : "", "side" : "Left", "type" : "Structural"},
                { "premises" : JSON.stringify([ "\\Gamma \\vdash \\Delta" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (\"\\Gamma\")], [])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (\"\\Delta\")], [])))" ]), "rule" : "W_R", "conclusion" : "\\Gamma \\vdash A, \\Delta", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (\"\\Gamma\")], [])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (\"\\Delta\")], [FormVar (\"A\")])))", "calculus" :  id, "connective" : "", "side" : "Right", "type" : "Structural"},
                { "premises" : JSON.stringify([ "\\Gamma, A, A \\vdash \\Delta" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (\"\\Gamma\")], [FormVar (\"A\"), FormVar (\"A\")])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (\"\\Delta\")], [])))" ]), "rule" : "C_L", "conclusion" : "\\Gamma, A \\vdash \\Delta", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (\"\\Gamma\")], [FormVar (\"A\")])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (\"\\Delta\")], [])))", "calculus" :  id, "connective" : "", "side" : "Left", "type" : "Structural"},
                { "premises" : JSON.stringify([ "\\Gamma \\vdash A, A, \\Delta" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (\"\\Gamma\")], [])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (\"\\Delta\")], [FormVar (\"A\"), FormVar (\"A\")])))" ]), "rule" : "C_R", "conclusion" : "\\Gamma \\vdash A, \\Delta", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (\"\\Gamma\")], [])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (\"\\Delta\")], [FormVar (\"A\")])))", "calculus" :  id, "connective" : "", "side" : "Right", "type" : "Structural"}
            ]
        ]
    } else if (name == "LJ") { 
        var ret =
        [
            [
                { "symbol" : "B", "type" : "formula variable", "group" : "rule", "calculus" : id },
                { "symbol" : "A", "type" : "formula variable", "group" : "rule", "calculus" : id },
                { "symbol" : "\\wedge", "type" : "connective", "group" : "rule", "calculus" : id },
                { "symbol" : "\\vee", "type" : "connective", "group" : "rule", "calculus" : id },
                { "symbol" : "\\rightarrow", "type" : "connective", "group" : "rule", "calculus" : id },
                { "symbol" : "\\vdash", "type" : "sequent sign", "group" : "rule", "calculus" : id },
                { "symbol" : "\\Gamma", "type" : "context variable", "group" : "rule", "calculus" : id },
                { "symbol" : "\\Gamma_2", "type" : "context variable", "group" : "rule", "calculus" : id },
                { "symbol" : "\\Gamma_1", "type" : "context variable", "group" : "rule", "calculus" : id },
                { "symbol" : "C", "type" : "formula variable", "group" : "rule", "calculus" : id }
            ],
            [
                { "premises" : JSON.stringify([ "" ]), "parsed_prem" : JSON.stringify([ ]), "rule" : "I", "conclusion" : "A \\vdash A", "parsed_conc" : "Seq (Single (Ctx ([], [FormVar (\"A\")])), Con (\"\\vdash\"), Single (Ctx ([], [FormVar (\"A\")])))", "calculus" : id, "connective" : "", "side" : "None", "type" : "Axiom"},
                { "premises" : JSON.stringify([ "\\Gamma, A \\vdash C" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (\"\\Gamma\")], [FormVar (\"A\")])), Con (\"\\vdash\"), Single (Ctx ([], [FormVar (\"C\")])))" ]), "rule" : "\\wedge_{L_1}", "conclusion" : "\\Gamma, A  \\wedge B \\vdash C", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (\"\\Gamma\")], [Form (Con (\"\\wedge\"), [FormVar (\"A\"),FormVar (\"B\")])])), Con (\"\\vdash\"), Single (Ctx ([], [FormVar (\"C\")])))", "calculus" : id, "connective" : "\\wedge", "side" : "Left", "type" : "Logical" },
                { "premises" : JSON.stringify([ "\\Gamma_1 \\vdash A", "\\Gamma_2, A  \\vdash C" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (\"\\Gamma_1\")], [])), Con (\"\\vdash\"), Single (Ctx ([], [FormVar (\"A\")])))", "Seq (Single (Ctx ([CtxVar (\"\\Gamma_2\")], [FormVar (\"A\")])), Con (\"\\vdash\"), Single (Ctx ([], [FormVar (\"C\")])))" ]), "rule" : "Cut", "conclusion" : "\\Gamma_1, \\Gamma_2 \\vdash C", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (\"\\Gamma_1\"), CtxVar (\"\\Gamma_2\")], [])), Con (\"\\vdash\"), Single (Ctx ([], [FormVar (\"C\")])))", "calculus" : id, "connective" : "", "side" : "None", "type" : "Cut" },
                { "premises" : JSON.stringify([ "\\Gamma,  B \\vdash C" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (\"\\Gamma\")], [FormVar (\"B\")])), Con (\"\\vdash\"), Single (Ctx ([], [FormVar (\"C\")])))" ]), "rule" : "\\wedge_{L_2}", "conclusion" : "\\Gamma, A  \\wedge B \\vdash C", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (\"\\Gamma\")], [Form (Con (\"\\wedge\"), [FormVar (\"A\"),FormVar (\"B\")])])), Con (\"\\vdash\"), Single (Ctx ([], [FormVar (\"C\")])))", "calculus" : id, "connective" : "\\wedge", "side" : "Left", "type" : "Logical" },
                { "premises" : JSON.stringify([ "\\Gamma\\vdash A" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (\"\\Gamma\")], [])), Con (\"\\vdash\"), Single (Ctx ([], [FormVar (\"A\")])))" ]), "rule" : "\\vee_{R_1}", "conclusion" : "\\Gamma\\vdash A \\vee B", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (\"\\Gamma\")], [])), Con (\"\\vdash\"), Single (Ctx ([], [Form (Con (\"\\vee\"), [FormVar (\"A\"),FormVar (\"B\")])])))", "calculus" : id, "connective" : "\\vee", "side" : "Right", "type" : "Logical" },
                { "premises" : JSON.stringify([ "\\Gamma \\vdash B" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (\"\\Gamma\")], [])), Con (\"\\vdash\"), Single (Ctx ([], [FormVar (\"B\")])))" ]), "rule" : "\\vee_{R_2}", "conclusion" : "\\Gamma \\vdash A \\vee B", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (\"\\Gamma\")], [])), Con (\"\\vdash\"), Single (Ctx ([], [Form (Con (\"\\vee\"), [FormVar (\"A\"),FormVar (\"B\")])])))", "calculus" : id, "connective" : "\\vee", "side" : "Right", "type" : "Logical" },
                { "premises" : JSON.stringify([ "\\Gamma_1, A \\vdash C", "\\Gamma_2, B \\vdash C" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (\"\\Gamma_1\")], [FormVar (\"A\")])), Con (\"\\vdash\"), Single (Ctx ([], [FormVar (\"C\")])))", "Seq (Single (Ctx ([CtxVar (\"\\Gamma_2\")], [FormVar (\"B\")])), Con (\"\\vdash\"), Single (Ctx ([], [FormVar (\"C\")])))" ]), "rule" : "\\vee_L", "conclusion" : "\\Gamma_1, \\Gamma_2, A \\vee B \\vdash C", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (\"\\Gamma_1\"), CtxVar (\"\\Gamma_2\")], [Form (Con (\"\\vee\"), [FormVar (\"A\"),FormVar (\"B\")])])), Con (\"\\vdash\"), Single (Ctx ([], [FormVar (\"C\")])))", "calculus" : id, "connective" : "\\vee", "side" : "Left", "type" : "Logical" },
                { "premises" : JSON.stringify([ "\\Gamma_1 \\vdash A", "\\Gamma_2 \\vdash B" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (\"\\Gamma_1\")], [])), Con (\"\\vdash\"), Single (Ctx ([], [FormVar (\"A\")])))", "Seq (Single (Ctx ([CtxVar (\"\\Gamma_2\")], [])), Con (\"\\vdash\"), Single (Ctx ([], [FormVar (\"B\")])))" ]), "rule" : "\\wedge_R", "conclusion" : "\\Gamma_1, \\Gamma_2 \\vdash A \\wedge B", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (\"\\Gamma_1\"), CtxVar (\"\\Gamma_2\")], [])), Con (\"\\vdash\"), Single (Ctx ([], [Form (Con (\"\\wedge\"), [FormVar (\"A\"),FormVar (\"B\")])])))", "calculus" : id, "connective" : "\\wedge", "side" : "Right", "type" : "Logical" },
                { "premises" : JSON.stringify([ "\\Gamma_1 \\vdash A", "\\Gamma_2, B \\vdash C" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (\"\\Gamma_1\")], [])), Con (\"\\vdash\"), Single (Ctx ([], [FormVar (\"A\")])))", "Seq (Single (Ctx ([CtxVar (\"\\Gamma_2\")], [FormVar (\"B\")])), Con (\"\\vdash\"), Single (Ctx ([], [FormVar (\"C\")])))" ]), "rule" : "\\rightarrow_L", "conclusion" : "\\Gamma_1, \\Gamma_2, A \\rightarrow B \\vdash C", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (\"\\Gamma_1\"), CtxVar (\"\\Gamma_2\")], [Form (Con (\"\\rightarrow\"), [FormVar (\"A\"),FormVar (\"B\")])])), Con (\"\\vdash\"), Single (Ctx ([], [FormVar (\"C\")])))", "calculus" : id, "connective" : "\\rightarrow", "side" : "Left", "type" : "Logical" },
                { "premises" : JSON.stringify([ "\\Gamma, A \\vdash B" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (\"\\Gamma\")], [FormVar (\"A\")])), Con (\"\\vdash\"), Single (Ctx ([], [FormVar (\"B\")])))" ]), "rule" : "\\rightarrow_R", "conclusion" : "\\Gamma \\vdash A \\rightarrow B", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (\"\\Gamma\")], [])), Con (\"\\vdash\"), Single (Ctx ([], [Form (Con (\"\\rightarrow\"), [FormVar (\"A\"),FormVar (\"B\")])])))", "calculus" : id, "connective" : "\\rightarrow", "side" : "Right", "type" : "Logical" },
                { "premises" : JSON.stringify([ "\\Gamma \\vdash C" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (\"\\Gamma\")], [])), Con (\"\\vdash\"), Single (Ctx ([], [FormVar (\"C\")])))" ]), "rule" : "W_L", "conclusion" : "\\Gamma, A \\vdash C", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (\"\\Gamma\")], [FormVar (\"A\")])), Con (\"\\vdash\"), Single (Ctx ([], [FormVar (\"C\")])))", "calculus" : id, "connective" : "", "side" : "Left", "type" : "Structural" },
                { "premises" : JSON.stringify([ "\\Gamma, A, A \\vdash C" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (\"\\Gamma\")], [FormVar (\"A\"), FormVar (\"A\")])), Con (\"\\vdash\"), Single (Ctx ([], [FormVar (\"C\")])))" ]), "rule" : "C_L", "conclusion" : "\\Gamma, A \\vdash C", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (\"\\Gamma\")], [FormVar (\"A\")])), Con (\"\\vdash\"), Single (Ctx ([], [FormVar (\"C\")])))", "calculus" : id, "connective" : "", "side" : "Left", "type" : "Structural" }
            ]
        ]
    }
    return ret
}