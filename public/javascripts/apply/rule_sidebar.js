var r = 0

function get_rules_toPage() {
    var rules_container = $("#rules")
    for (i = 0; i < r; i++) {
        entry = $("#rule_card"+i)
        if (entry != null) {
            entry.remove()
        }
    }
    var calc_id = $("#calc_id").text()
    $.get("/api/rules/"+calc_id, function (rls, status) {
        var rules = rls.rules
        for (var i = 0; i < rules.length; i++) {
            var rule_conc = rules[i].sml_conc.replace(/\\/g, "\\\\").replace(/'/g, "&apos;").replace(/"/g, "&quot;")
            var rule_prem = list_to_string(rules[i].sml_prem).replace(/\\/g, "\\\\").replace(/'/g, "&apos;").replace(/"/g, "&quot;")
            rules_container.append( 
                '<div id="rule_card"'+i+'" class="card">'+
                    '<button class="ui button basic black" id="r'+i+'" onClick=applyRule("'+i+'") '+
                    'rule_name="'+rules[i].rule+'" side="'+rules[i].side+'" conclusion="'+rule_conc+'" premises="'+rule_prem+'">'+
                        '$$\\frac{'+rules[i].premises.join(" \\quad \\quad ")+'}{'+rules[i].conclusion+'}'+rules[i].rule+'$$'+
                    '</button>'+
                '</div>'
            )
        }
        MathJax.Hub.Queue(["Typeset",MathJax.Hub,rules_container[0]])
        r = rules.length
    })
}