// Sequoia Copyright (C) 2020  Zan Naeem
// This program comes with ABSOLUTELY NO WARRANTY; for details see LICENSE.
// This is free software, and you are welcome to redistribute it
// under certain conditions; see LICENSE for details.


function generate(fname, title, next) {
    var content = 
            "\\documentclass[11pt]{article}\n"+
            "\n"+
            "\\usepackage[margin=2.0cm]{geometry}\n"+
            "\\usepackage{proof}\n"+
            "\\usepackage{amsmath,amsthm,amssymb}\n"+
            "\\usepackage{color}\n"+
            "\n"
    if (fname == "LatexTree") {
        content += 
            "\\begin{document}\n"+
            "\n"+
            "\\begin{flushleft}\n"+
            "Tree in "+title+": \n"+
            "\\end{flushleft}\n"+
            "\n"+
            "\\begin{align*}\n"+
            proof_content["tree"]+"\n"+
            "\\end{align*}\n"+
            "\n"+
            "\\begin{flushleft}\n"+
            "Constraints: \n"+
            "\\end{flushleft}\n"+
            "\n"+
            "\\begin{align*}\n"+
            proof_content["constraints"]+"\n"+
            "\\end{align*}\n"+
            "\n"+
            "\\end{document}\n"
    } else if (fname == "Identity_Expansion") {
        var base_cases = ""
        for (var i = 0; i < proof_content["base"].length; i++) {
            base_cases += "\\item\n\\["+proof_content["base"][i]+"\\]\n"
        }
        var inductive_cases = ""
        for (var i = 0; i < proof_content["induct"].length; i++) {
            inductive_cases += "\\item\n\\["+proof_content["induct"][i]+"\\]\n"
        }
        content +=
            "\\newtheorem{theorem}{Theorem}\n"+
            "\n"+
            "\\title{Identity expansion proof for "+title+"}\n"+
            "\\author{Sequoia}\n"+
            "\\date{}\n"+
            "\n"+
            "\\begin{document}\n"+
            "\\maketitle\n"+
            "\n"+
            "\\begin{theorem}\n"+
            "If the identity rules are restricted to atomic formulas, then for any "+
            "proposition $P$ there are proofs of $P \\vdash P$.\n"+ 
            "\\end{theorem}\n"+
            "\n"+
            "\\begin{proof}\n"+
            "\n"+
            "By induction on the structure of formula $P$.\n"+
            "\n"+
            "\\noindent\n"+
            "\\textbf{Base cases}\n"+
            "\n"+
            "\\begin{itemize}\n"+
            base_cases+
            "\\end{itemize}\n"+
            "\n"+
            "\\noindent\n"+
            "\\textbf{Inductive cases}\n"+
            "\n"+
            "Inductive Hypothesis: []"+
            "\n"+
            "\\begin{itemize}\n"+
            inductive_cases+
            "\\end{itemize}\n"+
            "\n"+
            "\\end{proof}\n"+
            "\\end{document}\n"
    } else if (fname == "Weakening_Admissibility") {
        var contexts = ""
        for (var i = 0; i < proof_content["cases"]; i++) {
            cases = ""
            for (var j = 0; j < proof_content["proofs"][i]; j++) {
                cases += "\\item\n\\["+proof_content["cases"][i][j]+"\\]\n"
            }
            contexts +=
                "\\noindent\n"+
                "\\textbf{"+proof_content["cases"][i][0]+"}\n"+
                "\n"+
                "\\begin{itemize}\n"+
                cases+
                "\\end{itemize}\n"+
                "\n"
        }
        content +=
            "\\newtheorem{theorem}{Theorem}\n"+
            "\n"+
            "\\title{Weakening admissibility proof for "+title+"}\n"+
            "\\author{Sequoia}\n"+
            "\\date{}\n"+
            "\n"+
            "\\begin{document}\n"+
            "\\maketitle\n"+
            "\n"+
            "\\begin{theorem}\n"+
            "If $\\Gamma \\vdash \\Delta$, then $\\Gamma, F \\vdash \\Delta$."+
            "\\end{theorem}\n"+
            "\n"+
            "\\begin{proof}\n"+
            "\n"+
            contexts+
            "\n"+
            "\\end{proof}\n"+
            "\\end{document}\n"
    } else if (fname == "Permutability") {
        var rules = ""
        for (var i = 0; i < proof_content["rules"].length; i++) {
            rules += "\\item\n\\["+proof_content["rules"][i]+"\\]\n"
        }
        var trees = ""
        for (var i = 0; i < proof_content["trees"].length; i++) {
            trees += "\\item\n\\["+proof_content["trees"][i]+"\\]\n"
        }
        content +=
            "\\newtheorem{theorem}{Theorem}\n"+
            "\n"+
            "\\title{Permutability proof in "+title+"}\n"+
            "\\author{Sequoia}\n"+
            "\\date{}\n"+
            "\n"+
            "\\begin{document}\n"+
            "\\maketitle\n"+
            "\n"+
            "\\begin{theorem}\n"+
            "Let $T_1$ be the proof tree $\\infer[r_1]{S}{\\infer[r_2]{\\cdots}{\\cdots}}&. "+ 
            "If $T_1$ implies the existence of a proof tree $T_2$ = $\\infer[r_2]{S}{\\infer[r_1]{\\cdots}{\\cdots}}$,"+ 
            "then we say that $r_1$ permutes up $r_2$.\n"+ 
            "\\end{theorem}\n"+
            "\n"+
            "\\begin{proof}\n"+
            "\n"+
            "\\noindent\n"+
            "\\textbf{Trees}\n"+
            "\n"+
            "\\begin{itemize}\n"+
            trees+
            "\\end{itemize}\n"+
            "\n"+
            "\\end{proof}\n"+
            "\\end{document}\n"
    } else if (fname == "Cut_Admissibility") {
        var base_cases = ""
        for (var i = 0; i < proof_content["axiom"].length; i++) {
            base_cases += "\\item\n\\["+proof_content["axiom"][i]+"\\]\n"
        }
        var rank_cases = ""
        for (var i = 0; i < proof_content["rank"].length; i++) {
            rank_cases += "\\item\n\\["+proof_content["rank"][i]+"\\]\n"
        }
        var grade_cases = ""
        for (var i = 0; i < proof_content["grade"].length; i++) {
            grade_cases += "\\item\n\\["+proof_content["grade"][i]+"\\]\n"
        }
        content +=
            "\\newtheorem{theorem}{Theorem}\n"+
            "\n"+
            "\\title{Cut admissibility proof for "+title+"}\n"+
            "\\author{Sequoia}\n"+
            "\\date{}\n"+
            "\n"+
            "\\begin{document}\n"+
            "\\maketitle\n"+
            "\n"+
            "\\begin{theorem}\n"+
            "Any sequent provable using (one of) the cut rule(s) can be proved "+
            "without the use of this rule."+ 
            "\\end{theorem}\n"+
            "\n"+
            "\\begin{proof}\n"+
            "\n"+
            "By induction on the structure of the formula $P$ in the sequent and the size of the tree.\n"+
            "\\n"+
            "\\noindent\n"+
            "\\textbf{Base cases}\n"+
            "\n"+
            "\\begin{itemize}\n"+
            base_cases+
            "\\end{itemize}\n"+
            "\n"+
            "\\noindent\n"+
            "\\textbf{Rank reduction cases}\n"+
            "\n"+
            "Inductive Hypothesis: []"+
            "\n"+
            "\\begin{itemize}\n"+
            rank_cases+
            "\\end{itemize}\n"+
            "\n"+
            "\\noindent\n"+
            "\\textbf{Grade reduction cases}\n"+
            "\n"+
            "Inductive Hypothesis: []"+
            "\n"+
            "\\begin{itemize}\n"+
            grade_cases+
            "\\end{itemize}\n"+
            "\n"+
            "\\end{proof}\n"+
            "\\end{document}\n"
    }
    next(content)
}


function download(fname) {
    $.get("/sequoia/api/calculus/"+calc_id, function(data, status) {
        generate(fname, data.calculus.title, function (content) {
            $.post("/sequoia/generate", {proof: content}, function(data, status) {
                $.get("/sequoia/fetch/"+fname, function(data, status) {
                    window.location = "/sequoia/fetch/"+fname
                })
            })
        })
    })
}
