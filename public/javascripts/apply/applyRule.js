var counter = 1;

function applyRule(i) {
	var rule = $("#r" + i).data('rule');
	console.log(rule);
	console.log(sequentDerivation);
	if (sequentDerivation == "") {
		console.log(2123);
		sequentDerivation =  parser.parse(concc).replace(/\\/g, "\\\\");
	}
	$.post('/apply', {rule : rule, sequent : sequentDerivation}, function(data, status){
		console.log("Derivation: " + data.output.replace(/ "/g, "").replace(/" /g, "").replace(/"/g, ""));
        console.log("Data: " + data + "\nStatus: " + status);
        addDerivation(data.output.replace(/ "/g, "").replace(/" /g, "").replace(/"/g, ""));
    });
}

function addDerivation(derivation) {
	counter++
	var f = [];
	derivation.push("");
	var rule = document.getElementById("rule");
	this.rule.innerHTML = "";
	var begin = '<div style="display: flex; justify-content: center; align-items: center; margin-top: -35px; margin-left: 18px;">';
	var between = '\n<div style="width: 15px"></div>';
	var end = '\n</div>';
	var newDeriv = begin;
	var l = [];


	for (var i = 0; i < derivation.length; i++) {
		l.push('<p onclick="setSequent(' + (i+1)*counter + ')" id=' + (i+1)*counter + ' data-rule="' + derivation[i] + '">$$' + derivation[i] + '$$</p>');
	}
	newDeriv += l.join(between) ;
	console.log(l.join(between));
	newDeriv += end;
	newDeriv += prevDeriv;
	rule.innerHTML = newDeriv;

	prevDeriv = rule.innerHTML;

	MathJax.Hub.Queue(["Typeset",MathJax.Hub,rule]);
}

function setSequent(i) {
	console.log(i);
	var seq = $("#" + i).data('rule').replace(/\(/g, "").replace(/\)/g, "");
	sequentDerivation = parser.parse(seq).replace(/\\/g, "\\\\");
}




