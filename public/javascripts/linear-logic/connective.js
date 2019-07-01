// getting the type of connective to put in between premises if any - Tested
function get_connective(sequents, types) {

    if (sequents.length == 3) {
        var leftContext = getSymbols(sequents[0], types, "context")
        var rightContext = getSymbols(sequents[1], types, "context")
        var conContext = getSymbols(sequents[2], types, "context")

        if (equalArr(leftContext, conContext) && equalArr(rightContext, conContext)) {
            return "\\&"
        } else {
            return "\\otimes"
        }
    }

    if (sequents.length == 2) {
        if (sequents[0].length > sequents[1].length) {
            return "\\clubsuit"
        } else {
            return "\\oplus"
        }
    }

    return "\\otimes"
}