var DBSymbols;

function table(symbols) {
	$.ajax({
	    url: '/api/symbols',
	    type: 'PUT',
	    data : {update : JSON.stringify({})},
	    success: function (result) {
	    	console.log(result.symbols.symbols);
	    	DBSymbols = result.symbols.symbols;
		    table1(symbols, result.symbols.symbols);
		}
	});
}



function table1(symbols, DBSymbols) {

	if (DBSymbols == null) {
		DBSymbols = {};
	}


	var pre_uniqueSymbols = [];

	// parsing the symbols and filtering it off duplicates and commas
	symbols = symbols.split(" ");
	$.each(symbols, function(i, el){
	    if($.inArray(el, pre_uniqueSymbols) === -1) pre_uniqueSymbols.push(el);
	});
	for (var i = pre_uniqueSymbols.length - 1; i >= 0; i--) {
		pre_uniqueSymbols[i] = pre_uniqueSymbols[i].replace (/,/g, "");
	}
	pre_uniqueSymbols.filter(Boolean);

	var uniqueSymbols = [];

	for (var i = 0; i < pre_uniqueSymbols.length; i++) {
		if (!(uniqueSymbols.includes(pre_uniqueSymbols[i]))) {
			uniqueSymbols.push(pre_uniqueSymbols[i]);
		}
	}



	console.log(uniqueSymbols);
	// geeting the table container
	var table = document.getElementById('table');

	// intializing the table
	table.innerHTML = '<table class="ui sortable fixed single line celled table"> <thead> <tr><th>Symbols</th> <th>Type</th> </tr></thead> <tbody id="table_body"></tbody> </table>';
	var table_body = document.getElementById('table_body');
	table_body.innerHTML = "";

	// filling the table with symbols
	for (var i = 0; i < uniqueSymbols.length; i++) {
		table_body.innerHTML += '<tr><td id="t' + i.toString() + '" >$$'+  uniqueSymbols[i] + '$$</td><td style="overflow: visible;"><select class="ui search dropdown" style="z-index: 1; position: fixed" id="select-' + i +'" ><option value="">Type</option><option value="0">atom</option><option value="1">formula</option><option value="2">connective</option><option value="3">set</option><option value="4">unary</option><option value="5">primary separator</option><option value="6">separator</option></select></td></tr>';
		if (Object.keys(DBSymbols).includes(uniqueSymbols[i])) {
			$('#select-' + i).dropdown('set text', DBSymbols[uniqueSymbols[i]]);
		}
	}

	table.innerHTML += '<a onClick="addRule()" class="ui teal button" href="/">Add Rule</a>';

	// rendering the symbols in mathjax
	for (var i = 0; i < uniqueSymbols.length; i++) {
		MathJax.Hub.Queue(["Typeset",MathJax.Hub,document.getElementById('t' + i.toString())]);
	}
	
	$('table').tablesort();
	$('.ui.search.dropdown').dropdown();
}
