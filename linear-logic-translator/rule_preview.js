function rule_preview () {

	// getting the rule html element (will containe the rule preview)
	var rule = document.getElementById("rule");

	// getting the rule connective html element
	var rule_connective = document.getElementById("rule_connective").value;

	// getting the premise(s)
	var premise1 = document.getElementById("premise-1").value;
	var premise2 = document.getElementById("premise-2").value;

	var premises = premise1;
	if (premise2 != "") {
		premises += " \\quad \\quad " + premise2;
	}

	// getting the conclusion
	var conc = document.getElementById("conclusion").value;

	// Mathjax updating the rule container
	this.rule.innerHTML = "\\[\\frac{"+premises+"}{"+conc+"}"+rule_connective+"\\]";
	MathJax.Hub.Queue(["Typeset",MathJax.Hub,rule]);
}