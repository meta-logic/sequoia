function inputParser(input) {
	var token = '';
	var tokens_list = [];
	var between_parentheses_check = false;
	var parentheses_count = 0;
	input += ' ';

	for (var i = 0; i < input.length; i++) {

		//==== perantheses ====
		if (input[i] == "(") {
			between_parentheses_check = true;
			parentheses_count ++;
		}

		if (input[i] == ")") {
			parentheses_count --;

			//check if the token is closed with perantheses
			if (parentheses_count == 0) {
				between_parentheses_check = false;
				token += input[i];
				tokens_list.push(token);
				token = '';
				i++;
			}
		}


		//==== rest of input ====

		if ((input[i] == ' ' || input[i] == ',') && !between_parentheses_check) {

			if (i != 0 && input[i-1] != ")" && token != "" && token != " ") {
				tokens_list.push(token);
				token = '';
			}
		} else {
			token += input[i];
		}

	}

	//check if the input was only one word
	if (tokens_list.length == 0) {
		tokens_list.push(token);
	}
	return tokens_list;
}