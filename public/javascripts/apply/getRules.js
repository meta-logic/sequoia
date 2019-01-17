var rules = "";
var rules_container = document.getElementById("rules");
var rule_container = "";
var temp = "";

$.get('/api/get-rules', function (rules, status) {
	rules = rules;
	for (var i = 0; i < rules.length; i++) {
		temp = "'" + rules[i]._id + "'";
		rules_container.innerHTML += '<a class="item" id="r'+ i.toString() +'" onClick="applyRule('+i+')" data-rule="'+rules[i].rule+'" ></a>';
		rule_container = document.getElementById(("r" + i.toString()));
		rule_container.innerHTML = "\\[\\frac{"+ rules[i].premises.join(" \\quad \\quad ")+"}{"+ rules[i].conclusion +"}"+rules[i].rule+"\\]";
		MathJax.Hub.Queue(["Typeset",MathJax.Hub,rule_container]);	
	}

});
