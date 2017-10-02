//adding symbol types to the rule
function addTypes(symbols, types) {

	symbolsTypes = [];
	key = '';
	val = '';

	//match the types to the symbols
	for (var i = 0; i < symbols.length; i++) {
		for (var j = 0; j < types.length; j++) {
			if (symbols[i] == types[j].symbol) {
				val = types[j].type;
			}
		}

		//adding the symbol with its type to the list
		key = symbols[i];
		symbolsTypes.push([key, val]);
		key = '';
		val = '';
	}

	return symbolsTypes;
}

