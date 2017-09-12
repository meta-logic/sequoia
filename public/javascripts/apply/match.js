function seperate_premise (premise, seperator) {
	var indexToSplit = premise.indexOf(seperator);
	var left = premise.slice(0, indexToSplit);
	var right = premise.slice(indexToSplit + 1);
	return [left, right];
}

function tagging (premises, conclusion) {

	for (var k = 0; k < premises.length; k++) {
		for (var i = 0; i < premises[k].length; i ++) {
			premises[k][i] = [premises[k][i], -1];
			for (var j = 0; j < conclusion.length; j++) {
				if (conclusion[j] == premises[k][i][0]) {
					premises[k][i][1] = j;
				}
			}
		}
	}

	return premises;
}

function match_tags (premise, tagged_premises) {

	for (var i = 0; i < tagged_premises.length; i++) {
		for (var j = 0; j < tagged_premises[i].length; j++) {
			if (tagged_premises[i][j][1] != -1) {
				tagged_premises[i][j] = premise[tagged_premises[i][j][1]];
			} else {
				tagged_premises[i][j] = tagged_premises[i][j][0];
			}
		}
	}

	return tagged_premises;
}

function match_rules(premise, rule, index, seperator) {
	premise = inputParser(premise);
	var rule_ = rule.rule;
	var premises = rule.premises;
	premises = premises.map( x => inputParser(x));
	var conclusion = inputParser(rule.conclusion);
	var tagged_premises = tagging(premises, conclusion);


}