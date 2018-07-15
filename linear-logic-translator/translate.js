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

	return leftSubs + left.join(" " + connective + " ") + " " + rightSubs + right.join(" " + connective + " ");

}

function getConclusionLatex (sequent, connective, emptySubs) {

	var left = sequent[0].map(function (formula) { return "\\lfloor " + formula + " \\rfloor"; });
	var right = sequent[1].map(function (formula) { return "\\lceil " + formula + " \\rceil"; });
	var leftSubs = emptySubs[0].map(function (sub) { return "!^{" + sub + "}"; });
	var rightSubs = emptySubs[1].map(function (sub) { return "!^{" + sub + "}"; });
	return left.join(connective) + " " + right.join(connective);

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

function translate(sequent_list, types, arrow) {
	// intializing the pre-reqs
	var conclusion = sequent_list[sequent_list.length - 1];
	var subs = generateSubs(conclusion, types);
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
	console.log("empty", concEmptySubs);
	var updatedFormulas = premises.map(function (premise) { return getUpdatedFormulas (premise, conclusion, types, arrow); });
	console.log("this", sequent_list);
	var connective = getConnective (sequent_list, types);
	if (sequent_list.length == 1) {
		conclusion_formulas = getUpdatedFormulas ([], conclusion, types, arrow);
	} else if (sequent_list.length == 2) {
		conclusion_formulas = getUpdatedFormulas (conclusion, premises[0], types, arrow);
	} else {
		var conc1 = getUpdatedFormulas (conclusion, premises[0], types, arrow);
		var conc2 = getUpdatedFormulas (conclusion, premises[1], types, arrow);
		conclusion_formulas = [conclusionUpdatedFormulas(conc1[0], conc2[0]),
							   conclusionUpdatedFormulas(conc1[1], conc2[1])];
	}

	var leftSubs = concEmptySubs[0].map(function (sub) { return "!^{" + sub + "}"; });
	var rightSubs = concEmptySubs[1].map(function (sub) { return "!^{" + sub + "}"; });


	console.log(subs);
	console.log(emptySubs);
	console.log(updatedFormulas);
	console.log(connective);

	for (var i = 0; i < sequent_list.length - 1; i++) {
		result.push(getLatex(updatedFormulas[i], premises[i], connective, emptySubs[i], subs, types));
	}

	var result = getConclusionLatex (conclusion_formulas, connective, concEmptySubs) + "^{\\bot} \\otimes " + leftSubs + rightSubs + "(" + result.join(connective) + ")";
	console.log(result);

	var translate = document.getElementById("tran");

	// Mathjax updating the rule container
	translate.innerHTML = "\\["+ result +"\\]";
	MathJax.Hub.Queue(["Typeset",MathJax.Hub,translate]);




}