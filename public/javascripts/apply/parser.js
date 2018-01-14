function getType (type, element) {
	switch(type) {
	    case 'connective':
	        return 'Con ("' + element + '")';
	    case 'atom':
	        return 'Atom (' + element + ')';
	    case 'formula':
	        return 'Form (' + element + ')';
	    case 'set' :
	    	return 'Set (' + element + ')';
	    case 'unary' :
	    	return 'Uform (' + element + ')';
	    default :
	    	return 'hell';
	}
}

function tag (listc, symbols) {
	var list = listc.slice();
	for (var i = 0; i < list.length; i++) {
		if (Array.isArray(list[i])) {
			list[i] = tag(list[i], symbols);
		} else {
			for (var j =0; j < symbols.length; j++) {
					temp = getType(symbols[j].type, list[i]);
			    if (symbols[j].symbol == list[i]) {
			    	list[i] =  temp;
			    }
			}
		}
	}

	return list;
}

function joinTags (listc) {
	var list = listc.slice();
	for (var i = 0; i < list.length; i++) {
		if (Array.isArray(list[i])) {
			list[i] = joinTags(list[i]);
		} 
	}

	for (var i = 0; i < list.length; i++) {
		if (list[i].includes('Con') && list.length != 1) {
			return 'Form(' + list.join() + ')';
		} 
	}

	return '(' + list.join() + ')';

}

function findIndex(list, symbol) {
	var temp = '';
	for (var i = 0; i < list.length; i++) {
		if (list[i].includes(symbol)) {
			return i;
		}
	}

	return -1;
}

function setFindIndex(list, symbol) {
	for (var i = 0; i < list.length; i++) {
		if (list[i][0].includes(symbol)) {
			return i;
		}
	}

	return -1;
}


function split_sep (clist, symbol) {
	var list = clist.slice();
	var left = [];
	var right = [];
	var index = findIndex(list, symbol);

	if (index != -1) {
		left = list.slice(0, index);
		right = list.slice(index + 1);
		return [left, [symbol], right];
	} else {
		return list;
	}
	

}

function split_all(list, symbols) {
	var new_list = [];
	var temp = [];
	var check = false;
	for (var i = 0; i < list.length; i++) {
		for (var j = 0; j < symbols.length; j++) {
			if (findIndex(list[i], symbols[j]) != -1) {
				temp = split_sep(list[i], symbols[j]);

				check = true;
				new_list.push(temp[0]);
				new_list.push(temp[1]);
				new_list.push(temp[2]);
			}
		}

		if (!check) {
			new_list.push(list[i]);
		}
		check = false;
	}

	return new_list;
}



function final_split(clist, symbol) {
	var list = clist.slice();
	var left = [];
	var right = [];
	for (var i = 0; i < list.length; i++) {

		if (list[i][0].includes(symbol)) {
			left = list.slice(0, i);
			right = list.slice(i + 1);
			return [left, [symbol], right];
		}
	}
}


function bringSetToFirst (list, i) {
	if (i == -1 || i == 0) {
		return;
	} else {
		list.unshift(list[i]);
		list.splice(i + 1, 1);
	}
}


function setParser (listc, symbols) {
	var list = listc.slice();
	var index = 0;
	if (findIndex(list, "Set") == -1) {
		bringSetToFirst (list, findIndex(list, "Set"));
		list = "Single (" + list.join("::") + "::nil)";
	} else {
		for (var i = 0; i < symbols.length; i++) {
			bringSetToFirst (list, findIndex(list, "Set"));
			index = findIndex(list, symbols[i]);
			if (index != -1) {
				if (findIndex(list, "Set") == -1) {
					return "Mult (" + list.slice(0, index).join("::") + '::nil, Con("' + symbols[i] + '"), ' + setParser(list.slice(index+1), symbols) + ")";
				} else {
					list[0] = list[0].slice(6,-2);
					return "Mult (" + list.slice(0, index).reverse().join("::") +  ', Con("' + symbols[i] + '"), ' + setParser(list.slice(index+1), symbols) + ")";

				}
			}
		}

		list[0] = list[0].slice(6,-2);
		list = "Single (" + list.reverse().join("::") + ")";
	}

	return list;
}


// function repeats(list) {
// 	var flattened_list = flatten(list);
// 	var unique_list = Array.from(new Set(flattened_list));
// 	var unique_list = unique_list.map(function (x) {return [x, 0];});
// 	console.log(unique_list);
// 	for (var i = 0; i < flattened_list.length; i++) {
// 		for (var j = 0; j < unique_list.length; j++) {
// 			if (unique_list[j][0] == flattened_list[i]) {
// 				unique_list[j][1] ++;
// 				if (unique_list[j][1] > 1) {
// 					flattened_list[i] = flattened_list[i] + unique_list[j][1].toString();
// 				}
// 			}
// 		}
// 	} 
// 	console.log(flattened_list);
// 	return list;
// }

function parser(input, seperator, symbols, seperators) {
	var parsedInput = formatter(input, seperator);
	// var repeat = repeats(parsedInput);
	var taggedInput = tag(parsedInput, symbols);
	var parsedTagged = split_all(taggedInput, seperators);
	var splitParsedTagged = final_split(parsedTagged, seperator);
	var joinTagged = [splitParsedTagged[0].map(joinTags), splitParsedTagged[1], splitParsedTagged[2].map(joinTags)]
	var ctxParsedL = setParser(joinTagged[0], seperators);
	var ctxParsedR = setParser(joinTagged[2], seperators);
	return "(" + ctxParsedL + ', Con("' + joinTagged[1][0] + '"), ' + ctxParsedR + ")";
}




