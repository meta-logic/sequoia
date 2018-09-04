function getLatex (sequent, premise, connective, emptySubs, subs, types) {

	var left = sequent[0].map(function (formula) { 
		var sub = getSub(formula, premise, types, subs);
		if (sub != "") sub = "?^{" + sub + "}";
		return sub + "\\lfloor " + formula + " \\rfloor"; 
	});
	var right = sequent[1].map(function (formula) {
		var sub = getSub(formula, premise, types, subs);
		if (sub != "") sub = "?^{" + sub + "}";
		return sub + "\\lceil " + formula + " \\rceil"; 
	});
	var leftSubs = emptySubs[0].map(function (sub) { return "!^{" + sub + "}"; });
	var rightSubs = emptySubs[1].map(function (sub) { return "!^{" + sub + "}"; });
	leftSubs = leftSubs.join("");
	rightSubs = rightSubs.join("");
	if (left.length != 0 && right.length != 0)
	return leftSubs + left.join(" " + connective + " ") + " " + connective + " " + rightSubs + right.join(" " + connective + " ");
	return leftSubs + left.join(" " + connective + " ") + " " + rightSubs + right.join(" " + connective + " ");

}

function getConclusionLatex (sequent, connective, emptySubs, sequent_list) {

	var left = sequent[0].map(function (formula) { return "\\lfloor " + formula + " \\rfloor"; });
	var right = sequent[1].map(function (formula) { return "\\lceil " + formula + " \\rceil"; });
	var result = "";
	if (left.length == 0 && right.length == 0) return "";
	if (left.length > 0 && right.length > 0 && sequent_list.length == 1) 
	return left.join(connective) + "^{\\bot} \\otimes " + right.join(connective) + "^{\\bot}";
	return left.join(connective) + " " + right.join(connective) + "^{\\bot} \\otimes "


}

function conclusionUpdatedFormulas (l, r) {
	var min = "";
	var max = ""; 
	var result = [];

	if (l.length > r.length) {
		min = r;
		max = l;
	} else {
		min = l;
		max = r;
	}

	result = min.filter(function(val) { return max.indexOf(val) != -1; });
	return result;
}

function translate(sequent_list, types, arrow, subs, index, rule) {
	// initalizing the pre-req
	var conclusion = sequent_list[sequent_list.length - 1];
	var premises = [];
	var result = [];
	var conclusion_formulas = "";
	sequent_list = sequent_list.filter(function (seq) {return seq[0] != "";});

	for (var i = 0; i < sequent_list.length - 1; i++) {
		premises.push(sequent_list[i]);
	}

	// translation start
	var emptySubs = premises.map(function (premise) { return getEmptySubs (premise, types, subs, arrow); });
	var concEmptySubs = getEmptySubs(conclusion, types, subs, arrow);
	var updatedFormulas = premises.map(function (premise) { return getUpdatedFormulas (premise, conclusion, types, arrow); });
	var connective = getConnective (sequent_list, types);
	if (sequent_list.length == 1) {
		conclusion_formulas = getConclusionUpdatedFormulas ([], conclusion, types, arrow);
	} else if (sequent_list.length == 2) {
		conclusion_formulas = getConclusionUpdatedFormulas  (premises[0], conclusion, types, arrow);
	} else {
		var conc1 = getConclusionUpdatedFormulas (premises[0], conclusion, types, arrow);
		var conc2 = getConclusionUpdatedFormulas (premises[1], conclusion, types, arrow);
		conclusion_formulas = [conclusionUpdatedFormulas(conc1[0], conc2[0]),
							   conclusionUpdatedFormulas(conc1[1], conc2[1])];
	}

	var leftSubs = concEmptySubs[0].map(function (sub) { return "!^{" + sub + "}"; });
	var rightSubs = concEmptySubs[1].map(function (sub) { return "!^{" + sub + "}"; });

	console.log("rule", rule, "==============");
	console.log(premises);
	console.log("empty subs", emptySubs);
	console.log("Updated formulas:", updatedFormulas);
	console.log("Conclusion formulas:", conclusion_formulas);
	console.log("connective:",connective);

	for (var i = 0; i < sequent_list.length - 1; i++) {
		result.push(getLatex(updatedFormulas[i], premises[i], connective, emptySubs[i], subs, types));
	}

	var conclusionLatex = getConclusionLatex (conclusion_formulas, "^{\\bot} \\otimes ", concEmptySubs, sequent_list);
	if (conclusionLatex.trim() != "") conclusionLatex = conclusionLatex  + leftSubs + rightSubs;
	if (result.length != 0) {
		result = conclusionLatex + "(" + result.join(connective) + ")";
	} else {
		result = conclusionLatex;
	}

	var translate = document.getElementById("tran");
	translate.innerHTML += "<div id='tran-" + index +"' ></div>";
	translate = document.getElementById("tran-"+index);

	// Mathjax updating the rule container
	translate.innerHTML = "\\[("+ rule + ") \\quad " + result +"\\]";
	MathJax.Hub.Queue(["Typeset",MathJax.Hub,translate]);




}