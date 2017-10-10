function flatten(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}

//format the input given by the user to the desired form we need to apply the rules
function formatter(input, symbol) {

	//splitting at the symbol if presented
	var temp_tokens = input.split(symbol);
	var tokens = [];
	if (temp_tokens.length > 1) {
		for (var i = 0; i < temp_tokens.length - 1; i++) {
			tokens.push(temp_tokens[i]);
			tokens.push(symbol);
		}
		tokens.push(temp_tokens[temp_tokens.length - 1]);
	} else {
		tokens = temp_tokens;
	}

	//seperating the formulas between the commas
	tokens = tokens.map(function (x) {return x.split(",");});
	tokens = flatten(tokens);

	//applying the input parser on each input to get the symbols by themselves
	tokens = tokens.map(inputParser);

	return tokens;
}