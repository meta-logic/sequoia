function translate(sequent_list, types, arrow) {
	// intializing the pre-reqs
	var conclusion = sequent_list[sequent_list.length - 1];
	var subs = generateSubs(conclusion, types);
	var premises = [];

	for (var i = 0; i < sequent_list.length - 1; i++) {
		premises.push(sequent_list[i]);
	}

	// translation start
	var emptySubs = premises.map(function (premise) { return getEmptySubs (premise, types, subs, arrow); });
	var updatedFormulas = premises.map(function (premise) { return getUpdatedFormulas (premise, conclusion, types, arrow); });
	var connective = getConnective (sequent_list, types);

	console.log(emptySubs);
	console.log(updatedFormulas);
	console.log(connective);

}