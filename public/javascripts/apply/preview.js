function preview () {
	var symbols = "";
	var conc = document.getElementById("Sequent").value.replace(/\(/g, "").replace(/\)/g, "");
	symbols = conc;
	this.rule.innerHTML = "\\[" + conc + "\\]";
	MathJax.Hub.Queue(["Typeset",MathJax.Hub,rule]);
	table(symbols);
}