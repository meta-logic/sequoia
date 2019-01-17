var prevDeriv;
var concc;
var sequentDerivation = "";
function preview () {
	var symbols = "";
	var conc = document.getElementById("Sequent").value.replace(/\(/g, "").replace(/\)/g, "");
	symbols = conc;
	concc = conc;
	this.rule.innerHTML = '<div style="margin-top: -35px;"><p>$$' + conc + '$$</p></div>';
	prevDeriv = this.rule.innerHTML;
	MathJax.Hub.Queue(["Typeset",MathJax.Hub,rule]);
	table(symbols);
}