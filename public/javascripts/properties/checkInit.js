
function showProof(index, on) {
    if (on == "yes") {
        $("#I"+index).attr("onClick", "showProof("+index+",'no')")
        $("#proof"+index).css("display", "none")
    } else {
        $("#I"+index).attr("onClick", "showProof("+index+",'yes')")
        $("#proof"+index).css("display", "flex")
    }
}


function checkInit() {
    $("#loading").attr("class", "ui active inverted dimmer")
    $.get("/api/rules/"+calc_id, function (rls, status) { 
        var rules = rls.rules
        var intitial_rules = []
        var connective_rules = []
        var connective_dict = {}
        var con_ordered = []
        for (var i = 0; i < rules.length; i++) {
            var rule_name = rules[i].rule.replace(/\\/g, "\\\\")
            var rule_type = rules[i].type
            var rule_side = rules[i].side
            var rule_conc = rules[i].sml_conc.replace(/\\/g, "\\\\")
            var rule_prem = list_to_string(rules[i].sml_prem).replace(/\\/g, "\\\\")
            var rule_conn = rules[i].connective.replace(/\\/g, "\\\\")
            var rule_sml = "Rule(\""+rule_name+"\","+rule_side+","+rule_conc+","+rule_prem+")"
            if (rule_type == "Logical" && rule_side == "Left") {
                if (rule_conn in connective_dict) {
                    connective_dict[rule_conn][0].push(rule_sml)
                } else {
                    connective_dict[rule_conn] = [[rule_sml], []]
                }
            } else if (rule_type == "Logical" && rule_side == "Right") {
                if (rule_conn in connective_dict) {
                    connective_dict[rule_conn][1].push(rule_sml)
                } else {
                    connective_dict[rule_conn] =[[], [rule_sml]]
                }
            } else if (rule_type == "Axiom") {
                intitial_rules.push(rule_sml)
            }
        }
        var init_strings = list_to_string(intitial_rules)
        for (var key in connective_dict) {
            con_ordered.push("\\"+key)
            var temp = "(Con(\""+key+"\"),"+list_to_string(connective_dict[key][0])+","+list_to_string(connective_dict[key][1])+")"
            connective_rules.push(temp)
        }
        var connective_strings = list_to_string(connective_rules)
        $.post("/initRules", { first: connective_strings, second: init_strings, third: "[]"}, function(data, status) {
            $("#init_button").css("display", "none")
            var output = data.output.split("%%%")
            var result = output[0]
            if (result == "Arity Problem") {
                $("#loading").attr("class", "ui inactive inverted dimmer")
                $("#info_header").html("Arity Problem")
                $("#info_text").html("One or more connectives in this calculus system has inconsistent arities. Please make sure that each rule with the same connectives has the same arities.")
                $("#info_answer").attr("class", "ui negative message")
                $("#info_answer").css("display", "block")
                return
            } else {
                var answer = result.split("###")
                $("#info_header").html(answer[0])
                $("#info_text").html(answer[1])
                $("#info_answer").attr("class", "ui info message")
                $("#info_answer").css("display", "block")
            }
            var connective_out = output[1].split("@@@")
            var cp = $("#proofs_connectives")
            for (var i = 0; i < connective_out.length; i++) {
                if (connective_out[i] != "") {
                    var temp = connective_out[i].split("###")
                    var color = "red"
                    if (temp[0] == "T") {
                        color = "green"
                    }
                    cp.append( 
                        '<div id="init_card'+i+'" class="'+color+' card">'+
                            '<div class="content">'+
                                '<div class="header">$$'+con_ordered[i]+'$$</div>'+
                            '</div>'+
                            '<div id="I'+i+'" class="ui bottom attached button" onClick=showProof('+i+',"no")>'+
                                '<i class="question icon"></i>'+
                            '</div>'+
                        '</div>'+
                        '<div class="ui one cards" id="proof'+i+'" style="display: none;">'+
                            '<div class="ui card">'+
                                '<div class="content">'+
                                    '<div class="header">'+temp[1]+'</div>'+
                                '</div>'+
                            '</div>'+
                        '</div>'
                    )
                }
            }
            MathJax.Hub.Queue(["Typeset",MathJax.Hub,cp[0]], function () {
                $("#loading").attr("class", "ui inactive inverted dimmer")
            })
        })
    })
}