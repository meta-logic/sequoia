function getCalculuses() {

	return $.ajax({
     type: 'GET',
     url: '/api/calculuses',
     success: function(data) {
          return data
     	}
	});
}


function getRule(id) {

	return $.ajax({
     type: 'GET',
     url: '/api/rule/' + id,
     success: function(data) {
          return data
     	}
	});
}


$.when(getCalculuses()).done(function (res) {
	var rule;
	var calc = res.calculuses;

	for (var i = 0; i < calc.length; i++) {

		//check if there are rules
		if (calc[i].rules.length > 0) {
			$.when(getRule(calc[i].rules[0])).done(function (data) {
				rule = data.rule;
				calc[i].rule = rule.rule;
				calc[i].premises = rule.premises;
				calc[i].conclusion = rule.conclusion;
				console.log(calc);
			});
		}
	}

	console.log(calc);  

});