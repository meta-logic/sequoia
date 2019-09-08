var r = 0

function get_rules_toPage() {
    var rules_container = document.getElementById("rules")
    var rule_container = ""
    $.get("/api/get-rules", function (rls, status) {
        r = 0
        rules = rls
        for (var i = 0; i < rules.length; i++) {

            var fin_conc = rules[i].sml_conc.replace(/\\/g, "\\\\").replace(/'/g, "&apos;").replace(/"/g, "&quot;")
            var fin_prem = "["
            for (var j = 0; j < rules[i].sml_prem.length; j++) {
                fin_prem += rules[i].sml_prem[j].replace(/\\/g, "\\\\").replace(/'/g, "&apos;").replace(/"/g, "&quot;") + ", "
            }
            fin_prem = fin_prem.slice(0,-2) + "]"
            rules_container.innerHTML += "<div id=\"rule_card"+ i.toString()+"\"><button class=\"ui button basic black\" id=\"r"+ i.toString()+"\" onClick=\"applyRule("+i+")\""
            +"rule_name=\""+rules[i].rule+"\" conclusion=\""+fin_conc+"\" premises=\""+fin_prem+"\"></button><br><br></div>"
            rule_container = document.getElementById(("r" + i.toString()))
            rule_container.innerHTML = "\\[\\frac{"+ rules[i].premises.join(" \\quad \\quad ")+"}{"+ rules[i].conclusion +"}"+rules[i].rule+"\\]"
            MathJax.Hub.Queue(["Typeset",MathJax.Hub,rule_container])
            r++
        }
    })
}

function deleteRule (id) {
    $.ajax({
        url: "/api/rule",
        type: "DELETE",
        data : { "id" : id },
        success: function(result) {
            $.get("/api/get-rules", function (rls, status) {
                rules = rls
                for (i = 0; i < r; i++) {
                    document.getElementById("rule_card"+i).remove()
                }
                get_rules_toPage()
                console.log("Rule sucessfully deleted.")
            })
        },
        error: function(result) {
            console.log("ERROR: rule could not be deleted.")
        }
    })
}