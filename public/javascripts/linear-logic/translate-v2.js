// // translating a rule to linear logic
// function translate (seq_list, types, arrows, subs, rule, i) {
//     var premises = [];
//     var conclusion = seq_list[seq_list.length - 1];
//     var premises_formulas, conclusion_formulas;
    
//     // filling up the premises
//     for (var i = 0; i < sequent_list.length - 1; i++) {
// 		premises.push(sequent_list[i]);
// 	}

//     // getting the empty subs
//     premises_empty = premises.map(function (premise) {return getEmptySubs (premise, types, subs, arrows);});
//     conclusion_empty = getEmptySubs(conclusion, types, subs. arrows);

//     // get updated formulas
//     premises_formulas = premises.map(function (premise) {return getUpdatedFormulas (premise, conclusion, types, arrows);});
//     if (seq_list.length == 1) conclusion_formulas = getConclusionUpdatedFormulas(conclusion, premises, types, arrows);
//     if (seq_list.length == 2) {conclusion_formulas = getConclusionUpdatedFormulas(conclusion, premises[0], types, arrows);}
//     else {
//         var conc1 = getConclusionUpdatedFormulas (conclusion, premises[0], types, arrow);
// 		var conc2 = getConclusionUpdatedFormulas (conclusion, premises[1], types, arrow);
// 		conclusion_formulas = [conclusionUpdatedFormulas(conc1[0], conc2[0]),
// 							   conclusionUpdatedFormulas(conc1[1], conc2[1])];
//     }
    
//     // get connective
//     var connective = getConnective (seq_list, types);

// }