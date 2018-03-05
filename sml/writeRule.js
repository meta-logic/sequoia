var fs = require('fs');

function writeRule(rule, conclusion, premises, conclusion_list, premises_list) {
	console.log(__basedir);
	var datatypes = fs.readFileSync(__basedir + '/sml/datatypes.sml','utf8');
	var arguments = extraArguments(conclusion_list, premises_list);
	rule = rule.replace("\\", "");
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
