// Sequoia Copyright (C) 2020  Zan Naeem
// This program comes with ABSOLUTELY NO WARRANTY; for details see LICENSE.
// This is free software, and you are welcome to redistribute it
// under certain conditions; see LICENSE for details.


function generate(fname, title, next) {
    var content = ""
    if (fname == "LatexTree") {
        content = "\\documentclass[10pt]{article}\n"+
                    "\\usepackage{amsmath}\n"+
                    "\\usepackage{amsfonts}\n"+
                    "\\usepackage{amssymb}\n"+
                    "\\usepackage{proof}\n"+
                    "\\usepackage{latexsym}\n"+
                    "\\begin{document}\n"+
                    "\\begin{flushleft}\n"+
                    "Tree in "+title+": \n"+
                    "\\end{flushleft}\n"+
                    "\\begin{align*}\n"+
                    proof_content["tree"]+"\n"+
                    "\\end{align*}\n"+
                    "\\begin{flushleft}\n"+
                    "Constraints: \n"+
                    "\\\\$"+proof_content["constraints"]+"$\n"+
                    "\\end{flushleft}\n"+
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
