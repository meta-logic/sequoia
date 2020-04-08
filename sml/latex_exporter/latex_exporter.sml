(*  Sequoia  Copyright (C) 2020  Zan Naeem
    This program comes with ABSOLUTELY NO WARRANTY; for details type `show w'.
    This is free software, and you are welcome to redistribute it
    under certain conditions; type `show c' for details.
*)

structure latexImpl : EXPORTLATEX = struct

    structure Dat = datatypesImpl
    structure D = Dat

    type der_tree = Dat.der_tree

    structure App = applyunifierImpl

    fun der_tree_toLatex (D.DerTree(id, s, NONE, pq)) = "\\deduce[]{"^(D.seq_toString s)^"}{"^id^"}"
        | der_tree_toLatex (D.DerTree(id, s, SOME nm, [])) = "\\infer["^nm^"]{"^(D.seq_toString s)^"}{}"
        | der_tree_toLatex (D.DerTree(id, s, SOME nm, pq)) = 
            let val fst = der_tree_toLatex (List.hd pq)
                val rest = List.tl(pq)
                val prem_latex = List.foldl(fn (prem, st) => st^" & \\quad"^(der_tree_toLatex prem))(fst)rest
                val conclusion = "\\infer["^nm^"]{"^(D.seq_toString s)^"}"
            in conclusion^"{"^prem_latex^"}" end

    fun der_tree_toLatex2 (D.DerTree(id, s, NONE, pq)) = "\\cfrac{"^id^"}{"^(D.seq_toString s)^"} "
        | der_tree_toLatex2 (D.DerTree(id, s, SOME nm, [])) = "\\cfrac{}{"^(D.seq_toString s)^"} "^nm
        | der_tree_toLatex2 (D.DerTree(id, s, SOME nm, pq)) = 
            let val fst = der_tree_toLatex2 (List.hd pq)
                val rest = List.tl(pq)
                val prem_latex = List.foldl(fn (prem, st) => st^" \\quad \\quad "^(der_tree_toLatex2 prem))(fst)rest
                val conclusion = D.seq_toString s
            in "\\cfrac{"^prem_latex^"}{"^conclusion^"} "^nm end

    fun export_string_toLatex filename str = 
        let
            val fd = TextIO.openOut filename
            val packages = 
            "\\documentclass[10pt]{article}\n"^
            "\\usepackage{amsmath}\n"^
            "\\usepackage{amsfonts}\n"^
            "\\usepackage{amssymb}\n"^
            "\\usepackage{proof}\n"^
            "\\usepackage{latexsym}\n"
            val document = "\\begin{document}\n\\begin{align*}\n"^
                str^"\\end{align*}\n\\end{document}\n"
            val _ = TextIO.output (fd, packages^document) handle e => (TextIO.closeOut fd; raise e)
            val _ = TextIO.closeOut fd
        in
            ()
        end

    fun export_toLatex filename tree =
        let val fd = TextIO.openOut filename
            val packages = 
            "\\documentclass[10pt]{article}\n"^
            "\\usepackage{amsmath}\n"^
            "\\usepackage{amsfonts}\n"^
            "\\usepackage{amssymb}\n"^
            "\\usepackage{proof}\n"^
            "\\usepackage{latexsym}\n"
            val latex_tree = "\\begin{document}\n\\begin{align*}\n"^
                (der_tree_toLatex tree)^"\\end{align*}\n\\end{document}\n"
            val _ = TextIO.output (fd, packages^latex_tree) handle e => (TextIO.closeOut fd; raise e)
            val _ = TextIO.closeOut fd
        in () end

end