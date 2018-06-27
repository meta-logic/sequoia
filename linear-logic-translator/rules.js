/*
Algorithm:
1- check if there are any premises
2- Get the connective between the premises
3- Get the subexponentials
4- Check the empty context, to know what ! to use
5- Check the non empty context, to know what ? to use
*/


// helper functions =================================
function equalArr (arr1, arr2) {
        if(arr1.sort().join(',') === arr2.sort().join(',')){
                return true;
        }
        return false;
}

function elemExist (arr1, arr2) {
        var length = Math.min(arr1.length, arr2.length)

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

function getRightSeparators (sequent, arrow, types) {
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
function checkConnective (seq_list, types) {
	var arrow = getArrow(seq_list[0], types);

	if (!existPremises(seq_list)) {
		return "";
	} 

	// ⅋ (!&) and (+) cases
	if (seq_list.length ==  2) {
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
	var leftSeparators = [];
	var rightSeparators = [];
	var arrow = getArrow(seq_list[0], types);

	// getting the left and right subexponentials of the sequets
	for (var i = 0; i < seq_list.length; i++) {
		leftSeparators.push(getLeftSeparators(seq_list[i]));
		rightSeparators.push(getRightSeparators(seq_list[i]));
	}

	// removing the duplicates
	leftSeparators = [].concat.apply([], leftSeparators);
	rightSeparators = [].concat.apply([], rightSeparators);
	leftSeparators = Array.from(new Set(leftSeparators));
	rightSeparators = Array.from(new Set(rightSeparators));

	var subexponentials = []

	// giving a number to each zone
	var i = 0;
	for (; i < leftSeparators.length; i++) {
		subexponentials.push([i + 1, leftSeparators[i], i + 2]);	
	}

	subexponentials.push([i + 1, arrow, i + 2]);

	for (; i < rightSeparators.length; i++) {
		subexponentials.push([i + 1, rightSeparators[i], i + 2]);	
	}

	console.log(subexponentials);
	return subexponentials;
}

// check if the left and/or right context of the separator is empty
function check_LR_Context (sequent, separatorSub) {
	console.log("check");
	console.log(separatorSub);
	console.log(sequent);
	var separatorIndex = sequent.indexOf(separatorSub[1]);
	console.log("sep", separatorIndex);
	var emptyContext = [];
	var nonEmptyContext = [];

	// check if both are empty
	if (separatorIndex == -1) {
		return emptyContext;
	}

	// check if the left is empty
	if (separatorIndex > 0) {
		if (sequent[separatorIndex - 1] == ".") {
			emptyContext.push(separatorSub[0]);
			console.log("e", emptyContext);
		} else {
			nonEmptyContext.push(separatorSub[0]);
			console.log("n", nonEmptyContext);
		}
	}

	// check if the right is empty
	if (separatorIndex < sequent.length - 1) {
		if (sequent[separatorIndex + 1] == ".") {
			emptyContext.push(separatorSub[2]);
			console.log("e", emptyContext);
		} else {
			nonEmptyContext.push(separatorSub[2]);
			console.log("n", nonEmptyContext);
		}
	}

	return [emptyContext, nonEmptyContext];
}

// Check empty context
function checkEmptyContext (sequent, subexponentials) {
	var emptyContext = [];

	for (var i = 0; i < subexponentials.length; i++) {
		console.log(subexponentials[i]);
		emptyContext.push(check_LR_Context(sequent, subexponentials[i])[0]);
		console.log("empty", emptyContext);
	}

	emptyContext = [].concat.apply([], emptyContext);
	return Array.from(new Set(emptyContext));
}

// Check non empty context
function checkNonEmptyContext (sequent, subexponentials) {
	var nonEmptyContext = [];

	for (var i = 0; i < subexponentials.length; i++) {
		nonEmptyContext.push(check_LR_Context(sequent ,subexponentials[i])[1]);
	}

	nonEmptyContext = [].concat.apply([], nonEmptyContext);
	return Array.from(new Set(nonEmptyContext));
}

function applyContextCheck (sequent, subexponentials) {
	var emptyContext = checkEmptyContext(sequent, subexponentials);
	var nonEmptyContext = checkNonEmptyContext(sequent, subexponentials);
	console.log("helo");
	console.log(emptyContext);
	return [emptyContext, nonEmptyContext];
}

// Translate to linear logic =================================

// getting the needed information to translate: connective, subexponentials, what ! and ? to use
/* function getTranslateData (seq_list, types) {
	var connective  = checkConnective (seq_list, types);
	var subexponentials = getSubexponentials(seq_list, types);
	var contexts = seq_list.map(function (elem) { applyContextCheck(elem, subexponentials); });
	console.log("done");
	console.log(subexponentials);
	console.log(contexts);
	return contexts;
} */






















