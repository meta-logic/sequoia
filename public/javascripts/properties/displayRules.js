var r = 0
var weak_l = "[]"
var weak_r = "[]"

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
        initWeak (calc_id)
    })
}

function initWeak (calc_id) {
    document.getElementById("loading").setAttribute("class", "ui active inverted dimmer")
    $.get("/api/rules/"+calc_id, function (rls, status) { 
        var rules = rls.rules
        var rule_list = []
        for (var i = 0; i < rules.length; i++) {
            if (rules[i].side != "Cut") {
                var fin_conc = rules[i].sml_conc
                .replace(/\\/g, "\\\\")
                var fin_prem = ""
                for (var j = 0; j < rules[i].sml_prem.length; j++) {
                    fin_prem += rules[i].sml_prem[j]
                    .replace(/\\/g, "\\\\")+","
                }
                fin_prem = "[" + fin_prem.slice(0,-1) + "]"
                var rule_sml = "Rule(\""+rules[i].rule.replace(/\\/g, "\\\\")+"\","+rules[i].side+","+fin_conc+","+fin_prem+")"
                rule_list.push(rule_sml)
            }
        }
        var rule_strings = ""
        for (var j = 0; j < rule_list.length; j++) {
            rule_strings += rule_list[j] + ","
        }
        rule_strings = "[" + rule_strings.slice(0,-1) + "]"

        $.post("/weakenSides", { rules: rule_strings }, function(data, status) {
            var output = data.output.split("%%%")
            left_bools = output[0].split("@@@")
            right_bools = output[1].split("@@@")
            if (left_bools.length > 1) {
                weak_l = ""
                for (var i = 0; i < left_bools.length; i++) {
                    if (left_bools[i] != "") {
                        bl = left_bools[i].split("###")[0]
                        if (bl == "F"){
                            bl = "false"
                        } else {
                            bl = "true"
                        }
                        weak_l += bl + ","
                    }
                }
                weak_l = "["+weak_l.slice(0,-1)+"]"
            }
            if (right_bools.length > 1) {
                weak_r = ""
                for (var i = 0; i < right_bools.length; i++) {
                    if (right_bools[i] != "") {
                        bl = right_bools[i].split("###")[0]
                        if (bl == "F"){
                            bl = "false"
                        } else {
                            bl = "true"
                        }
                        weak_r += bl + ","
                    }
                }
                weak_r = "["+weak_r.slice(0,-1)+"]"
            }
            console.log("Left: ",weak_l)
            console.log("Right:",weak_r)
            document.getElementById("loading").setAttribute("class", "ui inactive inverted dimmer")
        })
    })
}