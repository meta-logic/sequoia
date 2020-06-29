// Sequoia Copyright (C) 2020  Zan Naeem
// This program comes with ABSOLUTELY NO WARRANTY; for details see LICENSE.
// This is free software, and you are welcome to redistribute it
// under certain conditions; see LICENSE for details.


function generate(fname, title, next) {
    var content = ""
    if (fname == "LatexTree") {
        content = 
            "\\documentclass[11pt]{article}\n"+
            "\n"+
            "\\usepackage[margin=2.0cm]{geometry}\n"+
            "\\usepackage{proof}\n"+
            "\\usepackage{amsmath,amsthm,amssymb}\n"+
            "\\usepackage{color}\n"+
            "\n"+
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
            "\\\\$"+proof_content["constraints"]+"$\n"+
            "\\end{flushleft}\n"+
            "\n"+
            "\\end{document}\n"
    } else if (fnam == "Identity_expansion") {
        content =
            "\\documentclass[11pt]{article}\n"+
            "\\n"+
            "\\usepackage[margin=2.0cm]{geometry}\n"+
            "\\usepackage{proof}\n"+
            "\\usepackage{amsmath,amsthm,amssymb}\n"+
            "\\usepackage{color}\n"+
            "\n"+
            "\\newtheorem{theorem}{Theorem}\n"+
            "\n"+
            "\\title{Identity expansion proof for LJ}\n"+
            "\\author{Sequoia}\n"+
            "\\date{}\n"+
            "\n"+
            "\\begin{document}\n"+
            "\\maketitle\n"+
            "\n"+
            "\\begin{theorem}\n"+
            "If the identity rules are restricted to atomic formulas, then for any"+
            "proposition $P$ there are proofs of $P \vdash P$.\n"+ 
            "\\end{theorem}\n"+
            "\n"+
            "\\begin{proof}\n"+
            "\n"+
            "By induction on the structure of formula $P$.\n"+
            "\\n"+
            "\\noindent\n"+
            "\\textbf{Base cases}\n"+
            "\n"+
            "\\begin{itemize}\n"+
            // "\item\n"+
            //     "proof_content[base]"
            "\\end{itemize}\n"+
            "\n"+
            "\\noindent\n"+
            "\\textbf{Inductive cases}\n"+
            "\n"+
            // For some formulas $A$ and $B$, it is the case that
            // $\Gamma, A \vdash A$ and $\Gamma, B \vdash B$.
            "\n"+
            "\\begin{itemize}\n"+
            // \item
            //     \[
            //     \infer[I]{\Gamma, A \rightarrow B \vdash A \rightarrow B}{}
            //     \qquad\rightsquigarrow\qquad
            //     \infer[\rightarrow_R]{\Gamma, A \rightarrow B \vdash A \rightarrow B}{
            //     \infer[\rightarrow_L]{\Gamma, A \rightarrow B, A \vdash B}{
            //         \infer[I]{\Gamma, A, A \rightarrow B \vdash A}{}
            //         &
            //         \infer[I]{\Gamma, A, B \vdash B}{}
            //     }
            //     }
            //     \]
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
