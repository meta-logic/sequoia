var sep;
var seperators = ["ewf3e2dew###dwd"];

function getSymbols() {
	var symbols = [];
	var table_symbols = document.getElementsByClassName("ui search dropdown selection");
	for (var i = 0; i < table_symbols.length; i++) {
		var symbol = document.getElementById("t" + i).getElementsByTagName("script")[0].innerHTML;
		var type = table_symbols[i].getElementsByClassName("text")[0].innerHTML;
		if (type == "primary seperator") {
			sep = symbol;
			type = 'connective';
		}

		if (type == 'seperator') {
			seperator.push(symbol);
			type = 'connective';
		}

		symbols.push({'symbol' : symbol, 'type' : type});
	}

}

function addRule() {
	getSymbols();
	var prem = [];
	var rule = document.getElementById("rule_connective").value;
	console.log(rule);
	// adding premises
	prem.push(document.getElementById("i0").value);
	for (var i = 1; i <= v; i++) {
		prem.push(document.getElementById("i" + i.toString()).value);
	}

	// conclusion
	var conc = document.getElementById("Conclusion").value;

	if (prem[0] != ''){

		console.log("premises:");
		for (var i = 0; i < prem.length; i++) {
			console.log(parser(prem[i], sep, symbols, seperators));
		}
	}


	console.log("Conclusion:");
	console.log(parser(conc, sep, symbols, seperators));

	// $.post('/api/rule', { rule : rule, premises : JSON.stringify(prem) , conclusion : conc}, function(data, status){
	// 	console.log(data);
 //        console.log("Data: " + data + "\nStatus: " + status);
 //    });
}