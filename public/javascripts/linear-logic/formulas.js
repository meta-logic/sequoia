// getting the formulas that will be present in the linear translation
function formulas(sequents, types) {
    var sequents_copy = sequents.slice();
    var premises_sequents = sequents_copy.slice(0,-1); // getting the premises
    var conclusion_sequent = sequents_copy.slice(-1)[0]; // getting the conclusion
    var sequents_result = []; 
    var premises, conclusion, premises_formulas, conclusion_formulas, temp;

    // extracting only the formulas
    premises = premises_sequents.map(function (premise) {return getSymbols(premise, types, 'formula');});
    conclusion = getSymbols(conclusion_sequent, types, 'formula');

    // checking for the following case: premise: A,A conclusion: A
    if (premises.length === 1 && equalArr(Array.from(new Set(premises[0])), conclusion)) {
        
        premises_formulas = premises;
        conclusion_formulas = conclusion;
    
    // checking for the following case: premise: A_i conclusion: A_1 v A_2
    } else if (premises.length === 1 && premises[0].length === 1 && conclusion.length === 1) {
        
        if ((conclusion[0].split(premises[0][0].split('_')[0]).length - 1) === 2) {
            var premise_index_in_sequent = sequents_copy[0].indexOf(premises[0][0]);

            // Inserting B in the original sequent
            sequents_copy[0].splice(premise_index_in_sequent + 1, 0, 'B');
            premises[0][0] = premises[0][0].split("_")[0];
            premises.push('B');
            premises_formulas = premises;
            conclusion_formulas = conclusion;

            // removing the _i from the formula
            sequents_copy[0][premise_index_in_sequent] = premises[0][0].split("_")[0];
        }
    
    // General Case
    } else {

        // getting the translation formulas of the premises
        premises_formulas = premises.map(function (premise) {return premise.diff(conclusion); });

        // getting the translation formulas of the conclusion
        conclusion_formulas = premises.map(function (premise) { return conclusion.diff(premise); });

        conclusion_formulas = Array.from(new Set([].concat.apply([], conclusion_formulas)));

        // checking if the conclusion formulas did not result in anything since they are present
        // in the premises, premise: [A v B, A] conclusion: [A v B], premise - conclusion = []  
        if (conclusion_formulas.length === 0) {

            // getting the max length conclusion  formula
            conclusion_formulas = [conclusion.reduce(function (a, b) { return a.length > b.length ? a : b; })];
        }
    }

    temp = [];
    // remove all unnecessary formulas, context, separators
    for (var i = 0; i < premises_sequents.length; i++) {
        for (var j = 0; j < premises_sequents[i].length; j++) {
            if (premises_formulas[i].includes(premises_sequents[i][j]) || isType(premises_sequents[i][j], types, 'separator')) {
                temp.push(premises_sequents[i][j]);
            }
        }
        // if (temp.length != 0 && isType(temp[0], types, 'separator')) temp = temp.slice(1);
        sequents_result.push(temp);
        temp = [];
    }

    sequents_result.push(conclusion_formulas);
    return sequents_result;
} 