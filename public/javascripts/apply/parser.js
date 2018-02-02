function inputParser(input) {
	var token = '';
	var tokens_list = [];
	var between_parentheses_check = false;
	var parentheses_count = 0;
	input += ' ';

	for (var i = 0; i < input.length; i++) {

		//==== perantheses ====
		if (input[i] == "(") {
			between_parentheses_check = true;
			parentheses_count ++;
		}

		if (input[i] == ")") {
			parentheses_count --;

			//check if the token is closed with perantheses
			if (parentheses_count == 0) {
				between_parentheses_check = false;
				token += input[i];
				tokens_list.push(token);
				token = '';
				i++;
			}
		}


		//==== rest of input ====

		if ((input[i] == ' ' || input[i] == ',') && !between_parentheses_check) {

			if (i != 0 && input[i-1] != ")" && token != "" && token != " ") {
				tokens_list.push(token);
				token = '';
			}
		} else {
			token += input[i];
		}

	}

	//check if the input was only one word
	if (tokens_list.length == 0) {
		tokens_list.push(token);
	}
	return tokens_list;
}

function flatten(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}

//remove the pranthesis eg. (A ^ (A v B)) => A, ^, (A v B)
function remove(input) {
	for (var i = 0 ; i < input.length; i++) {
		if (input[i][0] == "(") {
			input[i] = remove(inputParser(input[i].substr(1,input[i].length - 2)));
		} 
	}
	
	return input; 
}

//format the input given by the user to the desired form we need to apply the rules
function formatter(input, symbol) {

	//splitting at the symbol if presented
	var temp_tokens = input.split(symbol);
	var tokens = [];
	if (temp_tokens.length > 1) {
		for (var i = 0; i < temp_tokens.length - 1; i++) {
			tokens.push(temp_tokens[i]);
			tokens.push(symbol);
		}
		tokens.push(temp_tokens[temp_tokens.length - 1]);
	} else {
		tokens = temp_tokens;
	}

	//seperating the formulas between the commas
	tokens = tokens.map(function (x) {return x.split(",");});
	tokens = flatten(tokens);

	//applying the input parser on each input to get the symbols by themselves
	tokens = tokens.map(inputParser);

	//make copy of tokens
	tokens_copy = tokens.splice();
	tokens = tokens.map(remove);

	return tokens;
}


Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};

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


function unary(listc, i) {
	var list = listc.slice();
	var temp = list[i].split("(")[1].split(")")[0];
	list.splice(0,1);
	return "Uform(" + temp + ", " + joinTags(list) + ")"; 
}

function joinTags (listc) {
	var list = listc.slice();
	for (var i = 0; i < list.length; i++) {
		if (Array.isArray(list[i])) {
			list[i] = joinTags(list[i]);
		} 
	}

	for (var i = 0; i < list.length; i++) {
		if (list[i].includes('Uform') && list.length != 1) {
			return unary(list, i);
		}

		if (list[i].includes('Con') && list.length != 1) {
			var temp = list.splice(0,2);
			return 'Form(' + temp.join() + "," + joinTags(list) + ')';
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
	function flatten(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}

//remove the pranthesis eg. (A ^ (A v B)) => A, ^, (A v B)
function remove(input) {
	for (var i = 0 ; i < input.length; i++) {
		if (input[i][0] == "(") {
			input[i] = remove(inputParser(input[i].substr(1,input[i].length - 2)));
		} 
	}
	
	return input; 
}

//format the input given by the user to the desired form we need to apply the rules
function formatter(input, symbol) {

	//splitting at the symbol if presented
	var temp_tokens = input.split(symbol);
	var tokens = [];
	if (temp_tokens.length > 1) {
		for (var i = 0; i < temp_tokens.length - 1; i++) {
			tokens.push(temp_tokens[i]);
			tokens.push(symbol);
		}
		tokens.push(temp_tokens[temp_tokens.length - 1]);
	} else {
		tokens = temp_tokens;
	}

	//seperating the formulas between the commas
	tokens = tokens.map(function (x) {return x.split(",");});
	tokens = flatten(tokens);

	//applying the input parser on each input to get the symbols by themselves
	tokens = tokens.map(inputParser);

	//make copy of tokens
	tokens_copy = tokens.splice();
	tokens = tokens.map(remove);

	return tokens;
}			new_list.push(temp[0]);
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



function repeats(input, symbols, counter) {
	var temp;
	for (var i = 0; i < input.length; i++) {
		if (Array.isArray(input[i])) {
			input[i] = repeats(input[i], symbols, counter);
		} else {
			if (checkRepeat(input[i], symbols)){ 
				if (input[i] in counter) {
					temp = input[i];
					input[i] = input[i] + counter[temp];
					counter[temp] ++;
				} else {
					temp = input[i];
					counter[input[i]] = 0;
				}
			}
		}
	}
	return input;
}

function checkRepeat(symbol, symbols) {
	for (var i = 0; i < symbols.length; i++) {
		if (symbol == symbols[i].symbol) {
			if (symbols[i].type == "atom" || symbols[i].type == "formula") {
				return true;
			}
		}
	}

	return false;
}

function parser(input, seperator, symbols, seperators) {
	var parsedInput = formatter(input, seperator);
	repeats(parsedInput, symbols, new Object());
	var taggedInput = tag(parsedInput, symbols);
	var parsedTagged = split_all(taggedInput, seperators);
	var splitParsedTagged = final_split(parsedTagged, seperator);
	var joinTagged = [splitParsedTagged[0].map(joinTags), splitParsedTagged[1], splitParsedTagged[2].map(joinTags)]
	var ctxParsedL = setParser(joinTagged[0], seperators);
	var ctxParsedR = setParser(joinTagged[2], seperators);
	return "(" + ctxParsedL + ', Con("' + joinTagged[1][0] + '"), ' + ctxParsedR + ")";
}


var input = "A v B -> B";
var sep = "->";
var symbols = [{symbol : "A", type : "atom"}, {symbol : "B", type : "formula"}, {symbol : "v", type : "connective"}, {symbol : "->", type : "connective"}, {symbol : "Gamma", type :"set"}, {symbol : "neg", type :"unary"}];
var seperators = [";"];

console.log(parser(input, sep, symbols, seperators));
















