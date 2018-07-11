// helper function - check if two arrays are equal
function equalArr (arr1, arr2) {
        if(arr1.sort().join(',') === arr2.sort().join(',')) return true;
        return false;
}

// helper function - gets the difference between two arrays
Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};


// get the left side of the arrow - Tested
function getLeftSide (sequent, arrow) {
	var copy = sequent.slice();
	var arrow_index = copy.indexOf(arrow);
	if (arrow_index == -1) return copy;    
	var left_side = copy.splice(0,arrow_index);
	return left_side; 
}

// get the right side of the arrow - Tested
function getRightSide (sequent, arrow) {
	var copy = sequent.slice();
	var arrow_index = copy.indexOf(arrow);
	if (arrow_index == -1) return copy;    
	copy.splice(0,arrow_index + 1);
	return copy; 
}

// check the type of a symbol - Tested
function isType (symbol, types, type) {
	return types[symbol] == type;
}

// get all the symbols of a specific type - Tested
function getSymbols (sequent, types, type) {
	var symbols = [];

	for (var i = 0; i < sequent.length; i++) {
		if (isType(sequent[i], types, type)) symbols.push(sequent[i]);
	}

	return symbols;
}

// generating subexponentials for a sequent - Tested
function generateSubs (sequent, types) {
	var zone = 1;
	var zones = [];
	var separators = getSymbols(sequent, types, "separator");

	for (var i = 0; i < separators.length; i++) {
		zones.push([zone, separators[i], zone + 1]);
		zone++;
	}

	return zones;
}

// getting the empty subs based on the zones - Tested 
// (doesn't work if there are duplicate separators which are part of the rule)
function getEmptySubs (sequent, types, subs, arrow) {
	var separators = getSymbols(sequent, types, "separator");
	var left_separators = getLeftSide(subs.map(function (x) { return x[1]; }), arrow);
	var right_separators = getRightSide(subs.map(function (x) { return x[1]; }), arrow);
	var emptyLeft = []; 
	var emptyRight = [];

	for (var i = 0; i < subs.length; i++) {
		if (!separators.includes(subs[i][1])) {
			// left side (checking the side of the separator to decide which zone to remove) 
			if (left_separators.includes(subs[i][1])) emptyLeft.push(subs[i][0]);

			// right side (checking the side of the separator to decide which zone to remove)
			if (right_separators.includes(subs[i][1])) emptyRight.push(subs[i][2]);
		}
	}

	emptyLeft = emptyLeft.filter(function (elem) {return elem});
	emptyRight = emptyRight.filter(function (elem) {return elem});

	return [emptyLeft, emptyRight];
}

// getting the zone of the formula - Tested
function getSub (formula, sequent, types, subs) {
	var form_index = sequent.indexOf(formula);
	var left_sep = "";
	var right_sep = "";
	var sub = "";
	var i = form_index;

	while (i < sequent.length && isType(sequent[i], types, "separator") != true) {
		i++;
	}

	if (isType(sequent[i], types, "separator")) right_sep = sequent[i];

	i = form_index;

	while (i >= 0 && isType(sequent[i], types, "separator") != true) {
		i--;
	}

	if (isType(sequent[i], types, "separator")) left_sep = sequent[i];

	for (var i = 0; i < subs.length; i++) {
		if (subs[i][1] == left_sep && right_sep == "") {
			sub = subs[i][2];
		}

		if (subs[i][1] == right_sep && left_sep == "") {
			sub = subs[i][0];
		}

		if (subs[i][1] == left_sep && right_sep != "") {
			sub = subs[i][2];
		}
	}

	return sub;
}

// getting the type of connective to put in between premises if any - Tested
function getConnective (sequent_list, types) {

	if (sequent_list.length ==  3) {
		var leftContext = getSymbols(sequent_list[0], types, "context");
		var rightContext = getSymbols(sequent_list[1], types, "context");
		var conContext = getSymbols(sequent_list[2], types, "context");

		if (equalArr(leftContext,conContext) && equalArr(rightContext, conContext)) {
			return "\\with";
		} else {
			return "\\otimes";
		}
	}

	if (sequent_list.length == 2) {
		if (sequent_list[0].length > sequent_list[1].length) {
			return "\\parr";
		} else {
			return "\\oplus";
		}
	}

	return "\\otimes";
}

// get the the updated formulas - Tested
function getUpdatedFormulas (premise, conclusion, types, arrow) {
	var left_formulas = getLeftSide(premise, arrow);
	var right_formulas = getRightSide(premise, arrow);

	var conclusion_formulas = getSymbols(conclusion, types, "formula");
	left_formulas = getSymbols(left_formulas, types, "formula");
	right_formulas = getSymbols(right_formulas, types, "formula");

	left_formulas = left_formulas.diff(conclusion_formulas);
	right_formulas = right_formulas.diff(conclusion_formulas);

	return [left_formulas, right_formulas];
}