// helper function - check if two arrays are equal
function equalArr (arr1, arr2) {
        if(arr1.sort().join(',') === arr2.sort().join(',')) return true;
        return false;
}

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
function generateSub (sequent, types) {
	var zone = 1;
	var zones = [];
	var separators = getSymbols(sequent, types, "separator");

	for (var i = 0; i < separators.length; i++) {
		zones.push([zone, zone + 1]);
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
	var empty = [];

	for (var i = 0; i < subs.length; i++) {
		if (!separators.includes(subs[i][1])) {
			// left side (checking the side of the separator to decide which zone to remove) 
			if (left_separators.includes(subs[i][1])) empty.push(subs[i][0]);

			// right side (checking the side of the separator to decide which zone to remove)
			if (right_separators.includes(subs[i][1])) empty.push(subs[i][2]);
		}
	}

	return empty;
} 

// getting the type of connective to put in between premises if any - Tested
function getConnective (sequent_list, types) {

	if (sequent_list.length ==  3) {
		var leftContext = getSymbols(sequent_list[0], types, "context");
		var rightContext = getSymbols(sequent_list[1], types, "context");
		var conContext = getSymbols(sequent_list[2], types, "context");

		if (equalArr(leftContext,conContext) && equalArr(rightContext, conContext)) {
			return "&";
		} else {
			return "(x)";
		}
	}

	if (sequent_list.length == 2) {
		if (sequent_list[0].length > sequent_list[1].length) {
			return "!&";
		} else {
			return "(+)";
		}
	}

	return "(x)";
}