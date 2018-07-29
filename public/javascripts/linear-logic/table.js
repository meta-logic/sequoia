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
	return types;
}

// Getting the symbol types from the table
function getSymbolTypes(rule, types) {
	// getting the symbols
	var seq_symbol = getSequentSymbols(rule);
	var seq_list = seq_symbol[0];
	var symbols = seq_symbol[1];
	var original_sequents = seq_symbol[2];
	var types = fixTypes(types);
	var separators = [];
	var connectives = [];
	var subs = [];

	// getting the types
	for (var i = 0; i < symbols.length; i++) {

		if (types[symbols[i]] == "connective") {
			connectives.push(symbols[i]);
		}

		if (types[symbols[i]] == "separator") {
			original_sequents = original_sequents.map(function (seq) {
				return seq.replace(symbols[i], "$split$" + symbols[i] + "$split$");
			});
		}

		if (types[symbols[i]] == "arrow") {
			types["arrow"].push(symbols[i]);
			console.log(types["arrow"]);
			types[symbols[i]] = "separator";
			original_sequents = original_sequents.map(function (seq) {
				return seq.replace(symbols[i], "$split$" + symbols[i] + "$split$");
			});
		}

	}

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

	subs = original_sequents.map(function (seq) {return generateSubs(seq, types)});
	var max = subs[0];
	//console.log(subs);
	for (var i = 0; i < subs.length; i++) {
		if (max.length < subs[i].length) max = subs[i]; 
	}
	//console.log("subs", subs);
	//console.log(original_sequents);
	console.log(types);
	return [original_sequents, types, max];
}