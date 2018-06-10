// helper functions =================================
function equalArr (arr1, arr2) {
	if(arr1.sort().join(',') === arra.sort().join(',')){
		return true;
	}
	return false;
}

function elemExist (arr1, arr2) {
	var length = arr1.length;

	if (arr1.length > arr2.length) {
		length = arr2.length;
	}

	for (var i = 0; i < length; i++) {
		if (arr1[i] == arr2[2]) {
			return true;
		}
	}

	return false;
}

// check if there are any premises
function existPremises (seq_list) {
	if (seq_list.length == 1) {
		return true;
	}
	return false;
}

Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};

// check which side the formula is on =================================
function checkSide (sequent, formulaIndex, arrow) {
	var arrowIndex = sequent.indexOf(arrow);
	if (formulaIndex < arrowIndex) {
		return "left";
	}
	return "right";
}

// checking types
function isFormula (formula, types) {
	return types[formula] == "formula";
}

function isContext (context, types) {
	return types[context] == "context";
}

function isSeparator (separator, types) {
	return types[separator] == "separator";
}


// getting symbols depending on the type and side into a list =================================
function getArrow (sequent, types) {
	for (var i = 0; i < sequent.length; i++) {
		if (types[sequent[i]] == "arrow") {
			return sequent[i];
		}
	}
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

// checking for connectives =================================

// check which connective to use between premise formulas
function chekConnective (seq_list, types) {
	var arrow = getArrow(seq_list[0], types);

	if (!existPremises(seq_list)) {
		return "";
	} 

	// ⅋ (!&) and (+) cases
	if (seq_list.lenght ==  2) {
		// getting the left and right context of the premise
		leftContextPremise1 = getLeftContext(seq_list[0], arrow, types);
		rightContextPremise1 = getRightContext(seq_list[0], arrow, types);

		// getting the left and right context of the conclusion
		leftContextConclusion = getLeftContext(seq_list[1], arrow, types);
		rightContextConclusion = getRightContext(seq_list[1], arrow, types);

		// ⅋ (!&) CASE:
		if (equalArr(leftContextPremise1, leftContextConclusion) && 
			equalArr(rightContextPremise1, rightContextConclusion)) {
			return "!&";
		}

		// (+) CASE:
		leftContextPremise1 = leftContextPremise1.map(function (elem) {return elem.split("_")[0]});
		leftContextConclusion = leftContextConclusion.map(function (elem) {return elem.split("_")[0]});

		rightContextPremise1 = rightContextPremise1.map(function (elem) {return elem.split("_")[0]});
		rightContextConclusion = rightContextConclusion.map(function (elem) {return elem.split("_")[0]});

		if (elemExist(leftContextPremise1, leftContextConclusion) && 
			elemExist(rightContextPremise1, rightContextConclusion)) {
			return "(+)";
		}


	}

	// & and (x) cases

	// getting the left and right context of the premise
	leftContextPremise1 = getLeftContext(seq_list[0], arrow, types);
	rightContextPremise1 = getRightContext(seq_list[0], arrow, types);

	// getting the left and right context of the premise
	leftContextPremise2 = getLeftContext(seq_list[1], arrow, types);
	rightContextPremise2 = getRightContext(seq_list[1], arrow, types);

	// getting the left and right context of the conclusion
	leftContextConclusion = getLeftContext(seq_list[2], arrow, types);
	rightContextConclusion = getRightContext(seq_list[2], arrow, types);

	// & CASE:
	if (equalArr(leftContextPremise1, leftContextConclusion) && 
		equalArr(rightContextPremise1, rightContextConclusion) &&
		equalArr(leftContextPremise2, leftContextConclusion) && 
		equalArr(rightContextPremise2, rightContextConclusion)) {
		return "&";
	}

	// (x) CASE:
	if (equalArr(leftContextPremise1.concat(leftContextPremise2), leftContextConclusion) && 
		equalArr(rightContextPremise1.concat(rightContextPremise2), rightContextConclusion)) {
		return "(x)";
	}

}


// getting subexponentials from the sequents by deciding the number of zones
function getSubexponentials (seq_list, types) {
	var leftSeperators = [];
	var rightSeperators = [];

	// getting the left and right subexponentials of the sequets
	for (var i = 0; i < seq_list.length; i++) {
		leftSeperators.push(getLeftSeparators(seq_list[i]));
		rightSeperators.push(getRightSeparators(seq_list[i]));
	}

	// removing the duplicates
	leftSeperators = Array.from(new Set(leftSeperators.flat()));
	rightSeperators = Array.from(new Set(rightSeperators.flat()));

	var subexponentials = []

	// giving a number to each zone
	var i = 0;
	for (; i < leftSeparators.length; i++) {
		subexponentials.push([i + 1, leftSeparators[i], i + 2]);	
	}

	subexponentials.push([i + 2, "arrow", i + 3]);

	for (; i < rightSeparators.length; i++) {
		subexponentials.push([i + 1, rightSeparators[i], i + 2);	
	}


	return subexponentials;
}


