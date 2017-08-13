function table(symbols) {

	var uniqueSymbols = [];

	// parsing the symbols and filtering it off duplicates and commas
	symbols = symbols.split(" ");
	$.each(symbols, function(i, el){
	    if($.inArray(el, uniqueSymbols) === -1) uniqueSymbols.push(el);
	});
	for (var i = uniqueSymbols.length - 1; i >= 0; i--) {
		uniqueSymbols[i] = uniqueSymbols[i].replace (/,/g, "");
	}
	uniqueSymbols.filter(Boolean);


	// geeting the table container
	var table = document.getElementById('table');

	// intializing the table
	table.innerHTML = '<table class="ui sortable fixed single line celled table"> <thead> <tr><th>Symbols</th> <th>Type</th> <th>Precedence</th> </tr></thead> <tbody id="table_body"></tbody> </table>';
	var table_body = document.getElementById('table_body');
	table_body.innerHTML = "";

	// filling the table with symbols
	for (var i = 0; i < uniqueSymbols.length; i++) {
		table_body.innerHTML += '<tr><td id="t' + i.toString() + '" >$$'+  uniqueSymbols[i] + '$$</td><td style="overflow: visible;"><select class="ui search dropdown" style="z-index: 1; position: fixed"><option value="">Type</option><option value="0">atom</option><option value="1">formula</option><option value="2">connective</option><option value="3">list</option><option value="4">set</option><option value="5">empty</option><option value="6">multiset</option><option value="7">separator</option></select></td> <td><div class="ui right input"><input id="'+i.toString() +'" type="text" placeholder="Precedent"></div></td></tr>';
	}

	table.innerHTML += '<a onClick="addRule()" class="ui teal button" href="/">Add Rule</a>';

	// rendering the symbols in mathjax
	for (var i = 0; i < uniqueSymbols.length; i++) {
		MathJax.Hub.Queue(["Typeset",MathJax.Hub,document.getElementById('t' + i.toString())]);
	}
	
	$('table').tablesort();
	$('.ui.search.dropdown').dropdown();
}