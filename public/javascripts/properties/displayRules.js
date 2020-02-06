var r = 0
var weak_l = "[]"
var weak_r = "[]"
var init_strings = "[]"

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
        var init_list = []
        for (var i = 0; i < rules.length; i++) {
            if (rules[i].side == "Left" || rules[i].side == "Right") {
                var rule_name = rules[i].rule.replace(/\\/g, "\\\\")
                var rule_conc = rules[i].sml_conc.replace(/\\/g, "\\\\").replace(/'/g, "&apos;").replace(/"/g, "&quot;")
                var rule_prem = list_to_string(rules[i].sml_prem).replace(/\\/g, "\\\\").replace(/'/g, "&apos;").replace(/"/g, "&quot;")
                rules_container.append( 
                    '<div id="rule_card'+i+'" class="ui card">'+
                        '<div class="content" id="r'+i+'" '+
                            'rule_name="'+rule_name+'" conclusion="'+rule_conc+'" premises="'+rule_prem+'" '+ 
                            'conn="'+rules[i].connective+'" side="'+rules[i].side+'">'+
                                '$$\\frac{'+rules[i].premises.join(" \\quad \\quad ")+'}{'+rules[i].conclusion+'}'+rules[i].rule+'$$'+
                        '</div>'+
                        '<div class="ui bottom attached button" id="b'+i+'" onClick=selectRule(true,'+i+')>'+
                            '<i id="i'+i+'" class="add icon"></i>'+
                        '</div>'+
                    '</div>'
                )
            } else if (rules[i].side == "None") {
                var rule_name = rules[i].rule.replace(/\\/g, "\\\\")
                var rule_conc = rules[i].sml_conc.replace(/\\/g, "\\\\")
                var rule_sml = "Rule(\""+rule_name+"\",None,"+rule_conc+",\[\])"
                init_list.push(rule_sml) 
            }
        }
        init_strings = list_to_string(init_list)
        MathJax.Hub.Queue(["Typeset",MathJax.Hub,rules_container[0]])
        r = rules.length
        initWeak(calc_id)
    })
}

function initWeak(calc_id) {
    $("#loading").attr("class", "ui active inverted dimmer")
    $.get("/api/rules/"+calc_id, function (rls, status) { 
        var rules = rls.rules
        var rule_list = []
        for (var i = 0; i < rules.length; i++) {
            if (rules[i].side == "Left" || rules[i].side == "Right" || rules[i].side == "None") {
                var rule_name = rules[i].rule.replace(/\\/g, "\\\\")
                var rule_side = rules[i].side
                var rule_conc = rules[i].sml_conc.replace(/\\/g, "\\\\")
                var rule_prem = list_to_string(rules[i].sml_prem).replace(/\\/g, "\\\\")
                var rule_sml = "Rule(\""+rule_name+"\","+rule_side+","+rule_conc+","+rule_prem+")"
                rule_list.push(rule_sml)
            }
        }
        var rule_strings = list_to_string(rule_list)
        $.post("/weakenSides", { rules: rule_strings }, function(data, status) {
            var output = data.output.split("%%%")
            var left_bools = output[0].split("@@@")
            var right_bools = output[1].split("@@@")
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
            $("#loading").attr("class", "ui inactive inverted dimmer")
        })
    })
}