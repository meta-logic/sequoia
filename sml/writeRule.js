var fs = require('fs');

function writeRule(rule, conclusion, premises, arguments, toString) {

	var datatypes = fs.readFileSync(__basedir + '/sml/datatypes.sml','utf8');
	if (toString == "ctx") {
		datatypes += "\nfun toString (s) = ctx_toString(s)\n\n\n";
	} else {
		datatypes += "\nfun toString (s) = seq_toString(s)\n\n\n";
	}

	rule = rule.replace("\\", "");
	rule = rule.replace(/ /g, "_");

	conclusion = conclusion.replace(/"\\/g, "temp@");
	premises = premises.map(function (premise) {return premise.replace(/"\\/g, "temp@")});
	conclusion = conclusion.replace(/\\/g, "");
	premises = premises.map(function (premise) {return premise.replace(/\\/g, "")});
	conclusion = conclusion.replace(/temp@/g, '"\\\\');
	premises = premises.map(function (premise) {return premise.replace(/temp@/g, '"\\\\')});

	if (arguments.length == 0) {
		var file = datatypes + 'fun ' + rule + ' (' + conclusion + ') = [' + premises.join() + ']\n\t| ' + rule +' _ = []\n';
	} else {
		var file = datatypes + 'fun ' + rule + ' (' + conclusion + ',' + arguments.join(',') + ') = [' + premises.join() + ']\n\t| ' + rule +' _ = []\n';
	}


	fs.writeFile(__basedir + '/sml/' + rule + '.sml', file, function (err) { 
	    if (err)
	        console.log(err);
	    else
	        console.log('Write operation complete.');
	});
}

// writeRule('And', 'Form(Form(Atom (A),Con ("\\\\wedge"),Atom (B)),(Con ("\\\\Rightarrow")),(Atom (C)))', ['Form((Atom (A)),(Con ("\\\\Rightarrow")),(Atom (C)))'], ["A", "B"], [["A", "B", "C", "D"]]);

module.exports = {writeRule}
