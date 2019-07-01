function preview () {
    var symbols = ""
    var rule = document.getElementById("rule")
    var rule_connective = document.getElementById("rule_connective").value
    var premises = document.getElementById("i0").value
    premises.replace(/\s\s+/g, " ")
    if (premises == "" || premises == " ") {
        premises = ""
    }
    if (premises != "" || premises != "") {
        symbols += premises
    }
    for (var i = 1; i <= v; i++) {
        if (document.getElementById("i" + i.toString()) != "") {
            symbols += " " + document.getElementById("i" + i.toString()).value
            premises += " \\quad \\quad " + document.getElementById("i" + i.toString()).value
        }
    }
    var conc = document.getElementById("Conclusion").value
    symbols += " " + conc
    this.rule.innerHTML = "\\[\\frac{"+premises+"}{"+conc+"}"+rule_connective+"\\]"
    MathJax.Hub.Queue(["Typeset",MathJax.Hub,rule])
    table(symbols)
}