var left_proofs = []
var right_proofs = []

function showProof(side, index, on) {
    if (on == "yes") {
        if (side == "L") {
            pfid = "lproof"+index
        } else {
            pfid = "rproof"+index
        }
        document.getElementById(side+index).setAttribute("onClick", "showProof(\""+side+"\","+index+",\"no\")")
        document.getElementById(pfid).innerHTML = ""
        return 
    }
    var proofs = ""
    var pfid = ""
    if (side == "L") {
        proofs = left_proofs[index]
        pfid = "lproof"+index
    } else {
        proofs = right_proofs[index]
        pfid = "rproof"+index
    }
    current_side = side
    current_index = index
    var proofs_list = proofs.split("&&&")
    var t = document.getElementById(pfid)
    for (var i = 0; i < proofs_list.length; i++) {
        if (proofs_list[i] != "") {
            t.innerHTML += 
                '<div class="ui card">'
                    +'<div class="content">'
                        +'<div class="header">'+proofs_list[i]+'</div>'
                    +'</div>'
                +'</div>'
        }
    }
    MathJax.Hub.Queue(["Typeset",MathJax.Hub,t])
    document.getElementById(side+index).setAttribute("onClick", "showProof(\""+side+"\","+index+",\"yes\")")
}

function setLabel(left_bools, right_bools, index, side) {
    var label_string = ""
    for (var j = 0; j < left_bools.length -1; j++) {
        space = "\\_"
        if (side == "L") {
            space = "\\Gamma"
        } 
        if (j == left_bools.length-2) {
            label_string += space+" \\vdash"
        } else {
            label_string += space+","
        }
    }
    for (var j = 0; j < right_bools.length -1; j++) {
        space = "\\_"
        if (side == "R") {
            space = "\\Gamma"
        } 
        if (j == right_bools.length-2) {
            label_string += " "+space
        } else {
            label_string += space+","
        }
    }
    return "$$" + label_string + "$$"
}

function checkWeak() {
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
            document.getElementById("weak_button").remove()
            var output = data.output.split("%%%")
            left_bools = output[0].split("@@@")
            right_bools = output[1].split("@@@")
            if (left_bools.length > 1) {
                var lt = document.getElementById("left_sides")
                for (var i = 0; i < left_bools.length; i++) {
                    if (left_bools[i] != "") {
                        var tempL = left_bools[i].split("###")
                        var color = "red"
                        if (tempL[0] == "T") {
                            color = "green"
                        }
                        left_proofs.push(tempL[1])
                        newString = setLabel(left_bools, right_bools, i, 'L')
                        lt.innerHTML += 
                            '<div id="lweak_card'+i+'" class="'+color+' card">'
                                +'<div class="content">'
                                    +'<div class="header">'+newString+'</div>'
                                +'</div>'
                                +'<div id="L'+i+'" class="ui bottom attached button" onClick=showProof("L",'+i+',"no")>'
                                    +'<i class="question icon"></i>'
                                +'</div>'
                            +'</div>'
                            +'<div class="ui two cards" id="lproof'+i+'">'
                            +'</div>'
                    }
                }
            }
            if (right_bools.length > 1) {
                var rt = document.getElementById("right_sides")
                for (var i = 0; i < right_bools.length; i++) {
                    if (right_bools[i] != "") {
                        var tempR = right_bools[i].split("###")
                        var color = "red"
                        if (tempR[0] == "T") {
                            color = "green"
                        }
                        right_proofs.push(tempR[1])
                        newString = setLabel(left_bools, right_bools, i, 'R')
                        rt.innerHTML += 
                            '<div id="rweak_card'+i+'" class="'+color+' card">'
                                +'<div class="content">'
                                    +'<div class="header">'+newString+'</div>'
                                +'</div>'
                                +'<div id="R'+i+'" class="ui bottom attached button" onClick=showProof("R",'+i+',"no")>'
                                    +'<i class="question icon"></i>'
                                +'</div>'
                            +'</div>'
                            +'<div class="ui two cards" id="rproof'+i+'">'
                            +'</div>'
                    }
                }
            }
            MathJax.Hub.Queue(["Typeset",MathJax.Hub,lt], function () { 
                MathJax.Hub.Queue(["Typeset",MathJax.Hub,rt], function () {
                    document.getElementById("loading").setAttribute("class", "ui inactive inverted dimmer")
                })
            })
        })
    })
}