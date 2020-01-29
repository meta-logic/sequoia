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
            var fin_conc = rules[i].sml_conc.replace(/\\/g, "\\\\")
            .replace(/'/g, "&apos;").replace(/"/g, "&quot;")
            var fin_prem = ""
            for (var j = 0; j < rules[i].sml_prem.length; j++) {
                fin_prem += rules[i].sml_prem[j].replace(/\\/g, "\\\\")
                .replace(/'/g, "&apos;").replace(/"/g, "&quot;") + ", "
            }
            fin_prem = "[" + fin_prem.slice(0,-2) + "]"
            rules_container.innerHTML += 
            '<div id="rule_card"'+i+'" class="card">'
                +'<button class="ui button basic black" id="r'+i+'" onClick=applyRule("'+i+'") '
                +'rule_name="'+rules[i].rule+'" side="'+rules[i].side+'" conclusion="'+fin_conc+'" premises="'+fin_prem+'">'
                    +'\\[\\frac{'+rules[i].premises.join(" \\quad \\quad ")+'}{'+rules[i].conclusion+'}'+rules[i].rule+'\\]'
                +'</button>'
            +'</div>'
        }
        MathJax.Hub.Queue(["Typeset",MathJax.Hub,rules_container])
        r = rules.length
    })
}

function deleteRule (id) {
    $.ajax({
        url: "/api/rule",
        type: "DELETE",
        data : { "id" : id },
        success: function(result) {
            get_rules_toPage()
            console.log("Rule sucessfully deleted.")
        },
        error: function(result) {
            console.log("ERROR: rule could not be deleted.")
        }
    })
}