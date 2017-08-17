function addRule() {
	console.log('update');
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
	console.log(conc);

    $.ajax({
	    url: '/api/rule',
	    type: 'PUT',
	    data : { id : document.getElementById('id').innerHTML , rule : rule, premises : prem.toString() , conclusion : conc},
	    success: function(result) {
	        console.log(result);
	    }
	});
}