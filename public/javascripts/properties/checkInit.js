// Sequoia Copyright (C) 2020  Zan Naeem
// This program comes with ABSOLUTELY NO WARRANTY; for details see LICENSE.
// This is free software, and you are welcome to redistribute it
// under certain conditions; see LICENSE for details.


var proof_content = {"base":[],"induct":[]}

function showProofInit(type, index, on, num) {
    if (on == "yes") {
        $("#"+type+index).attr("onClick", "showProofInit('"+type+"',"+index+",'no',"+num+")")
        $("#Arrow"+type+index).attr("class", "caret down icon")
        for (var i = 0; i < num; i++) {
            $("#"+type+"proof"+index+""+i).css("display", "none")
        }
    } else {
        $("#"+type+index).attr("onClick", "showProofInit('"+type+"',"+index+",'yes',"+num+")")
        $("#Arrow"+type+index).attr("class", "caret up icon")
        for (var i = 0; i < num; i++) {
            $("#"+type+"proof"+index+""+i).css("display", "flex")
        }
    }
}


function checkInit() {
    $("#loading").attr("class", "ui active inverted dimmer")
    $.get("/sequoia/api/rules/"+calc_id, function(rls, status) { 
        var rules = rls.rules
        var init_list = []
        var logical_list = []
        var connective_dict = {}
        var init_ordered = []
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
                    connective_dict[rule_conn] = [[], [rule_sml]]
                }
            } else if (rule_type == "Axiom") {
                init_list.push(rule_sml)
                init_ordered.push(rule_name)
            }
        }
        for (var key in connective_dict) {
            con_ordered.push("\\"+key)
            var temp = "(Con(\""+key+"\"),"+list_to_string(connective_dict[key][0])+","+list_to_string(connective_dict[key][1])+")"
            logical_list.push(temp)
        }
        var init_strings = list_to_string(init_list)
        var logical_strings = list_to_string(logical_list)
        if (init_list.length == 0) {
            $("#info_header").html("Rules Missing")
            $("#info_text").html("No initial or axiom rules are defined for this calculus system. Therefore, identity expansion cannot be checked.")
            $("#loading").attr("class", "ui inactive inverted dimmer")
            $("#info_answer").attr("class", "ui negative message")
            $("#info_answer").css("display", "block")
            return
        }
        $.post("/sequoia/initRules", {first : logical_strings, second : init_strings, third : "[]"}, function(data, status) {
            $("#results").css("visibility", "visible")
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
                var answer = ["",""]
                if (result == "T") {
                    answer[0] = "Identity expansion proof succeeds"
                    answer[1] = "Identity expansion is a property of this calculus system. The proof proceeds by structural induction on <b><i>P</i></b>, and for each connective the proof tree transformation is shown below."
                } else if (result == "F") {
                    answer[0] = "Identity expansion proof fails"
                    answer[1] = "Identity expansion may not be a property of this calculus system. The proof proceeds by structural induction on <b><i>P</i></b>, and for certain connectives the proof tree transformation could not be found."
                }
                $("#info_header").html(answer[0])
                $("#info_text").html(answer[1])
                $("#info_answer").attr("class", "ui info message")
                $("#info_answer").css("display", "block")
            }
            var axioms = output[1].split("@@@")
            var logicals = output[2].split("@@@")
            var ax = $("#axiom")
            for (var i = 0; i < axioms.length; i++) {
                if (axioms[i] != "") {
                    var temp = axioms[i].split("###")
                    var color = "red"
                    if (temp[0] == "T") {
                        color = "green"
                    }
                    var proofs_list = temp[1].split("&&&")
                    ax.append(
                        '<div class="'+color+' card">'+
                            '<div class="content">'+
                                '<div class="header">$$'+init_ordered[i]+'$$</div>'+
                            '</div>'+
                            '<div id="AX'+i+'" class="ui bottom attached button" onClick=showProofInit("AX",'+i+',"no",'+proofs_list.length+')>'+
                                '<i id="ArrowAX'+i+'" class="caret down icon"></i>'+
                            '</div>'+
                        '</div>'
                    )
                    for (var j = 0; j < proofs_list.length; j++) {
                        if (proofs_list[j] != "") {
                            var display_proofs = proofs_list[j].split("~~~")
                            proof_content["base"].push(display_proofs[1])
                            ax.append(
                                '<div class="ui card" id="AXproof'+i+""+j+'" style="display: none;>'+
                                    '<div class="content">'+
                                        '<div class="header">'+display_proofs[0]+'</div>'+
                                    '</div>'+
                                '</div>'
                            )
                        }
                    }
                }
            }
            var lg = $("#logical")
            for (var i = 0; i < logicals.length; i++) {
                if (logicals[i] != "") {
                    var temp = logicals[i].split("###")
                    var color = "red"
                    if (temp[0] == "T") {
                        color = "green"
                    }
                    var proofs_list = temp[1].split("&&&")
                    lg.append(
                        '<div class="'+color+' card">'+
                            '<div class="content">'+
                                '<div class="header">$$'+con_ordered[i]+'$$</div>'+
                            '</div>'+
                            '<div id="LG'+i+'" class="ui bottom attached button" onClick=showProofInit("LG",'+i+',"no",'+proofs_list.length+')>'+
                                '<i id="ArrowLG'+i+'" class="caret down icon"></i>'+
                            '</div>'+
                        '</div>'
                    )
                    for (var j = 0; j < proofs_list.length; j++) {
                        if (proofs_list[j] != "") {
                            var display_proofs = proofs_list[j].split("~~~")
                            proof_content["induct"].push(display_proofs[1])
                            lg.append(
                                '<div class="ui card" id="LGproof'+i+""+j+'" style="display: none;>'+
                                    '<div class="content">'+
                                        '<div class="header">'+display_proofs[0]+'</div>'+
                                    '</div>'+
                                '</div>'
                            )
                        }
                    }
                }
            }
            $("#download").css("display", "block")
            $("#download").attr("onclick", "download(\"Identity_Expansion\")")
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, ax[0]], function() { 
                MathJax.Hub.Queue(["Typeset", MathJax.Hub, lg[0]], function() {
                    $("#loading").attr("class", "ui inactive inverted dimmer")
                })
            })
        })
    })
}