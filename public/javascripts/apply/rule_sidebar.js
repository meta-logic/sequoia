// Sequoia Copyright (C) 2020  Zan Naeem, Abdulrahman Alfayad
// This program comes with ABSOLUTELY NO WARRANTY; for details see LICENSE.
// This is free software, and you are welcome to redistribute it
// under certain conditions; see LICENSE for details.


var r = 0

function get_rules_toPage() {
    var rules_container = $("#rules")
    for (i = 0; i < r; i++) {
        entry = $("#rule_card"+i)
        if (entry != null) {
            entry.remove()
        }
    }
    $.get("/sequoia/api/rules/"+calc_id, function(rls, status) {
        var rules = rls.rules
        for (var i = 0; i < rules.length; i++) {
            var rule_cutvar = rules[i].cutvar.replace(/\\/g, "\\\\").replace(/'/g, "&apos;").replace(/"/g, "&quot;")
            var rule_conc = rules[i].sml_conc.replace(/\\/g, "\\\\").replace(/'/g, "&apos;").replace(/"/g, "&quot;")
            var rule_prem = list_to_string(rules[i].sml_prem).replace(/\\/g, "\\\\").replace(/'/g, "&apos;").replace(/"/g, "&quot;")
            rules_container.append(
                '<div id="rule_card"'+i+'" class="card">'+
                    '<button class="ui button basic black" id="r'+i+'" onClick=applyRule("'+i+'") type="'+rules[i].type+'"'+
                    ' rule_name="'+rules[i].rule+'" side="'+rules[i].side+'" conclusion="'+rule_conc+'" premises="'+rule_prem+'" cutvar="'+rule_cutvar+'">'+
                        '$$\\frac{'+rules[i].premises.join(" \\quad \\quad ")+'}{'+rules[i].conclusion+'}'+rules[i].rule+'$$'+
                    '</button>'+
                '</div>'
            )
        }
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, rules_container[0]])
        r = rules.length
    })
}