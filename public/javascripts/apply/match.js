function seperate_premise (premise, seperator) {
	var indexToSplit = premise.indexOf(seperator);
	var left = premise.slice(0, indexToSplit);
	var right = premise.slice(indexToSplit + 1);
	return [left, right];
}

function tagging (premises, conclusion) {

	var premises_c = premises.slice();

	for (var k = 0; k < premises_c.length; k++) {
		for (var i = 0; i < premises_c[k].length; i ++) {
			premises_c[k][i] = [premises_c[k][i], -1];
			for (var j = 0; j < conclusion.length; j++) {
				if (conclusion[j] == premises_c[k][i][0]) {
					premises_c[k][i][1] = j;
				}
			}
		}
	}

	return premises_c;
}

function match_tags (premise, tagged_premises_c) {

	var tagged_premises = tagged_premises_c.slice();

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