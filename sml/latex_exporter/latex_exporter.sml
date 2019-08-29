structure latexImpl : EXPORTLATEX = struct

    open datatypesImpl
    open applyunifierImpl

    fun dev_tree_toLatex (DevTree(id, s, NoRule, pq)) = "\\deduce[]{"^(seq_toString s)^"}{"^id^"}"
        | dev_tree_toLatex (DevTree(id, s, RuleName nm, [])) = "\\infer["^nm^"]{"^(seq_toString s)^"}{}"
        | dev_tree_toLatex (DevTree(id, s, RuleName nm, pq)) = 
            let val fst = dev_tree_toLatex (List.hd pq)
                val rest = List.tl(pq)
                val prem_latex = List.foldl(fn (prem, st) => st^" & \\quad"^(dev_tree_toLatex prem))(fst)rest
                val conclusion = "\\infer["^nm^"]{"^(seq_toString s)^"}"
            in conclusion^"{"^prem_latex^"}" end

    fun export_toLatex filename tree =
        let val fd = TextIO.openOut filename
            val packages = 
            "\\documentclass[10pt]{article}\n"^
            "\\usepackage{amsmath}\n"^
            "\\usepackage{amsfonts}\n"^
            "\\usepackage{amssymb}\n"^
            "\\usepackage{proof}\n"
            val latex_tree = "\\begin{document}\n\\begin{align*}\n"^
                (dev_tree_toLatex tree)^"\\end{align*}\n\\end{document}\n"
            val _ = TextIO.output (fd, packages^latex_tree) handle e => (TextIO.closeOut fd; raise e)
            val _ = TextIO.closeOut fd
        in () end

end