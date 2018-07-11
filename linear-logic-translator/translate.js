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

	return leftSubs + left.join(connective) + " " + rightSubs + right.join(connective);

}

function getConclusionLatex (sequent, connective) {

	var left = sequent[0].map(function (formula) { return "\\lfloor " + formula + " \\rfloor"; });
	var right = sequent[1].map(function (formula) { return "\\lceil " + formula + " \\rceil"; });
	return left.join(connective) + " " + right.join(connective);

}

function translate(sequent_list, types, arrow) {
	// intializing the pre-reqs
	var conclusion = sequent_list[sequent_list.length - 1];
	var subs = generateSubs(conclusion, types);
	var premises = [];
	var result = [];

	for (var i = 0; i < sequent_list.length - 1; i++) {
		premises.push(sequent_list[i]);
	}

	// translation start
	var emptySubs = premises.map(function (premise) { return getEmptySubs (premise, types, subs, arrow); });
	var updatedFormulas = premises.map(function (premise) { return getUpdatedFormulas (premise, conclusion, types, arrow); });
	var connective = getConnective (sequent_list, types);
	var conclusion_formulas = getUpdatedFormulas (conclusion, premises[0], types, arrow);
	if (conclusion_formulas[0].length == 0) conclusion_formulas = getUpdatedFormulas ([], conclusion, types, arrow);

	console.log(subs);
	console.log(emptySubs);
	console.log(updatedFormulas);
	console.log(connective);

	for (var i = 0; i < sequent_list.length - 1; i++) {
		result.push(getLatex(updatedFormulas[i], premises[i], connective, emptySubs[i], subs, types));
	}

	return getConclusionLatex (conclusion_formulas, connective) + "^{\\bot} \\otimes (" + result.join(connective) + ")";

}