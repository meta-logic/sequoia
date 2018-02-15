var fs = require('fs');

Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};

function flatten(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}

function extraArguments(conclusion_list, premises_list) {

	var arguments = [];

	for (var i = 0; i < premises_list.length; i++) {
		arguments.push(premises_list[i].diff(conclusion_list));
	}

	arguments = flatten(arguments);
	return Array.from(new Set(arguments));

}

function writeRule(rule, conclusion, premises, conclusion_list, premises_list) {
	var datatypes = fs.readFileSync('datatypes.sml','utf8');
	var arguments = extraArguments(conclusion_list, premises_list);
	if (arguments == []) {
		var file = datatypes + 'fun ' + rule + ' (' + conclusion + ') = [' + premises.join() + ']\n\t| ' + rule +' _ = []\n';
	} else {
		var file = datatypes + 'fun ' + rule + ' (' + conclusion + ',' + arguments.join(',') + ') = [' + premises.join() + ']\n\t| ' + rule +' _ = []\n';
	}


	fs.writeFile(rule + '.sml', file, function (err) { 
	    if (err)
	        console.log(err);
	    else
	        console.log('Write operation complete.');
	});
}

writeRule('And', 'Form(Form(Atom (A),Con ("\\\\wedge"),Atom (B)),(Con ("\\\\Rightarrow")),(Atom (C)))', ['Form((Atom (A)),(Con ("\\\\Rightarrow")),(Atom (C)))'], ["A", "B"], [["A", "B", "C", "D"]]);

