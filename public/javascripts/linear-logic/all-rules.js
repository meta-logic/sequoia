$.get("/api/get-rules", function (rules) {
    $.get("/api/symbols", function(types) {
        var rules_sequents = []
        var rules_types = []
        var assigned_rules = []
        var temp = []

        for (var i = 0; i < rules.length; i++) {
            temp = getSymbolTypes(rules[i], types.symbols.symbols)
            rules_sequents.push(temp[0])
            rules_types.push(temp[1])
        }

        console.log(rules_types)
        var formula, assign, max_subs, empty_subs
        for (var i = 0; i < rules_sequents.length; i++) {
            formula = formulas(rules_sequents[i], rules_types[i])
            // console.log(formula);
            assign = assign_sides(formula, rules_types[i])
            console.log(assign)
            assigned_rules.push(assign)
        }
        max_subs = get_max_subs(assigned_rules)
        console.log(max_subs)
		
        console.log("good so far")
        for (var i = 0; i < assigned_rules.length; i++) {
            empty_subs = assign_empty_subs(assigned_rules[i], max_subs)
            assigned_rules[i] = empty_subs
            assigned_rules[i] = assign_subs(assigned_rules[i], rules_types[i])
            console.log(cleanup(assigned_rules[i], rules_types[i]))
        }

    })
})
