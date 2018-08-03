// helper function - check if two arrays are equal
function equalArr (arr1, arr2) {
        if(arr1.sort().join(',') === arr2.sort().join(',')) return true;
        return false;
}

// helper function - gets the difference between two arrays
Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};

// checking if all the elements of arr1 are included in arr2
function all_included (arr1, arr2) {
	for (var i = 0; i < arr1.length; i++) {
		if (arr2.indexOf(arr1[i])) return false;
	}

	return true;
}

// get the left side of the arrows - Tested
function getLeftSide (sequent, arrows) {
	//console.log(arrows);
	var copy = sequent.slice();
	var left_side = copy;
	var arrow_index = -1;
	for (var i = 0; i < arrows.length; i++) {
		arrow_index = copy.indexOf(arrows[i]);
		//console.log("arrow", arrow_index, arrows[i], i);
		if (arrow_index != -1) left_side = copy.splice(0,arrow_index);
	}
	return left_side; 
}

// get the right side of the arrows - Tested
function getRightSide (sequent, arrows) {
	var copy = sequent.slice();
	var arrow_index = -1;
	for (var i = 0; i < arrows.length; i++) {
		arrow_index = copy.indexOf(arrows[i]);
		if (arrow_index != -1) copy.splice(0,arrow_index + 1);
	}
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

// check if the zone is empty
function checkZone (sequent, types, separator) {
	var sep_index = sequent.indexOf(separator[1]);
	var left = [];
	var right = [];
	var result = [[], []];
	var i = sep_index + 1;

	while (i < sequent.length && isType(sequent[i], types, "separator") != true) {
		if (isType(sequent[i], types, "formula")) right.push(sequent[i]);
		i++;
	}

	i = sep_index - 1;

	while (i >= 0 && isType(sequent[i], types, "separator") != true) {
		if (isType(sequent[i], types, "formula")) left.push(sequent[i]);
		i--;
	}


	if (left.length == 0) result[0].push(separator[0]);
	if (right.length == 0) result[1].push(separator[2]);

	return result;
}

// getting the empty subs based on the zones - Tested 
// (doesn't work if there are duplicate separators which are part of the rule)
function getEmptySubs (sequent, types, subs, arrows) {
	var separators = getSymbols(sequent, types, "separator");
	var left_separators = getLeftSide(subs.map(function (x) { return x[1]; }), arrows);
	var right_separators = getRightSide(subs.map(function (x) { return x[1]; }), arrows);
	var emptyLeft = []; 
	var emptyRight = [];
	var emptyZone = [];

	for (var i = 0; i < subs.length; i++) {
		if (!separators.includes(subs[i][1])) {
			// left side (checking the side of the separator to decide which zone to remove) 
			if (left_separators.includes(subs[i][1])) emptyLeft.push(subs[i][0]);

			// right side (checking the side of the separator to decide which zone to remove)
			if (right_separators.includes(subs[i][1])) emptyRight.push(subs[i][2]);
		} else {
			emptyZone = checkZone(sequent, types, subs[i]);

			if (subs[i][1] == arrows) {
				if (emptyZone[0].length != 0) emptyLeft.push(subs[i][0]);
				if (emptyZone[1].length != 0) emptyLeft.push(subs[i][2]);
			} else {
				if (emptyZone[0].length != 0 && left_separators.includes(subs[i][1])) emptyLeft.push(subs[i][0]);
				if (emptyZone[1].length != 0 && right_separators.includes(subs[i][1])) emptyLeft.push(subs[i][2]);
			}
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

	sequent_list = sequent_list.filter(function (seq) {return seq[0] != "";});
	////console.log("here", sequent_list);

	if (sequent_list.length ==  3) {
		var leftContext = getSymbols(sequent_list[0], types, "context");
		var rightContext = getSymbols(sequent_list[1], types, "context");
		var conContext = getSymbols(sequent_list[2], types, "context");

		if (equalArr(leftContext,conContext) && equalArr(rightContext, conContext)) {
			return "\\&";
		} else {
			return "\\otimes";
		}
	}

	if (sequent_list.length == 2) {
		if (sequent_list[0].length > sequent_list[1].length) {
			return "\\clubsuit";
		} else {
			return "\\oplus";
		}
	}

	return "\\otimes";
}

// get the the updated formulas - Tested
function getUpdatedFormulas (premise, conclusion, types, arrows) {
	var left_formulas = getLeftSide(premise, arrows);
	var right_formulas = getRightSide(premise, arrows);

	var conclusion_formulas = getSymbols(conclusion, types, "formula");
	left_formulas = getSymbols(left_formulas, types, "formula");
	right_formulas = getSymbols(right_formulas, types, "formula");

	if ((all_included(left_formulas, conclusion_formulas) || left_formulas.length == 0)
	&&  (all_included(right_formulas, conclusion_formulas) || right_formulas.length == 0))
	return [left_formulas, right_formulas];

	left_formulas = left_formulas.diff(conclusion_formulas);
	right_formulas = right_formulas.diff(conclusion_formulas);

	return [left_formulas, right_formulas];
}

// get the the conclusion updated formulas - Tested
function getConclusionUpdatedFormulas (premise, conclusion, types, arrows) {
	//console.log(conclusion, "x", premise);
	var left_formulas = getLeftSide(conclusion, arrows);
	var right_formulas = getRightSide(conclusion, arrows);
	var l = "";
	var r = "";

	var premise_formulas = getSymbols(premise, types, "formula");
	left_formulas = getSymbols(left_formulas, types, "formula");
	right_formulas = getSymbols(right_formulas, types, "formula");
	//console.log(premise_formulas, "g", left_formulas, "g", right_formulas);

	l = left_formulas.diff(premise_formulas);
	r = right_formulas.diff(premise_formulas);
	//console.log(l, "v", r);
	var connectives = types["connective"];

	if (l.length == 0) {
		for (var i = 0; i < left_formulas.length; i++) {
			for (var j = 0; j < connectives.length; j++) {
				// //console.log(left_formulas[i], "connective", connectives[j]);
				if (left_formulas[i].includes(connectives[j])) l.push(left_formulas[i]);
			}
		}
	}

	if (r.length == 0) {
		for (var i = 0; i < right_formulas.length; i++) {
			for (var j = 0; j < connectives.length; j++) {
				if (right_formulas[i].includes(connectives[j])) r.push(right_formulas[i]);
			}
		}
	}

	// //console.log(left_formulas, right_formulas);
	// //console.log(l, r);
	return [l, r];
} 