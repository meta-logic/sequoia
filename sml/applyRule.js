var cmd = require('node-cmd');

function applyRule (rule, input, res) {
	console.log("I am in");
	const processRef = cmd.get('sml');
	let data_line = '';
	var x = '';
	var count = 0;
	var temp = [];
	//listen to the sml terminal output
	processRef.stdout.on(
		'data',
		function(data) {
			data_line += data;
			count ++;


	   //  if (data_line[data_line.length-1] == '\n') {
    // }
    if (count == 7) {
    	x = data_line.split('it =');
    	try {
    		var answer = x[2].split(':')[0].replace("[", '').replace("]", '');
    		console.log('Answer: ', answer);
    		return res.status(200).json({
				'status' : 'success',
				'output' : answer
			});
    	} catch (e) {
    		console.log(x);
    	} 
    }
}
);

	const smlTerminalInput = 'use "' + __basedir + '/sml/' + rule + '.sml";\nmap(fn x => toString(x))(' + rule + ' (' + input + '));\nOS.Process.exit(OS.Process.success);\n';
	console.log(smlTerminalInput);

	processRef.stdin.write(smlTerminalInput);
}

// applyRule('and_R', 'Form(Form(Atom ("hi"),Con ("\\\\wedge"),Atom ("hello")),(Con ("\\\\Rightarrow")),(Atom ("Can")))');

module.exports = {applyRule}
