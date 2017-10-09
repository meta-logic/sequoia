function flatten(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}

//format the input given by the user to the desired form we need to apply the rules
function formatter(input, connective) {

	//splitting at the connective if presented
	var temp_tokens = input.split(connective);
	var tokens = [];
	if (temp_tokens.length > 1) {
		for (var i = 0; i < temp_tokens.length - 1; i++) {
			tokens.push(temp_tokens[i]);
			tokens.push(connective);
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