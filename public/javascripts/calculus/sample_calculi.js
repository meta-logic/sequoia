// Sequoia Copyright (C) 2020  Zan Naeem
// This program comes with ABSOLUTELY NO WARRANTY; for details see LICENSE.
// This is free software, and you are welcome to redistribute it
// under certain conditions; see LICENSE for details.


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
                { "premises" : JSON.stringify([ "" ]), "parsed_prem" : JSON.stringify([ ]), "rule" : "I", "conclusion" : "A \\vdash A", "parsed_conc" : "Seq (Single (Ctx ([], [FormVar (\"A\")])), Con (\"\\vdash\"), Single (Ctx ([], [FormVar (\"A\")])))", "calculus" : id, "connective" : "", "side" : "None", "type" : "Axiom", "cutvar" : "NONE" },
                { "premises" : JSON.stringify([ "\\Gamma_1 \\vdash \\Delta_1, A", "\\Gamma_2, A  \\vdash \\Delta_2" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma_1\")], [])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (NONE,\"\\Delta_1\")], [FormVar (\"A\")])))", "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma_2\")], [FormVar (\"A\")])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (NONE,\"\\Delta_2\")], [])))" ]), "rule" : "Cut", "conclusion" : "\\Gamma_1, \\Gamma_2 \\vdash \\Delta_1, \\Delta_2", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma_1\"), CtxVar (NONE,\"\\Gamma_2\")], [])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (NONE,\"\\Delta_1\"), CtxVar (NONE,\"\\Delta_2\")], [])))", "calculus" : id, "connective" : "", "side" : "None", "type" : "Cut", "cutvar" : "FormVar (\"A\")" },
                { "premises" : JSON.stringify([ "\\Gamma, A \\vdash \\Delta" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [FormVar (\"A\")])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (NONE,\"\\Delta\")], [])))" ]), "rule" : "\\wedge_{L_1}", "conclusion" : "\\Gamma, A  \\wedge B \\vdash \\Delta", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [Form (Con (\"\\wedge\"), [FormVar (\"A\"),FormVar (\"B\")])])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (NONE,\"\\Delta\")], [])))", "calculus" : id, "connective" : "\\wedge", "side" : "Left", "type" : "Logical", "cutvar" : "NONE" },
                { "premises" : JSON.stringify([ "\\Gamma,  B \\vdash \\Delta" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [FormVar (\"B\")])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (NONE,\"\\Delta\")], [])))" ]), "rule" : "\\wedge_{L_2}", "conclusion" : "\\Gamma, A  \\wedge B \\vdash \\Delta", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [Form (Con (\"\\wedge\"), [FormVar (\"A\"),FormVar (\"B\")])])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (NONE,\"\\Delta\")], [])))", "calculus" : id, "connective" : "\\wedge", "side" : "Left", "type" : "Logical", "cutvar" : "NONE" },
                { "premises" : JSON.stringify([ "\\Gamma\\vdash A, \\Delta" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (NONE,\"\\Delta\")], [FormVar (\"A\")])))" ]), "rule" : "\\vee_{R_1}", "conclusion" : "\\Gamma\\vdash A \\vee B, \\Delta", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (NONE,\"\\Delta\")], [Form (Con (\"\\vee\"), [FormVar (\"A\"),FormVar (\"B\")])])))", "calculus" : id, "connective" : "\\vee", "side" : "Right", "type" : "Logical", "cutvar" : "NONE" },
                { "premises" : JSON.stringify([ "\\Gamma \\vdash B, \\Delta" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (NONE,\"\\Delta\")], [FormVar (\"B\")])))" ]), "rule" : "\\vee_{R_2}", "conclusion" : "\\Gamma \\vdash A \\vee B, \\Delta", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (NONE,\"\\Delta\")], [Form (Con (\"\\vee\"), [FormVar (\"A\"),FormVar (\"B\")])])))", "calculus" : id, "connective" : "\\vee", "side" : "Right", "type" : "Logical", "cutvar" : "NONE" },
                { "premises" : JSON.stringify([ "\\Gamma_1, A \\vdash \\Delta_1", "\\Gamma_2, B \\vdash \\Delta_2" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma_1\")], [FormVar (\"A\")])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (NONE,\"\\Delta_1\")], [])))", "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma_2\")], [FormVar (\"B\")])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (NONE,\"\\Delta_2\")], [])))" ]), "rule" : "\\vee_{L}", "conclusion" : "\\Gamma_1, \\Gamma_2, A \\vee B \\vdash \\Delta_1, \\Delta_2", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma_1\"), CtxVar (NONE,\"\\Gamma_2\")], [Form (Con (\"\\vee\"), [FormVar (\"A\"),FormVar (\"B\")])])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (NONE,\"\\Delta_1\"), CtxVar (NONE,\"\\Delta_2\")], [])))", "calculus" : id, "connective" : "\\vee", "side" : "Left", "type" : "Logical", "cutvar" : "NONE" },
                { "premises" : JSON.stringify([ "\\Gamma_1 \\vdash A, \\Delta_1", "\\Gamma_2 \\vdash B, \\Delta_2" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma_1\")], [])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (NONE,\"\\Delta_1\")], [FormVar (\"A\")])))", "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma_2\")], [])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (NONE,\"\\Delta_2\")], [FormVar (\"B\")])))" ]), "rule" : "\\wedge_{R}", "conclusion" : "\\Gamma_1, \\Gamma_2 \\vdash A \\wedge B, \\Delta_1, \\Delta_2", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma_1\"), CtxVar (NONE,\"\\Gamma_2\")], [])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (NONE,\"\\Delta_1\"), CtxVar (NONE,\"\\Delta_2\")], [Form (Con (\"\\wedge\"), [FormVar (\"A\"),FormVar (\"B\")])])))", "calculus" : id, "connective" : "\\wedge", "side" : "Right", "type" : "Logical", "cutvar" : "NONE" },
                { "premises" : JSON.stringify([ "\\Gamma_1 \\vdash A, \\Delta_1", "\\Gamma_2, B \\vdash \\Delta_2" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma_1\")], [])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (NONE,\"\\Delta_1\")], [FormVar (\"A\")])))", "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma_2\")], [FormVar (\"B\")])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (NONE,\"\\Delta_2\")], [])))" ]), "rule" : "\\rightarrow_{L}", "conclusion" : "\\Gamma_1, \\Gamma_2, A \\rightarrow B \\vdash \\Delta_1, \\Delta_2", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma_1\"), CtxVar (NONE,\"\\Gamma_2\")], [Form (Con (\"\\rightarrow\"), [FormVar (\"A\"),FormVar (\"B\")])])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (NONE,\"\\Delta_1\"), CtxVar (NONE,\"\\Delta_2\")], [])))", "calculus" : id, "connective" : "\\rightarrow", "side" : "Left", "type" : "Logical", "cutvar" : "NONE" },
                { "premises" : JSON.stringify([ "\\Gamma, A \\vdash B, \\Delta" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [FormVar (\"A\")])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (NONE,\"\\Delta\")], [FormVar (\"B\")])))" ]), "rule" : "\\rightarrow_{R}", "conclusion" : "\\Gamma \\vdash A \\rightarrow B, \\Delta", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (NONE,\"\\Delta\")], [Form (Con (\"\\rightarrow\"), [FormVar (\"A\"),FormVar (\"B\")])])))", "calculus" : id, "connective" : "\\rightarrow", "side" : "Right", "type" : "Logical", "cutvar" : "NONE" },
                { "premises" : JSON.stringify([ "\\Gamma \\vdash A, \\Delta" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (NONE,\"\\Delta\")], [FormVar (\"A\")])))" ]), "rule" : "\\neg_{L}", "conclusion" : "\\Gamma, \\neg A \\vdash \\Delta", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [Form (Con (\"\\neg\"), [FormVar (\"A\")])])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (NONE,\"\\Delta\")], [])))", "calculus" :  id, "connective" : "\\neg", "side" : "Left", "type" : "Logical", "cutvar" : "NONE" },
                { "premises" : JSON.stringify([ "\\Gamma, A \\vdash  \\Delta" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [FormVar (\"A\")])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (NONE,\"\\Delta\")], [])))" ]), "rule" : "\\neg_{R}", "conclusion" : "\\Gamma \\vdash \\neg A,  \\Delta", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (NONE,\"\\Delta\")], [Form (Con (\"\\neg\"), [FormVar (\"A\")])])))", "calculus" :  id, "connective" : "\\neg", "side" : "Right", "type" : "Logical", "cutvar" : "NONE" },
                { "premises" : JSON.stringify([ "\\Gamma \\vdash \\Delta" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (NONE,\"\\Delta\")], [])))" ]), "rule" : "W_{L}", "conclusion" : "\\Gamma, A \\vdash \\Delta", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [FormVar (\"A\")])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (NONE,\"\\Delta\")], [])))", "calculus" :  id, "connective" : "", "side" : "Left", "type" : "Structural", "cutvar" : "NONE" },
                { "premises" : JSON.stringify([ "\\Gamma \\vdash \\Delta" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (NONE,\"\\Delta\")], [])))" ]), "rule" : "W_{R}", "conclusion" : "\\Gamma \\vdash A, \\Delta", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (NONE,\"\\Delta\")], [FormVar (\"A\")])))", "calculus" :  id, "connective" : "", "side" : "Right", "type" : "Structural", "cutvar" : "NONE" },
                { "premises" : JSON.stringify([ "\\Gamma, A, A \\vdash \\Delta" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [FormVar (\"A\"), FormVar (\"A\")])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (NONE,\"\\Delta\")], [])))" ]), "rule" : "C_{L}", "conclusion" : "\\Gamma, A \\vdash \\Delta", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [FormVar (\"A\")])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (NONE,\"\\Delta\")], [])))", "calculus" :  id, "connective" : "", "side" : "Left", "type" : "Structural", "cutvar" : "NONE" },
                { "premises" : JSON.stringify([ "\\Gamma \\vdash A, A, \\Delta" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (NONE,\"\\Delta\")], [FormVar (\"A\"), FormVar (\"A\")])))" ]), "rule" : "C_{R}", "conclusion" : "\\Gamma \\vdash A, \\Delta", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (NONE,\"\\Delta\")], [FormVar (\"A\")])))", "calculus" :  id, "connective" : "", "side" : "Right", "type" : "Structural", "cutvar" : "NONE" }
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
                { "premises" : JSON.stringify([ "" ]), "parsed_prem" : JSON.stringify([ ]), "rule" : "I", "conclusion" : "A \\vdash A", "parsed_conc" : "Seq (Single (Ctx ([], [FormVar (\"A\")])), Con (\"\\vdash\"), Single (Ctx ([], [FormVar (\"A\")])))", "calculus" : id, "connective" : "", "side" : "None", "type" : "Axiom", "cutvar" : "NONE" },
                { "premises" : JSON.stringify([ "\\Gamma, A \\vdash C" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [FormVar (\"A\")])), Con (\"\\vdash\"), Single (Ctx ([], [FormVar (\"C\")])))" ]), "rule" : "\\wedge_{L_1}", "conclusion" : "\\Gamma, A  \\wedge B \\vdash C", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [Form (Con (\"\\wedge\"), [FormVar (\"A\"),FormVar (\"B\")])])), Con (\"\\vdash\"), Single (Ctx ([], [FormVar (\"C\")])))", "calculus" : id, "connective" : "\\wedge", "side" : "Left", "type" : "Logical", "cutvar" : "NONE" },
                { "premises" : JSON.stringify([ "\\Gamma_1 \\vdash A", "\\Gamma_2, A  \\vdash C" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma_1\")], [])), Con (\"\\vdash\"), Single (Ctx ([], [FormVar (\"A\")])))", "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma_2\")], [FormVar (\"A\")])), Con (\"\\vdash\"), Single (Ctx ([], [FormVar (\"C\")])))" ]), "rule" : "Cut", "conclusion" : "\\Gamma_1, \\Gamma_2 \\vdash C", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma_1\"), CtxVar (NONE,\"\\Gamma_2\")], [])), Con (\"\\vdash\"), Single (Ctx ([], [FormVar (\"C\")])))", "calculus" : id, "connective" : "", "side" : "None", "type" : "Cut", "cutvar" : "FormVar (\"A\")" },
                { "premises" : JSON.stringify([ "\\Gamma,  B \\vdash C" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [FormVar (\"B\")])), Con (\"\\vdash\"), Single (Ctx ([], [FormVar (\"C\")])))" ]), "rule" : "\\wedge_{L_2}", "conclusion" : "\\Gamma, A  \\wedge B \\vdash C", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [Form (Con (\"\\wedge\"), [FormVar (\"A\"),FormVar (\"B\")])])), Con (\"\\vdash\"), Single (Ctx ([], [FormVar (\"C\")])))", "calculus" : id, "connective" : "\\wedge", "side" : "Left", "type" : "Logical", "cutvar" : "NONE" },
                { "premises" : JSON.stringify([ "\\Gamma\\vdash A" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [])), Con (\"\\vdash\"), Single (Ctx ([], [FormVar (\"A\")])))" ]), "rule" : "\\vee_{R_1}", "conclusion" : "\\Gamma\\vdash A \\vee B", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [])), Con (\"\\vdash\"), Single (Ctx ([], [Form (Con (\"\\vee\"), [FormVar (\"A\"),FormVar (\"B\")])])))", "calculus" : id, "connective" : "\\vee", "side" : "Right", "type" : "Logical", "cutvar" : "NONE" },
                { "premises" : JSON.stringify([ "\\Gamma \\vdash B" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [])), Con (\"\\vdash\"), Single (Ctx ([], [FormVar (\"B\")])))" ]), "rule" : "\\vee_{R_2}", "conclusion" : "\\Gamma \\vdash A \\vee B", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [])), Con (\"\\vdash\"), Single (Ctx ([], [Form (Con (\"\\vee\"), [FormVar (\"A\"),FormVar (\"B\")])])))", "calculus" : id, "connective" : "\\vee", "side" : "Right", "type" : "Logical", "cutvar" : "NONE" },
                { "premises" : JSON.stringify([ "\\Gamma_1, A \\vdash C", "\\Gamma_2, B \\vdash C" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma_1\")], [FormVar (\"A\")])), Con (\"\\vdash\"), Single (Ctx ([], [FormVar (\"C\")])))", "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma_2\")], [FormVar (\"B\")])), Con (\"\\vdash\"), Single (Ctx ([], [FormVar (\"C\")])))" ]), "rule" : "\\vee_{L}", "conclusion" : "\\Gamma_1, \\Gamma_2, A \\vee B \\vdash C", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma_1\"), CtxVar (NONE,\"\\Gamma_2\")], [Form (Con (\"\\vee\"), [FormVar (\"A\"),FormVar (\"B\")])])), Con (\"\\vdash\"), Single (Ctx ([], [FormVar (\"C\")])))", "calculus" : id, "connective" : "\\vee", "side" : "Left", "type" : "Logical", "cutvar" : "NONE" },
                { "premises" : JSON.stringify([ "\\Gamma_1 \\vdash A", "\\Gamma_2 \\vdash B" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma_1\")], [])), Con (\"\\vdash\"), Single (Ctx ([], [FormVar (\"A\")])))", "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma_2\")], [])), Con (\"\\vdash\"), Single (Ctx ([], [FormVar (\"B\")])))" ]), "rule" : "\\wedge_{R}", "conclusion" : "\\Gamma_1, \\Gamma_2 \\vdash A \\wedge B", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma_1\"), CtxVar (NONE,\"\\Gamma_2\")], [])), Con (\"\\vdash\"), Single (Ctx ([], [Form (Con (\"\\wedge\"), [FormVar (\"A\"),FormVar (\"B\")])])))", "calculus" : id, "connective" : "\\wedge", "side" : "Right", "type" : "Logical", "cutvar" : "NONE" },
                { "premises" : JSON.stringify([ "\\Gamma_1 \\vdash A", "\\Gamma_2, B \\vdash C" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma_1\")], [])), Con (\"\\vdash\"), Single (Ctx ([], [FormVar (\"A\")])))", "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma_2\")], [FormVar (\"B\")])), Con (\"\\vdash\"), Single (Ctx ([], [FormVar (\"C\")])))" ]), "rule" : "\\rightarrow_{L}", "conclusion" : "\\Gamma_1, \\Gamma_2, A \\rightarrow B \\vdash C", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma_1\"), CtxVar (NONE,\"\\Gamma_2\")], [Form (Con (\"\\rightarrow\"), [FormVar (\"A\"),FormVar (\"B\")])])), Con (\"\\vdash\"), Single (Ctx ([], [FormVar (\"C\")])))", "calculus" : id, "connective" : "\\rightarrow", "side" : "Left", "type" : "Logical", "cutvar" : "NONE" },
                { "premises" : JSON.stringify([ "\\Gamma, A \\vdash B" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [FormVar (\"A\")])), Con (\"\\vdash\"), Single (Ctx ([], [FormVar (\"B\")])))" ]), "rule" : "\\rightarrow_{R}", "conclusion" : "\\Gamma \\vdash A \\rightarrow B", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [])), Con (\"\\vdash\"), Single (Ctx ([], [Form (Con (\"\\rightarrow\"), [FormVar (\"A\"),FormVar (\"B\")])])))", "calculus" : id, "connective" : "\\rightarrow", "side" : "Right", "type" : "Logical", "cutvar" : "NONE" },
                { "premises" : JSON.stringify([ "\\Gamma \\vdash C" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [])), Con (\"\\vdash\"), Single (Ctx ([], [FormVar (\"C\")])))" ]), "rule" : "W_{L}", "conclusion" : "\\Gamma, A \\vdash C", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [FormVar (\"A\")])), Con (\"\\vdash\"), Single (Ctx ([], [FormVar (\"C\")])))", "calculus" : id, "connective" : "", "side" : "Left", "type" : "Structural", "cutvar" : "NONE" },
                { "premises" : JSON.stringify([ "\\Gamma, A, A \\vdash C" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [FormVar (\"A\"), FormVar (\"A\")])), Con (\"\\vdash\"), Single (Ctx ([], [FormVar (\"C\")])))" ]), "rule" : "C_{L}", "conclusion" : "\\Gamma, A \\vdash C", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [FormVar (\"A\")])), Con (\"\\vdash\"), Single (Ctx ([], [FormVar (\"C\")])))", "calculus" : id, "connective" : "", "side" : "Left", "type" : "Structural", "cutvar" : "NONE" }
            ]
        ]
    } else if (name == "S4") { 
        var ret =
        [
            [
                { "symbol" : "B", "type" : "formula variable", "group" : "rule", "calculus" : id },
                { "symbol" : "\\wedge", "type" : "connective", "group" : "rule", "calculus" : id },
                { "symbol" : "A", "type" : "formula variable", "group" : "rule", "calculus" : id },
                { "symbol" : "\\Gamma_1", "type" : "context variable", "group" : "rule", "calculus" : id },
                { "symbol" : "\\vdash", "type" : "sequent sign", "group" : "rule", "calculus" : id },
                { "symbol" : "\\Gamma", "type" : "context variable", "group" : "rule", "calculus" : id },
                { "symbol" : "\\Gamma_2", "type" : "context variable", "group" : "rule", "calculus" : id },
                { "symbol" : "\\Delta", "type" : "context variable", "group" : "rule", "calculus" : id },
                { "symbol" : "\\Rightarrow", "type" : "connective", "group" : "rule", "calculus" : id },
                { "symbol" : "\\square", "type" : "connective", "group" : "rule", "calculus" : id },
                { "symbol" : "\\Delta_1", "type" : "context variable", "group" : "rule", "calculus" : id },
                { "symbol" : "\\Delta_2", "type" : "context variable", "group" : "rule", "calculus" : id },
                { "symbol" : "\\diamond", "type" : "connective", "group" : "rule", "calculus" : id }
            ],
            [
                { "premises" : JSON.stringify([ "\\Gamma, A, B, A \\wedge B \\vdash \\Delta" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [FormVar (\"A\"), FormVar (\"B\"), Form (Con (\"\\wedge\"), [FormVar (\"A\"),FormVar (\"B\")])])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (NONE,\"\\Delta\")], [])))" ]), "rule" : "\\wedge_{L}", "conclusion" : "\\Gamma, A  \\wedge B \\vdash \\Delta", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [Form (Con (\"\\wedge\"), [FormVar (\"A\"),FormVar (\"B\")])])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (NONE,\"\\Delta\")], [])))", "calculus" : id, "connective" : "\\wedge", "type" : "Logical", "side" : "Left", "cutvar" : "NONE" },
                { "premises" : JSON.stringify([ "" ]), "parsed_prem" : JSON.stringify([ ]), "rule" : "I", "conclusion" : "\\Gamma, A \\vdash A, \\Delta", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [FormVar (\"A\")])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (NONE,\"\\Delta\")], [FormVar (\"A\")])))", "calculus" : id, "connective" : "", "type" : "Axiom", "side" : "None", "cutvar" : "NONE" },
                { "premises" : JSON.stringify([ "\\Gamma \\vdash A, \\Delta", "\\Gamma, A  \\vdash \\Delta" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (NONE,\"\\Delta\")], [FormVar (\"A\")])))", "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [FormVar (\"A\")])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (NONE,\"\\Delta\")], [])))" ]), "rule" : "Cut", "conclusion" : "\\Gamma \\vdash \\Delta", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (NONE,\"\\Delta\")], [])))", "calculus" : id, "connective" : "", "type" : "Cut", "side" : "None", "cutvar" : "FormVar (\"A\")" },
                { "premises" : JSON.stringify([ "\\Gamma, A \\vdash B, A \\Rightarrow B, \\Delta" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [FormVar (\"A\")])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (NONE,\"\\Delta\")], [FormVar (\"B\"), Form (Con (\"\\Rightarrow\"), [FormVar (\"A\"),FormVar (\"B\")])])))" ]), "rule" : "\\Rightarrow_{R}", "conclusion" : "\\Gamma \\vdash A \\Rightarrow B, \\Delta", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (NONE,\"\\Delta\")], [Form (Con (\"\\Rightarrow\"), [FormVar (\"A\"),FormVar (\"B\")])])))", "calculus" : id, "connective" : "\\Rightarrow", "type" : "Logical", "side" : "Right", "cutvar" : "NONE" },
                { "premises" : JSON.stringify([ "\\Gamma, A \\Rightarrow B \\vdash A, \\Delta", "\\Gamma, B, A \\Rightarrow B \\vdash \\Delta" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [Form (Con (\"\\Rightarrow\"), [FormVar (\"A\"),FormVar (\"B\")])])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (NONE,\"\\Delta\")], [FormVar (\"A\")])))", "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [FormVar (\"B\"), Form (Con (\"\\Rightarrow\"), [FormVar (\"A\"),FormVar (\"B\")])])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (NONE,\"\\Delta\")], [])))" ]), "rule" : "\\Rightarrow_{L}", "conclusion" : "\\Gamma, A \\Rightarrow B \\vdash \\Delta", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [Form (Con (\"\\Rightarrow\"), [FormVar (\"A\"),FormVar (\"B\")])])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (NONE,\"\\Delta\")], [])))", "calculus" : id, "connective" : "\\Rightarrow", "type" : "Logical", "side" : "Left", "cutvar" : "NONE" },
                { "premises" : JSON.stringify([ "\\Gamma \\vdash A,  A \\wedge B,  \\Delta", "\\Gamma \\vdash B,  A \\wedge B,  \\Delta" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (NONE,\"\\Delta\")], [FormVar (\"A\"), Form (Con (\"\\wedge\"), [FormVar (\"A\"),FormVar (\"B\")])])))", "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (NONE,\"\\Delta\")], [FormVar (\"B\"), Form (Con (\"\\wedge\"), [FormVar (\"A\"),FormVar (\"B\")])])))" ]), "rule" : "\\wedge_{R}", "conclusion" : "\\Gamma \\vdash A \\wedge B, \\Delta", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (NONE,\"\\Delta\")], [Form (Con (\"\\wedge\"), [FormVar (\"A\"),FormVar (\"B\")])])))", "calculus" : id, "connective" : "\\wedge", "type" : "Logical", "side" : "Right", "cutvar" : "NONE" },
                { "premises" : JSON.stringify([ "\\Gamma, \\square A, A \\vdash \\Delta" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [Form (Con (\"\\square\"), [FormVar (\"A\")]), FormVar (\"A\")])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (NONE,\"\\Delta\")], [])))" ]), "rule" : "\\square_{L}", "conclusion" : "\\Gamma, \\square A \\vdash \\Delta", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [Form (Con (\"\\square\"), [FormVar (\"A\")])])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (NONE,\"\\Delta\")], [])))", "calculus" : id, "connective" : "\\square", "side" : "Left", "type" : "Logical", "cutvar" : "NONE" },
                { "premises" : JSON.stringify([ "\\square \\Gamma_1 \\vdash A, \\diamond \\Delta_1" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (SOME(Con (\"\\square\")),\"\\Gamma_1\")], [])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (SOME(Con (\"\\diamond\")),\"\\Delta_1\")], [FormVar (\"A\")])))" ]), "rule" : "\\square_{R}", "conclusion" : "\\square \\Gamma_1, \\Gamma_2 \\vdash \\square A, \\diamond \\Delta_1,  \\Delta_2", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (SOME(Con (\"\\square\")),\"\\Gamma_1\"), CtxVar (NONE,\"\\Gamma_2\")], [])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (SOME(Con (\"\\diamond\")),\"\\Delta_1\"), CtxVar (NONE,\"\\Delta_2\")], [Form (Con (\"\\square\"), [FormVar (\"A\")])])))", "calculus" : id, "connective" : "\\square", "side" : "Right", "type" : "Logical", "cutvar" : "NONE" },
                { "premises" : JSON.stringify([ "\\Gamma \\vdash \\diamond A, A, \\Delta" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (NONE,\"\\Delta\")], [Form (Con (\"\\diamond\"), [FormVar (\"A\")]), FormVar (\"A\")])))" ]), "rule" : "\\diamond_{R}", "conclusion" : "\\Gamma \\vdash \\diamond A, \\Delta", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (NONE,\"\\Delta\")], [Form (Con (\"\\diamond\"), [FormVar (\"A\")])])))", "calculus" : id, "connective" : "\\diamond", "side" : "Right", "type" : "Logical", "cutvar" : "NONE" },
                { "premises" : JSON.stringify([ "\\square \\Gamma_1, A \\vdash \\diamond \\Delta_1" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (SOME(Con (\"\\square\")),\"\\Gamma_1\")], [FormVar (\"A\")])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (SOME(Con (\"\\diamond\")),\"\\Delta_1\")], [])))" ]), "rule" : "\\diamond_{L}", "conclusion" : "\\square \\Gamma_1, \\Gamma_2, \\diamond A \\vdash \\diamond \\Delta_1, \\Delta_2", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (SOME(Con (\"\\square\")),\"\\Gamma_1\"), CtxVar (NONE,\"\\Gamma_2\")], [Form (Con (\"\\diamond\"), [FormVar (\"A\")])])), Con (\"\\vdash\"), Single (Ctx ([CtxVar (SOME(Con (\"\\diamond\")),\"\\Delta_1\"), CtxVar (NONE,\"\\Delta_2\")], [])))", "calculus" : id, "connective" : "\\diamond", "side" : "Left", "type" : "Logical", "cutvar" : "NONE" }
            ]
        ]
    } else if (name == "Lax") { 
        var ret =
        [
            [
                { "symbol" : "B", "type" : "formula variable", "group" : "rule", "calculus" : id },
                { "symbol" : "\\wedge", "type" : "connective", "group" : "rule", "calculus" : id },
                { "symbol" : "A", "type" : "formula variable", "group" : "rule", "calculus" : id },
                { "symbol" : "\\vee", "type" : "connective", "group" : "rule", "calculus" : id },
                { "symbol" : "\\Gamma", "type" : "context variable", "group" : "rule", "calculus" : id },
                { "symbol" : "C", "type" : "formula variable", "group" : "rule", "calculus" : id },
                { "symbol" : "\\supset", "type" : "connective", "group" : "rule", "calculus" : id },
                { "symbol" : "\\longrightarrow", "type" : "sequent sign", "group" : "rule", "calculus" : id },
                { "symbol" : "\\bigcirc", "type" : "connective", "group" : "rule", "calculus" : id }
            ],
            [
                { "premises" : JSON.stringify([ "\\Gamma \\longrightarrow A", "\\Gamma, A  \\longrightarrow C" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [])), Con (\"\\longrightarrow\"), Single (Ctx ([], [FormVar (\"A\")])))", "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [FormVar (\"A\")])), Con (\"\\longrightarrow\"), Single (Ctx ([], [FormVar (\"C\")])))" ]), "rule" : "Cut", "conclusion" : "\\Gamma\\longrightarrow C", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [])), Con (\"\\longrightarrow\"), Single (Ctx ([], [FormVar (\"C\")])))", "calculus" : id, "connective" : "", "type" : "Cut", "side" : "None", "cutvar" : "FormVar (\"A\")" },
                { "premises" : JSON.stringify([ "\\Gamma, A, B, A \\wedge B \\longrightarrow C" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [FormVar (\"A\"), FormVar (\"B\"), Form (Con (\"\\wedge\"), [FormVar (\"A\"),FormVar (\"B\")])])), Con (\"\\longrightarrow\"), Single (Ctx ([], [FormVar (\"C\")])))" ]), "rule" : "\\wedge_{L}", "conclusion" : "\\Gamma, A  \\wedge B \\longrightarrow C", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [Form (Con (\"\\wedge\"), [FormVar (\"A\"),FormVar (\"B\")])])), Con (\"\\longrightarrow\"), Single (Ctx ([], [FormVar (\"C\")])))", "calculus" : id, "connective" : "\\wedge", "type" : "Logical", "side" : "Left", "cutvar" : "NONE" },
                { "premises" : JSON.stringify([ "\\Gamma \\longrightarrow A" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [])), Con (\"\\longrightarrow\"), Single (Ctx ([], [FormVar (\"A\")])))" ]), "rule" : "\\vee_{R_1}", "conclusion" : "\\Gamma \\longrightarrow A \\vee B", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [])), Con (\"\\longrightarrow\"), Single (Ctx ([], [Form (Con (\"\\vee\"), [FormVar (\"A\"),FormVar (\"B\")])])))", "calculus" : id, "connective" : "\\vee", "type" : "Logical", "side" : "Right", "cutvar" : "NONE" },
                { "premises" : JSON.stringify([ "\\Gamma \\longrightarrow B" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [])), Con (\"\\longrightarrow\"), Single (Ctx ([], [FormVar (\"B\")])))" ]), "rule" : "\\vee_{R_2}", "conclusion" : "\\Gamma \\longrightarrow A \\vee B", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [])), Con (\"\\longrightarrow\"), Single (Ctx ([], [Form (Con (\"\\vee\"), [FormVar (\"A\"),FormVar (\"B\")])])))", "calculus" : id, "connective" : "\\vee", "type" : "Logical", "side" : "Right", "cutvar" : "NONE" },
                { "premises" : JSON.stringify([ "\\Gamma \\longrightarrow A", "\\Gamma \\longrightarrow B" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [])), Con (\"\\longrightarrow\"), Single (Ctx ([], [FormVar (\"A\")])))", "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [])), Con (\"\\longrightarrow\"), Single (Ctx ([], [FormVar (\"B\")])))" ]), "rule" : "\\wedge_{R}", "conclusion" : "\\Gamma \\longrightarrow A \\wedge B", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [])), Con (\"\\longrightarrow\"), Single (Ctx ([], [Form (Con (\"\\wedge\"), [FormVar (\"A\"),FormVar (\"B\")])])))", "calculus" : id, "connective" : "\\wedge", "type" : "Logical", "side" : "Right", "cutvar" : "NONE" },
                { "premises" : JSON.stringify([ "\\Gamma \\longrightarrow A", "\\Gamma, B, A \\supset B \\longrightarrow C" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [])), Con (\"\\longrightarrow\"), Single (Ctx ([], [FormVar (\"A\")])))", "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [FormVar (\"B\"), Form (Con (\"\\supset\"), [FormVar (\"A\"),FormVar (\"B\")])])), Con (\"\\longrightarrow\"), Single (Ctx ([], [FormVar (\"C\")])))" ]), "rule" : "\\supset_L", "conclusion" : "\\Gamma, A \\supset B \\longrightarrow C", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [Form (Con (\"\\supset\"), [FormVar (\"A\"),FormVar (\"B\")])])), Con (\"\\longrightarrow\"), Single (Ctx ([], [FormVar (\"C\")])))", "calculus" : id, "connective" : "\\supset", "type" : "Logical", "side" : "Left", "cutvar" : "NONE" },
                { "premises" : JSON.stringify([ "\\Gamma, A \\longrightarrow B" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [FormVar (\"A\")])), Con (\"\\longrightarrow\"), Single (Ctx ([], [FormVar (\"B\")])))" ]), "rule" : "\\supset_{R}", "conclusion" : "\\Gamma \\longrightarrow A \\supset B", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [])), Con (\"\\longrightarrow\"), Single (Ctx ([], [Form (Con (\"\\supset\"), [FormVar (\"A\"),FormVar (\"B\")])])))", "calculus" : id, "connective" : "\\supset", "type" : "Logical", "side" : "Right", "cutvar" : "NONE" },
                { "premises" : JSON.stringify([ "\\Gamma, \\bigcirc A, A \\longrightarrow  \\bigcirc B" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [Form (Con (\"\\bigcirc\"), [FormVar (\"A\")]), FormVar (\"A\")])), Con (\"\\longrightarrow\"), Single (Ctx ([], [Form (Con (\"\\bigcirc\"), [FormVar (\"B\")])])))" ]), "rule" : "\\bigcirc_{L}", "conclusion" : "\\Gamma, \\bigcirc A \\longrightarrow  \\bigcirc B", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [Form (Con (\"\\bigcirc\"), [FormVar (\"A\")])])), Con (\"\\longrightarrow\"), Single (Ctx ([], [Form (Con (\"\\bigcirc\"), [FormVar (\"B\")])])))", "calculus" : id, "connective" : "\\bigcirc", "type" : "Logical", "side" : "Left", "cutvar" : "NONE" },
                { "premises" : JSON.stringify([ "\\Gamma \\longrightarrow A" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [])), Con (\"\\longrightarrow\"), Single (Ctx ([], [FormVar (\"A\")])))" ]), "rule" : "\\bigcirc_{R}", "conclusion" : "\\Gamma \\longrightarrow \\bigcirc A", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [])), Con (\"\\longrightarrow\"), Single (Ctx ([], [Form (Con (\"\\bigcirc\"), [FormVar (\"A\")])])))", "calculus" : id, "connective" : "\\bigcirc", "type" : "Logical", "side" : "Right", "cutvar" : "NONE" },
                { "premises" : JSON.stringify([ "" ]), "parsed_prem" : JSON.stringify([ ]), "rule" : "I", "conclusion" : "\\Gamma, A \\longrightarrow A", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [FormVar (\"A\")])), Con (\"\\longrightarrow\"), Single (Ctx ([], [FormVar (\"A\")])))", "calculus" : id, "connective" : "", "type" : "Axiom", "side" : "None", "cutvar" : "NONE" },
                { "premises" : JSON.stringify([ "\\Gamma, A, A \\vee B \\longrightarrow C", "\\Gamma, B, A \\vee B \\longrightarrow C" ]), "parsed_prem" : JSON.stringify([ "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [FormVar (\"A\"), Form (Con (\"\\vee\"), [FormVar (\"A\"),FormVar (\"B\")])])), Con (\"\\longrightarrow\"), Single (Ctx ([], [FormVar (\"C\")])))", "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [FormVar (\"B\"), Form (Con (\"\\vee\"), [FormVar (\"A\"),FormVar (\"B\")])])), Con (\"\\longrightarrow\"), Single (Ctx ([], [FormVar (\"C\")])))" ]), "rule" : "\\vee_{L}", "conclusion" : "\\Gamma, A \\vee B \\longrightarrow C", "parsed_conc" : "Seq (Single (Ctx ([CtxVar (NONE,\"\\Gamma\")], [Form (Con (\"\\vee\"), [FormVar (\"A\"),FormVar (\"B\")])])), Con (\"\\longrightarrow\"), Single (Ctx ([], [FormVar (\"C\")])))", "calculus" : id, "connective" : "\\vee", "type" : "Logical", "side" : "Left", "cutvar" : "NONE" }
            ]
        ]
    }
    return ret
}