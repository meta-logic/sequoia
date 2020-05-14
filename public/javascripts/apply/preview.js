// Sequoia Copyright (C) 2020  Zan Naeem, Abdulrahman Alfayad
// This program comes with ABSOLUTELY NO WARRANTY; for details see LICENSE.
// This is free software, and you are welcome to redistribute it
// under certain conditions; see LICENSE for details.


function preview() {
    $("#warning").css("visibility", "hidden")
    var initial_sequent = escape_latex($("#Sequent").val().trim().replace(/\(/g, " ( ").replace(/\)/g, " ) "))
    if (initial_sequent == "")
        return
    $("#conc_0").html('$$'+initial_sequent+'$$')
    $("#conc_0").css("visibility", "visible")
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, $("#prooftree_0")[0]])
    $("#submit").css("visibility", "visible")
    $("#sym_table").css("visibility", "visible")
    $("#typ").css("visibility", "visible")
}