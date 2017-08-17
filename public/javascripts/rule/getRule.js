$.get('/api/rule/' + document.getElementById('id').innerHTML , function (data, status) {
	console.log(data);
	var rule = data.rule;
	document.getElementById('rule_connective').value = data.rule.rule;
	document.getElementById('Conclusion').value = data.rule.conclusion;


	data.rule.premises = data.rule.premises[0].split(',');
	for (var i = 1; i < data.rule.premises.length; i++) {
		addPremise();
	}

	for (var i = 0; i < data.rule.premises.length; i++) {
		document.getElementById("i" + i.toString()).value = data.rule.premises[i];
	}

});