function sequent (atom, left, right, representation, connective_preced, connective_rep) {
	atom           = this.atom;
	left           = this.left;
	right          = this.right;
	representation = this.representation;
	connective     = {
		precedence     : this.connective_preced,
		representation : this.connective_rep
	};

};

function addRule() {
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

	$.post('/api/rule', { rule : rule, premises : prem.toString() , conclusion : conc}, function(data, status){
		console.log(data);
        console.log("Data: " + data + "\nStatus: " + status);
    });
}