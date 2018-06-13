function table(symbols)

	var table = document.getElementById('table');

	// intializing the table
	table.innerHTML = '<table class="ui sortable fixed single line celled table"> <thead> <tr><th>Symbols</th> <th>Type</th> </tr></thead> <tbody id="table_body"></tbody> </table>';
	var table_body = document.getElementById('table_body');
	table_body.innerHTML = "";

	// filling the table with symbols
	for (var i = 0; i < symbols.length; i++) {
		table_body.innerHTML += '<tr><td id="t' + i.toString() + '" >$$'+  symbols[i] + '$$</td><td style="overflow: visible;"><select class="ui search dropdown" style="z-index: 1; position: fixed" id="select-' + i +'" ><option value="">Type</option><option value="0">atom</option><option value="1">formula</option><option value="2">connective</option><option value="3">set</option><option value="4">unary</option><option value="5">primary separator</option><option value="6">separator</option></select></td></tr>';
	}

	table.innerHTML += '<a onClick="addRule()" class="ui teal button" href="/">Add Rule</a>';

	// rendering the symbols in mathjax
	for (var i = 0; i < symbols.length; i++) {
		MathJax.Hub.Queue(["Typeset",MathJax.Hub,document.getElementById('t' + i.toString())]);
	}
	
	$('.ui.search.dropdown').dropdown();
}