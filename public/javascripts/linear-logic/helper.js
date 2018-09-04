// check if two arrays are equal
function equalArr(arr1, arr2) {
  if (arr1.sort().join(",") === arr2.sort().join(",")) return true;
  return false;
}

// gets the difference between two arrays
Array.prototype.diff = function(a) {
  return this.filter(function(i) {
    return a.indexOf(i) < 0;
  });
};

// check the type of a symbol - Tested
function isType(symbol, types, type) {
  return types[symbol] == type;
}

// get all the symbols of a specific type - Tested
function getSymbols(sequent, types, type) {
  var symbols = [];

  for (var i = 0; i < sequent.length; i++) {
    if (isType(sequent[i], types, type)) symbols.push(sequent[i]);
  }

  return symbols;
}