// check if there are any premises
function existPremises (seq_list) {
	if (seq_list[0].length == 0 && seq_list[0].length == 0) {
		return false;
	}
	return true;
}

// check which side the formula is on
function checkSide (sequent, formulaIndex, arrow) {
	var arrowIndex = sequent.indexOf(arrow);
	if (formulaIndex < arrowIndex) {
		return "left";
	}
	return "right";
}

function isFormula (formula, types) {
	return types[formula] == "formula";
}

function isContext (context, types) {
	return types[context] == "context";
}

function isSeparator (separator, types) {
	return types[separator] == "separator";
}

function getLeftSeparators (sequent, arrow, types) {
	var arrowIndex = sequent.indexOf(arrow);
	var leftSeparators = [];

	for (var i = 0; i < arrowIndex; i++) {
		if (isSeparator(sequent[i], types)) {
			leftSeparators.push(sequent[i]);
		}
	}

	return leftSeparators;
}

function rightSeparators (sequent, arrow, types) {
	var arrowIndex = sequent.indexOf(arrow);
	var rightSeparators = [];

	for (var i = 0; i < arrowIndex; i++) {
		if (isSeparator(sequent[i], types)) {
			rightSeparators.push(sequent[i]);
		}
	}

	return rightSeparators;
}

function getLeftFormulas (sequent, arrow, types) {
	var arrowIndex = sequent.indexOf(arrow);
	var leftFormula = [];

	for (var i = 0; i < arrowIndex; i++) {
		if (isFormula(sequent[i], types)) {
			leftFormula.push(sequent[i]);
		}
	}

	return leftFormula;
}

function rightFormulas (sequent, arrow, types) {
	var arrowIndex = sequent.indexOf(arrow);
	var rightFormula = [];

	for (var i = 0; i < arrowIndex; i++) {
		if (isFormula(sequent[i], types)) {
			rightFormula.push(sequent[i]);
		}
	}

	return rightFormula;
}

function getLeftContext (sequent, arrow, types) {
	var arrowIndex = sequent.indexOf(arrow);
	var leftContext = [];

	for (var i = 0; i < arrowIndex; i++) {
		if (isContext(sequent[i], types)) {
			leftContext.push(sequent[i]);
		}
	}

	return leftContext;
}

function getRightContext (sequent, arrow, types) {
	var arrowIndex = sequent.indexOf(arrow);
	var rightContext = [];

	for (var i = arrowIndex + 1; i < sequent.length; i++) {
		if (isContext(sequent[i], types)) {
			rightContext.push(sequent[i]);
		}
	}

	return rightContext;
}

// check which connective to use between premise formulas
function chekConnective () {

}


