function preview () {
	var symbols = "";
	var rule = document.getElementById("rule");
	var rule_connective = document.getElementById("rule_connective").value;
	var premises = document.getElementById("i0").value;
	symbols += premises;
	for (var i = 1; i <= v; i++) {
		symbols += " " + document.getElementById("i" + i.toString()).value;
		premises += " \\quad \\quad " + document.getElementById("i" + i.toString()).value;
	}
	var conc = document.getElementById("Conclusion").value;
	symbols += " " + conc;
	this.rule.innerHTML = "\\[\\frac{"+premises+"}{"+conc+"}"+rule_connective+"\\]";
	MathJax.Hub.Queue(["Typeset",MathJax.Hub,rule]);
	table(symbols);
}