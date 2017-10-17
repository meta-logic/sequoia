var stack = [];

//check what rules we can apply on the premise
function apply (premise, rule, types) {
	//getting needed information
	var premises = rule.premises;
	var conclusion = rule.conclusion;

	//formatting the input
	premises = premises.map( x => inputParser(x));
	conclusion = inputParser(conclusion);

	//adding Types
	var conclusion_types = addTypes(flatten(conclusion), types)

	//tagging
	var tagged_premises = tagging(premises, conclusion);

	//checking types
	var check = checkTypes(premise, conclusion_types);

	//build up
	var result = match_tags(premise, tagged_premises);

	//pushing the result to the stack
	stack.push(result);

	return result;
}
