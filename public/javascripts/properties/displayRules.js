var r = 0

function get_rules_toPage() {
    var rules_container = document.getElementById("rules")
    if (rules_container == null) { return }
    for (i = 0; i < r; i++) {
        entry = document.getElementById("rule_card"+i)
        if (entry != null) {
            entry.remove()
        }
    }
    var calc_id = document.getElementById("calc_id").innerHTML
    $.get("/api/rules/"+calc_id, function (rls, status) {
        var rules = rls.rules
        for (var i = 0; i < rules.length; i++) {
            var fin_conc = rules[i].sml_conc.replace(/\\/g, "\\\\").replace(/'/g, "&apos;").replace(/"/g, "&quot;")
            var fin_prem = "["
            for (var j = 0; j < rules[i].sml_prem.length; j++) {
                fin_prem += rules[i].sml_prem[j].replace(/\\/g, "\\\\").replace(/'/g, "&apos;").replace(/"/g, "&quot;") + ", "
            }
            fin_prem = fin_prem.slice(0,-2) + "]"
            rules_container.innerHTML += 
            '<div id="rule_card'+i+'" class="ui card">'
                +'<div class="content" id="r'+i+'"'
                +'rule_name="'+rules[i].rule+'" conclusion="'+fin_conc+'" premises="'+fin_prem+'" ' 
                +'conn="'+rules[i].connective+'" side="'+rules[i].side+'">'
                    +'\\[\\frac{'+rules[i].premises.join(" \\quad \\quad ")+'}{'+rules[i].conclusion+'}'+rules[i].rule+'\\]' 
                +'</div>'
                +'<div class="ui bottom attached button" id="b'+i+'" onClick=selectRule("true","'+i+'")>'
                    +'<i id="i'+i+'" class="add icon"></i>'
                +'</div>'
            +'</div>'
        }
        MathJax.Hub.Queue(["Typeset",MathJax.Hub,rules_container])
        r = rules.length
    })
}

