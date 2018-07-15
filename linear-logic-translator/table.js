function table(symbols) {

	var table = document.getElementById('table');

	// intializing the table
	table.innerHTML = '<table class="ui sortable fixed single line celled table"> <thead> <tr><th>Symbols</th> <th>Type</th> </tr></thead> <tbody id="table_body"></tbody> </table>';
	var table_body = document.getElementById('table_body');
	table_body.innerHTML = "";

	// filling the table with symbols
	for (var i = 0; i < symbols.length; i++) {
		table_body.innerHTML += '<tr><td id="t' + i.toString() + '" >$$'+  symbols[i] + '$$</td><td style="overflow: visible;"><select class="ui search fluid dropdown" style="z-index: 1; position: fixed" id="select-' + i +'" ><option value="">Type</option><option value="0">formula</option><option value="1">context</option><option value="2">separator</option><option value="3">arrow</option><option value="4">connective</option><option value="5">empty</option></select></td></tr>';
	}

	table.innerHTML += '<a onClick="getSymbolTypes()" class="ui teal button right floated">Translate</a>';

	// rendering the symbols in mathjax
	for (var i = 0; i < symbols.length; i++) {
		MathJax.Hub.Queue(["Typeset",MathJax.Hub,document.getElementById('t' + i.toString())]);
	}
	
	$('.ui.search.dropdown').dropdown();
}

// Getting the symbol types from the table
function getSymbolTypes() {
	// getting the symbols
	var seq_symbol = getSequentSymbols();
	var seq_list = seq_symbol[0];
	var symbols = seq_symbol[1];
	var original_sequents = seq_symbol[2];
	console.log("origin");
	console.log(original_sequents);
	var types = {};
	var separators = [];
	var connectives = [];

	// getting the types
	for (var i = 0; i < symbols.length; i++) {
		types[symbols[i]] = $("#select-" + i).dropdown("get text");

		if (types[symbols[i]] == "connective") {
			connectives.push(symbols[i]);
		}

		if (types[symbols[i]] == "separator") {
			original_sequents = original_sequents.map(function (seq) {
				return seq.replace(symbols[i], "$split$" + symbols[i] + "$split$");
			});
		}

		if (types[symbols[i]] == "arrow") {
			types["arrow"] = symbols[i];
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

	console.log(original_sequents);

	console.log(types);
	console.log(seq_list);
	translate(original_sequents, types, types["arrow"]);
}