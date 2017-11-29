var cmd = require('node-cmd');

function applyRule (rule, input) {
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
	    if (data_line[data_line.length-1] == '\n') {
    	// console.log(count);
      // console.log(data_line);
    }
	    if (count === 5) {
	    	x = data_line.split('it =');
	    	console.log('Answer: ', x[2].split(':')[0].replace("[", '').replace("]", ''));
	    }
	  }
	);

	const smlTerminalInput = 'use "' + rule + '.sml";\n ' + rule + ' (' + input + ');\nOS.Process.exit(OS.Process.success);\n';

	processRef.stdin.write(smlTerminalInput);
}

applyRule('And', 'Form(Form(Atom ("hi"),Con ("\\\\wedge"),Atom ("hello")),(Con ("\\\\Rightarrow")),(Atom ("Can")))');