function flatten(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}

//remove the pranthesis eg. (A ^ (A v B)) => A, ^, (A v B)
function remove(input) {
	for (var i = 0 ; i < input.length; i++) {
		if (input[i][0] == "(") {
			input[i] = remove(inputParser(input[i].substr(1,input[i].length - 2)));
		} 
	}
	
	return input; 
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

	//make copy of tokens
	tokens_copy = tokens.splice();
	tokens = tokens.map(remove);

	return tokens;
}