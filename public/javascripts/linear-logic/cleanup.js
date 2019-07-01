// clean up the sequents from separators, and rewrite formulas
function cleanup(sequents, types) {

    var regex_for_variables = new RegExp(/\([a-zA-Z]\//)
    var remove = false
    
    for (var i = 0; i < sequents.length; i++) {
        
        // checking for unwanted formulas such as [A, ->, C] => [A, ->]
        if (sequents[i][0].length > 2) {
            if (types["arrow"].includes(sequents[i][0][sequents[i][0].length - 2][0]) && sequents[i][0][sequents[i][0].length - 1][0] == "C") {
                sequents[i][0] = sequents[i][0].filter(function (formula) { return formula[0] != "C" })
            }
        }  

        // iterating through the formulas to remove separators
        sequents[i][0] = sequents[i][0].filter(function (formula) { return isType(formula[0], types, "formula") })
        
        // fixing the naming of A(t/x) to A_x and \forall_x(A) to \forall A
        for (var j = 0; j < sequents[i][0].length; j++) {
            // \forall_x(A) to \forall A and exists
            if (sequents[i][0][j][0].includes("forall") || sequents[i][0][j][0].includes("exists")) {
                sequents[i][0][j][0] = sequents[i][0][j][0].replace(/_[a-zA-Z0-9]{1}/, "_").replace(/\(/, "").replace(/\)/, "").replace("_", " ")
            }

            // A(t/x) to A_x
            if (regex_for_variables.test(sequents[i][0][j][0])) {
                sequents[i][0][j][0] = sequents[i][0][j][0].replace(/\([a-zA-Z]\//, "_").replace(")", "")
            }
        }

    }

    return sequents
}