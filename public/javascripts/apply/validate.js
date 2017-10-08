//adding symbol types to the rule
function addTypes(symbols, types) {

	symbolsTypes = [];
	symbol = '';
	type = '';

	//match the types to the symbols
	for (var i = 0; i < symbols.length; i++) {
		for (var j = 0; j < types.length; j++) {
			if (symbols[i] == types[j].symbol) {
				type = types[j].type;
			}
		}

		//adding the symbol with its type to the list
		symbol = symbols[i];
		symbolsTypes.push([symbol, type]);
		symbol = '';
		type = '';
	}

	return symbolsTypes;
}

//checking if a sequent matches the types of a rule 
function checkTypes (sequent, rule) {
	//check if the length of both sequents matches
	if (rule.length === sequent.length) {

		//check if the types are matching
		for (var i = 0; i < rule.length; i++) {
			//rule[i] = [symbol, type]
			//sequent[i] = [symbol, type]
			if (rule[i][1] != sequent[i][1]) {

				//checking if the symbol type is a formula, and we got an atom
				if (!(rule[i][1] === 'formula' && sequent[i][1] === 'atom')) {
					console.log("non matching type(s)");
					return false;
				}
			} 

			//checking if the rule and the sequent have the same connective
			if (rule[i][1] === 'connective' && rule[i][0] != sequent[i][0]) {
				console.log("non matching connective");
				return false;
			}
		}
	} else {
		console.log("non matching length");
	}

	return true;
}

//tests
//console.log(checkTypes([['a', 'atom'], ['\\wedge', 'connective'], ['b', 'formula'], ['->', ''], ['c', 'atom']], [['a', 'formula'], ['\\wedge', 'connective'], ['b', 'formula'], ['->', ''], ['c', 'formula']]))
//console.log(checkTypes([['a', 'formula'], ['\\wedge', 'connective'], ['b', 'formula'], ['->', ''], ['c', 'atom']], [['a', 'formula'], ['\\wedge', 'connective'], ['b', 'formula'], ['->', ''], ['c', 'formula']]))
//console.log(checkTypes([['\\wedge', 'connective'], ['b', 'formula'], ['->', ''], ['c', 'atom']], [['a', 'formula'], ['\\wedge', 'connective'], ['b', 'formula'], ['->', ''], ['c', 'formula']]))
//console.log(checkTypes([['a', 'set'], ['\\vee', 'connective'], ['b', 'formula'], ['->', ''], ['c', 'atom']], [['a', 'formula'], ['\\wedge', 'connective'], ['b', 'formula'], ['->', ''], ['c', 'formula']]))
//console.log(checkTypes([['a', 'atom'], ['\\vee', 'connective'], ['b', 'formula'], ['->', ''], ['c', 'atom']], [['a', 'formula'], ['\\wedge', 'connective'], ['b', 'formula'], ['->', ''], ['c', 'formula']]))















