function flatten(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}

//getting the values from the input fields
function getValues (rule) {
    //console.log(rule);

    return flatten([rule.premises, rule.conclusion]);
}

// remove commas and extra spaces fromt a sequent and replace them with a single space
function removeCommaHelper(sequent) {
    sequent = sequent.replace(/,/g, " ");
    sequent = sequent.replace(/ +/g, " ");
    sequent = (sequent.length != 0) ? sequent.split(" ")  : [];
    return sequent.filter(function (elem) { return elem != ""; });
}

// remove commas and spaces from a list of sequents and rplaces them with one single space
function removeCommas (seq_list) {
    return seq_list.map(removeCommaHelper); 
}

// removing duplicates and spaces
function removeDuplicatesHelper(seq) {
    var unique_seq = Array.from(new Set(seq))
    unique_seq = unique_seq.filter (function (elem) { return elem != " "; });
    return unique_seq
}

// removing duplicates from a list of sequents
function removeDuplicates(seq_list) {
    return seq_list.map(removeDuplicatesHelper);
}

// get the uniques symbols used in all the sequents
function getSequentSymbols (rule) {
    var sequents = getValues(rule);
    var original_sequents = sequents;
    sequents = removeCommas(sequents);
    sequents = sequents.filter(function (elem) { return elem.length != 0; });
    var symbols = removeDuplicates(sequents);
    symbols = [].concat.apply([], sequents);
    symbols = removeDuplicatesHelper(symbols);
    //console.log(sequents);
    return [sequents, symbols, original_sequents];
}

// generating the symbol table
function parse(rule) {
    var values = getSequentSymbols(rule);
    var original_sequents = values[2];
    //console.log(original_sequents);
    return original_sequents;
}