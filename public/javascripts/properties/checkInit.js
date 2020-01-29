temp_proofs = []

function showProof(index, on) {
    pfid = "proof"+index
    if (on == "yes") {
        pfid = "proof"+index
        document.getElementById("I"+index).setAttribute("onClick", "showProof("+index+",\"no\")")
        document.getElementById(pfid).innerHTML = ""
        return 
    }
    var t = document.getElementById(pfid)
    t.innerHTML += 
        '<div class="ui card">'
            +'<div class="content">'
                +'<div class="header">'+temp_proofs[index]+'</div>'
            +'</div>'
        +'</div>'
    MathJax.Hub.Queue(["Typeset",MathJax.Hub,t])
    document.getElementById("I"+index).setAttribute("onClick", "showProof("+index+",\"yes\")")
}

function list_to_string(rule_list) {
    var rule_strings = ""
    for (var j = 0; j < rule_list.length; j++) {
        rule_strings += rule_list[j] + ","
    }
    return rule_strings = "[" + rule_strings.slice(0,-1) + "]"
}

function checkInit() {
    document.getElementById("loading").setAttribute("class", "ui active inverted dimmer")
    $.get("/api/rules/"+calc_id, function (rls, status) { 
        var rules = rls.rules
        var other_rules = []
        var connective_dict = {}
        var con_ordered = []
        for (var i = 0; i < rules.length; i++) {
            var fin_conc = rules[i].sml_conc
            .replace(/\\/g, "\\\\")
            var fin_prem = ""
            for (var j = 0; j < rules[i].sml_prem.length; j++) {
                fin_prem += rules[i].sml_prem[j]
                .replace(/\\/g, "\\\\")+","
            }
            fin_prem = "[" + fin_prem.slice(0,-1) + "]"
            var rule_sml = "Rule(\""+rules[i].rule.replace(/\\/g, "\\\\")+"\","+rules[i].side+","+fin_conc+","+fin_prem+")"
            if (rules[i].side == "Left") {
                if (rules[i].connective in connective_dict) {
                    connective_dict[rules[i].connective][0].push(rule_sml)
                } else {
                    connective_dict[rules[i].connective] = [[rule_sml], []]
                }
            } else if (rules[i].side == "Right") {
                if (rules[i].connective in connective_dict) {
                    connective_dict[rules[i].connective][1].push(rule_sml)
                } else {
                    connective_dict[rules[i].connective] =[[], [rule_sml]]
                }
            } else if (rules[i].side == "None") {
                other_rules.push(rule_sml)
            }
        }
        var other_strings = list_to_string(other_rules)
        var temp_tuples = []
        for (var key in connective_dict) {
            con_ordered.push("\\\\"+key)
            temp = "(Con(\"\\"+key+"\")," + list_to_string(connective_dict[key][0]) + "," + list_to_string(connective_dict[key][1]) + ")"
            temp_tuples.push(temp)
        }
        var connective_strings = list_to_string(temp_tuples)

        $.post("/initRules", { first: connective_strings, second: other_strings, third: "[]"}, function(data, status) {
            document.getElementById("init_button").remove()
            var output = data.output.split("%%%")
            connective_out = output[1].split("@@@")
            bool = output[0]
            var message = document.getElementById('info_answer')
            var type = ""
            if (bool == "F") {
                type = "negative"
                answer = "Identity expansion test fails for this calculus system"
            } else {
                type = "info"
                answer = "Identity expansion test succeeds for this calculus system"
            }
            message.innerHTML = '<div id="answer" class="ui '+type+' message">'
                +'<div class="header">'+answer+'</div>'
                +'</div>'
            if (connective_out.length > 1) {
                var cp = document.getElementById("proofs_connectives")
                for (var i = 0; i < connective_out.length; i++) {
                    if (connective_out[i] != "") {
                        var temp = connective_out[i].split("###")
                        var color = "red"
                        if (temp[0] == "T") {
                            color = "green"
                        }
                        temp_proofs.push(temp[1])
                        newString = con_ordered[i]
                        cp.innerHTML += 
                            '<div id="init_card'+i+'" class="'+color+' card">'
                                +'<div class="content">'
                                    +'<div class="header">$$'+newString+'$$</div>'
                                +'</div>'
                                +'<div id="I'+i+'" class="ui bottom attached button" onClick=showProof('+i+',"no")>'
                                    +'<i class="question icon"></i>'
                                +'</div>'
                            +'</div>'
                            +'<div class="ui one cards" id="proof'+i+'">'
                            +'</div>'
                    }
                }
            }
            MathJax.Hub.Queue(["Typeset",MathJax.Hub,cp], function () {
                document.getElementById("loading").setAttribute("class", "ui inactive inverted dimmer")
            })
        })
    })
}