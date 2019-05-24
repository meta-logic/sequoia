var counter = 1;

function applyRule(i) {
	var rule = $('#r' + i).data('rule');
	console.log(rule);
	console.log(sequentDerivation);

	sequentDerivation = parser.parse(rule_id_text).replace(/\\/g, '\\\\');

	$.post('/apply', { rule: rule, sequent: sequentDerivation }, function(data, status) {
		console.log('Derivation: ' + data.output.replace(/ "/g, '').replace(/" /g, '').replace(/"/g, ''));
		console.log('Data: ' + data + '\nStatus: ' + status);
		addDerivation(
			rule,
			data.output.replace(/ "/g, '').replace(/" /g, '').replace(/"/g, '').replace(/\\\\/g, '\\').split(',')
		);
	});
}

function addDerivation(rule, derivations) {
	build_proof_tree('prooftree', rule_id, rule, derivations);
	$('.conc-temp').click(function() {
		rule_id = parseInt(this.id.split('_')[1]);
		rule_id_text = $(this).find('script')[0].innerText;
		console.log(rule_id_text);
	});
}

function setSequent(i) {
	console.log(i);
	var seq = $('#' + i).data('rule').replace(/\(/g, '').replace(/\)/g, '');
	sequentDerivation = parser.parse(seq).replace(/\\/g, '\\\\');
}
