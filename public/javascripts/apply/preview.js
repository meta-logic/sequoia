
function preview() {
    var initial_sequent = $("#Sequent").val().replace(/\(/g, " ( ").replace(/\)/g, " ) ")
    $("#warning").css("visibility","hidden")
    if (initial_sequent == "")
        return
    $("#conc_0").html('$$'+initial_sequent+'$$')
    $("#conc_0").css("visibility","visible")
    MathJax.Hub.Queue([ "Typeset", MathJax.Hub, $("#prooftree_0")[0] ])
    $("#submit").css("visibility","visible")
    $("#sym_table").css("visibility","visible")
    $("#typ").css("visibility","visible")
}
