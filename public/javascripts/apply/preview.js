var prevDeriv;
var concc;
var sequentDerivation = '';
function preview() {
	var symbols = '';
	var conc = document.getElementById('Sequent').value.replace(/\(/g, '').replace(/\)/g, '');
	symbols = conc;
	concc = conc;
	this.rule.innerHTML =
		'<div style="margin: 35px;"><table id="prooftree" count="1" style="margin: auto;"><tr><td class="conc-temp" id="prooftree_1_conc">\\[' +
		conc +
		'\\]</td></tr></table></p></div>';
	rule_id_text = conc;
	prevDeriv = this.rule.innerHTML;
	MathJax.Hub.Queue([ 'Typeset', MathJax.Hub, rule ]);
	table(symbols);
}
