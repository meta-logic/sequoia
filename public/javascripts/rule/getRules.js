var rules = "";
var rules_container = document.getElementById("rules");
var rule_container = "";
$.get('/api/get-rules', function (rules, status) {
	rules = rules;

	for (var i = 0; i < rules.length; i++) {
		rules_container.innerHTML += '<div class="four wide column"><div class="ui card" id="r'+ i.toString() +'"></div></div>';
		rule_container = document.getElementById(("r" + i.toString()));
		console.log(rule_container);
		rule_container.innerHTML = "\\[\\frac{"+ rules[i].premises.join("\\quad \\quad")+"}{"+ rules[i].conclusion +"}"+rules[i].rule+"\\]";
		MathJax.Hub.Queue(["Typeset",MathJax.Hub,rule_container]);	
	}

	// for (var i = 0; i < rules.length; i++) {
	// }
});
