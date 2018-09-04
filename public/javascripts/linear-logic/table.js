// fixing types
function fixTypes(original_types) {
	var types = Object.assign({}, original_types);
	var keys = Object.keys(types);

	for (var i = 0; i < keys.length; i++) {
		if (types[keys[i]] == "atom") types[keys[i]] = "formula";
		if (types[keys[i]] == "set") types[keys[i]] = "context";
		if (types[keys[i]] == "unary") types[keys[i]] = "operator";
		if (types[keys[i]] == "primary separator") types[keys[i]] = "arrow";
	}

	types["arrow"] = [];
	types["connective"] = [];
	return types;
}

// Getting the symbol types from the table
function getSymbolTypes(rule, types) {
	// getting the symbols
	var seq_symbol = getSequentSymbols(rule);
	var symbols = seq_symbol[1];
	var original_sequents = seq_symbol[2];
	var types = fixTypes(types);
	var connectives = [];

	// defining the types
	for (var i = 0; i < symbols.length; i++) {

		if (types[symbols[i]] == "connective") {
			connectives.push(symbols[i]);
			types["connective"].push(symbols[i]);
		}

		if (types[symbols[i]] == "separator") {
			original_sequents = original_sequents.map(function (seq) {
				return seq.replace(symbols[i], "$split$" + symbols[i] + "$split$");
			});
		}

		if (types[symbols[i]] == "arrow") {
			types["arrow"].push(symbols[i]);
			types[symbols[i]] = "separator";
			original_sequents = original_sequents.map(function (seq) {
				return seq.replace(symbols[i], "$split$" + symbols[i] + "$split$");
			});
		}

	}

	// splitting the symbols at the right point
	original_sequents = original_sequents.map( function (seq) { 
		seq = seq.split(/\$split\$|,/);
		seq = seq.map(function (symbol) {
			symbol = symbol.replace(/ +/g, " ").trim();
			for (var i = 0; i < connectives.length; i++) {
				if (symbol.includes(connectives[i])) types[symbol] = "formula";
			}
			return symbol;
		});

		return seq;
	});
	
	console.log("OG", original_sequents);

	return [original_sequents, types];
}