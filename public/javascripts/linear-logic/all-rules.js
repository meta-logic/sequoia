$.get('/api/get-rules', function (rules, status) {
	$.get('/api/symbols', function(types, status) {
		// console.log("one time");
		var rules_sequents = [];
		var temp = "";
		var max_sub = []; 
		console.log("dsfsdf", types.symbols.symbols);
		for (var i = 0; i < rules.length; i++) {
			temp = getSymbolTypes(rules[i], types.symbols.symbols);
			if (temp[2].length > max_sub.length) max_sub = temp[2];
			rules_sequents.push(temp);
		}
		types = rules_sequents[0][1];
		console.log("dsfsdf", types);
		for (var i = 0; i < rules_sequents.length; i++) {
			translate(rules_sequents[i][0], types, types["arrow"][0], max_sub, i, rules[i].rule);
		}

	});
});
