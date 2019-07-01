// check if two arrays are equal
function equalArr(arr1, arr2) {
    if (arr1.sort().join(",") === arr2.sort().join(",")) return true
    return false
}

// gets the difference between two arrays
Array.prototype.diff = function(a) {
    return this.filter(function(i) {
        return a.indexOf(i) < 0
    })
}

// check the type of a symbol - Tested
function isType(symbol, types, type) {
    return types[symbol] == type
}

// get all the symbols of a specific type - Tested
function getSymbols(sequent, types, type) {
    var symbols = []

    for (var i = 0; i < sequent.length; i++) {
        if (isType(sequent[i], types, type)) symbols.push(sequent[i])
    }

    return symbols
}

// compare two sub lists and pick the max one
function max_sub (separators, max, primary_separator) {
    var left_separators = separators.filter(function (separator) { return separator[1] == "l" })
    var left_max = max.filter(function (separator) { return separator[1] == "l" })
    var right_separators = separators.filter(function (separator) { return separator[1] == "r" })
    var right_max = max.filter(function (separator) { return separator[1] == "r" })

    if (left_separators.length > left_max.length) left_max = left_separators
    if (right_separators.length > right_max.length) right_max = right_separators

    return [].concat.apply([], [left_max, [[primary_separator, "lr"]], right_max])

}

// find the separator, if found, return true and the index of the separator
function find_separator (separators, separator) {
    for (var i = 0; i < separators.length; i++) {
        if (separators[i][0] == separator[0] && separators[i][1] == separator[1]) return [true, i]
    }
    return [false, -1]
}