// Sequoia Copyright (C) 2020  Zan Naeem
// This program comes with ABSOLUTELY NO WARRANTY; for details see LICENSE.
// This is free software, and you are welcome to redistribute it
// under certain conditions; see LICENSE for details.


var proof_content = {}

function showProofWeak(side, index, on, num) {
    if (on == "yes") {
        $("#"+side+index).attr("onClick", "showProofWeak('"+side+"',"+index+",'no',"+num+")")
        $("#Arrow"+side+index).attr("class", "caret down icon")
        for (var i = 0; i < num; i++) {
            $("#"+side+"proof"+index+""+i).css("display", "none")
        }
    } else {
        $("#"+side+index).attr("onClick", "showProofWeak('"+side+"',"+index+",'yes',"+num+")")
        $("#Arrow"+side+index).attr("class", "caret up icon")
        for (var i = 0; i < num; i++) {
            $("#"+side+"proof"+index+""+i).css("display", "flex")
        }
    }
}


function setLabel(left_bools, right_bools, index, side, sequent_sign, context_sep) {
    var label_left = ""
    for (var j = 0; j < left_bools.length -1; j++) {
        var space = "\\Gamma_"+(j+1)
        if (side == "L" && j == index) {
            space += ", W^*"
        } 
        if (j == left_bools.length-2) {
            label_left += space+" "
        } else {
            label_left += space+context_sep
        }
    }
    var label_right = ""
    for (var j = 0; j < right_bools.length -1; j++) {
        var space = "\\Delta_"+(j+1)
        if (side == "R" && j == index) {
            space += ", W^*"
        } 
        if (j == right_bools.length-2) {
            label_right += " "+space
        } else {
            label_right += space+context_sep
        }
    }
    return "$$"+label_left+sequent_sign+label_right+"$$"
}


function checkWeak() {
    $("#loading").attr("class", "ui active inverted dimmer")
    $.get("/sequoia/api/rules/"+calc_id, function(rls, status) { 
        var rules = rls.rules
        var init_list = []
        var logical_list = []
        for (var i = 0; i < rules.length; i++) {
            var rule_name = rules[i].rule.replace(/\\/g, "\\\\")
            var rule_type = rules[i].type
            var rule_side = rules[i].side
            var rule_conc = rules[i].sml_conc.replace(/\\/g, "\\\\")
            var rule_prem = list_to_string(rules[i].sml_prem).replace(/\\/g, "\\\\")
            var rule_sml = "Rule(\""+rule_name+"\","+rule_side+","+rule_conc+","+rule_prem+")"
            if (rule_type == "Logical") {
                logical_list.push(rule_sml)
            } else if (rule_type == "Axiom") {
                init_list.push(rule_sml)
            }
        }
        var rule_strings = list_to_string(init_list.concat(logical_list))
        $.post("/sequoia/weakenSides", { rules: rule_strings }, function(data, status) {
            var output = data.output.split("%%%")
            var result = output[0]
            var answer = ["",""]
            if (result == "T") {
                answer[0] = "Weakening admissiblity proof succeeds for all contexts"
            } else if (result == "F") {
                answer[0] = "Weakening admissiblity proof fails for some contexts"
            }
            answer[1] = "Each card below contains the cases for the proof of weakening admissibility on the explicit &nbsp;&#x1D6AA;.&nbsp; When a case succeeds, the proof tree transformation is shown. This check is sound but not complete."
            $("#info_header").html(answer[0])
            $("#info_text").html(answer[1])
            $("#info_answer").attr("class", "ui info message")
            $("#info_answer").css("display", "block")
            var left_bools = output[1].split("@@@")
            var right_bools = output[2].split("@@@")
            $.get("/sequoia/api/cert_symbols/"+calc_id, function(sb, status) {
                var syms = sb.symbols
                var sequent_sign = ""
                var context_sep = ""
                for (var i = 0; i < syms.length; i++) {
                    if (syms[i].type == "sequent sign") {
                        sequent_sign = syms[i].symbol
                    } else if (syms[i].type == "context separator") {
                        context_sep = syms[i].symbol
                    }
                }
                var lt = $("#left_sides")
                for (var i = 0; i < left_bools.length; i++) {
                    if (left_bools[i] != "") {
                        var tempL = left_bools[i].split("###")
                        var color = "green"
                        if (tempL[0] == "F") {
                            color = "red"
                            left_result = false
                        }
                        var proofs_list = tempL[1].split("&&&")
                        var newString = setLabel(left_bools, right_bools, i, 'L', sequent_sign, context_sep)
                        lt.append(
                            '<div class="'+color+' card">'+
                                '<div class="content">'+
                                    '<div class="header">'+newString+'</div>'+
                                '</div>'+
                                '<div id="L'+i+'" class="ui bottom attached button" onClick=showProofWeak("L",'+i+',"no",'+proofs_list.length+')>'+
                                    '<i id="ArrowL'+i+'" class="caret down icon"></i>'+
                                '</div>'+
                            '</div>'
                        )
                        for (var j = 0; j < proofs_list.length; j++) {
                            if (proofs_list[j] != "") {
                                lt.append(
                                    '<div class="ui card" id="Lproof'+i+""+j+'" style="display: none;>'+
                                        '<div class="content">'+
                                            '<div class="header">'+proofs_list[j]+'</div>'+
                                        '</div>'+
                                    '</div>'
                                )
                            }
                        }
                    }
                }
                var rt = $("#right_sides")
                for (var i = 0; i < right_bools.length; i++) {
                    if (right_bools[i] != "") {
                        var tempR = right_bools[i].split("###")
                        var color = "green"
                        if (tempR[0] == "F") {
                            color = "red"
                            right_result = false
                        }
                        var proofs_list = tempR[1].split("&&&")
                        var newString = setLabel(left_bools, right_bools, i, 'R', sequent_sign, context_sep)
                        rt.append( 
                            '<div class="'+color+' card">'+
                                '<div class="content">'+
                                    '<div class="header">'+newString+'</div>'+
                                '</div>'+
                                '<div id="R'+i+'" class="ui bottom attached button" onClick=showProofWeak("R",'+i+',"no",'+proofs_list.length+')>'+
                                    '<i id="ArrowR'+i+'" class="caret down icon"></i>'+
                                '</div>'+
                            '</div>'
                        )
                        for (var j = 0; j < proofs_list.length; j++) {
                            if (proofs_list[j] != "") {
                                rt.append(
                                    '<div class="ui card" id="Rproof'+i+""+j+'" style="display: none;>'+
                                        '<div class="content">'+
                                            '<div class="header">'+proofs_list[j]+'</div>'+
                                        '</div>'+
                                    '</div>'
                                )
                            }
                        }
                    }
                }
                $("#download").css("display", "block")
                $("#download").attr("onclick", "download(\"Weakening_Admissibility\")")
                MathJax.Hub.Queue(["Typeset", MathJax.Hub, lt[0]], function() { 
                    MathJax.Hub.Queue(["Typeset", MathJax.Hub, rt[0]], function() {
                        $("#loading").attr("class", "ui inactive inverted dimmer")
                    })
                })
            })
        })
    })
}
