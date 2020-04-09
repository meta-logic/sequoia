// Sequoia Copyright (C) 2020  Zan Naeem
// This program comes with ABSOLUTELY NO WARRANTY; for details see LICENSE.
// This is free software, and you are welcome to redistribute it
// under certain conditions; see LICENSE for details.


function showProof(side, index, on) {
    if (on == "yes") {
        $("#"+side+index).attr("onClick", "showProof('"+side+"',"+index+",'no')")
        $("#"+side+"proof"+index).css("display", "none")
    } else {
        $("#"+side+index).attr("onClick", "showProof('"+side+"',"+index+",'yes')")
        $("#"+side+"proof"+index).css("display", "flex")
    }
}


function setLabel(left_bools, right_bools, index, side) {
    var label_string = ""
    for (var j = 0; j < left_bools.length -1; j++) {
        var space = "\\_"
        if (side == "L" && j == index) {
            space = "\\Gamma"
        } 
        if (j == left_bools.length-2) {
            label_string += space+" \\vdash"
        } else {
            label_string += space+","
        }
    }
    for (var j = 0; j < right_bools.length -1; j++) {
        var space = "\\_"
        if (side == "R" && j == index) {
            space = "\\Gamma"
        } 
        if (j == right_bools.length-2) {
            label_string += " "+space
        } else {
            label_string += space+","
        }
    }
    return "$$"+label_string+"$$"
}


function checkWeak() {
    $("#loading").attr("class", "ui active inverted dimmer")
    $.get("/sequoia/api/rules/"+calc_id, function (rls, status) { 
        var rules = rls.rules
        var rule_list = []
        for (var i = 0; i < rules.length; i++) {
            if (rules[i].type != "Structural") {
                var rule_name = rules[i].rule.replace(/\\/g, "\\\\")
                var rule_side = rules[i].side
                var rule_conc = rules[i].sml_conc.replace(/\\/g, "\\\\")
                var rule_prem = list_to_string(rules[i].sml_prem).replace(/\\/g, "\\\\")
                var rule_sml = "Rule(\""+rule_name+"\","+rule_side+","+rule_conc+","+rule_prem+")"
                rule_list.push(rule_sml)
            }
        }
        var rule_strings = list_to_string(rule_list)
        $.post("/sequoia/weakenSides", { rules: rule_strings }, function(data, status) {
            $("#weak_button").css("display", "none")
            var output = data.output.split("%%%")
            var left_bools = output[0].split("@@@")
            var right_bools = output[1].split("@@@")
            var lt = $("#left_sides")
            for (var i = 0; i < left_bools.length; i++) {
                if (left_bools[i] != "") {
                    var tempL = left_bools[i].split("###")
                    var color = "red"
                    if (tempL[0] == "T") {
                        color = "green"
                    }
                    var newString = setLabel(left_bools, right_bools, i, 'L')
                    lt.append(
                        '<div id="lweak_card'+i+'" class="'+color+' card">'+
                            '<div class="content">'+
                                '<div class="header">'+newString+'</div>'+
                            '</div>'+
                            '<div id="L'+i+'" class="ui bottom attached button" onClick=showProof("L",'+i+',"no")>'+
                                '<i class="question icon"></i>'+
                            '</div>'+
                        '</div>'+
                        '<div class="ui two cards" id="Lproof'+i+'" style="display: none;">'+
                        '</div>'
                    )
                    var proofs_list = tempL[1].split("&&&")
                    var left_proofs = $("#Lproof"+i)
                    for (var j = 0; j < proofs_list.length; j++) {
                        if (proofs_list[j] != "") {
                            left_proofs.append(
                                '<div class="ui card">'+
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
                    var color = "red"
                    if (tempR[0] == "T") {
                        color = "green"
                    }
                    var newString = setLabel(left_bools, right_bools, i, 'R')
                    rt.append( 
                        '<div id="rweak_card'+i+'" class="'+color+' card">'+
                            '<div class="content">'+
                                '<div class="header">'+newString+'</div>'+
                            '</div>'+
                            '<div id="R'+i+'" class="ui bottom attached button" onClick=showProof("R",'+i+',"no")>'+
                                '<i class="question icon"></i>'+
                            '</div>'+
                        '</div>'+
                        '<div class="ui two cards" id="Rproof'+i+'" style="display: none;">'+
                        '</div>'
                    )
                    var proofs_list = tempR[1].split("&&&")
                    var right_proofs = $("#Rproof"+i)
                    for (var j = 0; j < proofs_list.length; j++) {
                        if (proofs_list[j] != "") {
                            right_proofs.append(
                                '<div class="ui card">'+
                                    '<div class="content">'+
                                        '<div class="header">'+proofs_list[j]+'</div>'+
                                    '</div>'+
                                '</div>'
                            )
                        }
                    }
                }
            }
            MathJax.Hub.Queue(["Typeset",MathJax.Hub,lt[0]], function () { 
                MathJax.Hub.Queue(["Typeset",MathJax.Hub,rt[0]], function () {
                    $("#loading").attr("class", "ui inactive inverted dimmer")
                })
            })
        })
    })
}