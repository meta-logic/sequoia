// Sequoia Copyright (C) 2020  Zan Naeem
// This program comes with ABSOLUTELY NO WARRANTY; for details see LICENSE.
// This is free software, and you are welcome to redistribute it
// under certain conditions; see LICENSE for details.


var proof_content = {"axiom":[],"rank":[],"grade":[]}
var rule1 = ""

function selectRule(bl, i) {
    if (bl) {
        var r1 = rule1.slice(1,rule1.length)
        $("#rule_card"+r1).attr("class", "ui card")
        $("#b"+r1).attr("class", "ui bottom attached button")
        $("#b"+r1).attr("onClick", 'selectRule("true",'+r1+')')
        $("#i"+r1).attr("class", 'add icon')
        $("#cut_button").attr("class", "ui disabled teal large button")
        rule1 = "r"+i
        $("#rule_card"+i).attr("class", "ui raised card")
        $("#b"+i).attr("class", "ui active blue bottom attached button")
        $("#b"+i).attr("onClick", "selectRule(false,"+i+")")
        $("#i"+i).attr("class", "close icon")
        $("#cut_button").attr("class", "ui teal large button")
    } else if (!bl) {
        rule1 = ""
        $("#rule_card"+i).attr("class", "ui card")
        $("#b"+i).attr("class", "ui bottom attached button")
        $("#b"+i).attr("onClick", "selectRule(true,"+i+")")
        $("#i"+i).attr("class", "add icon")
        $("#cut_button").attr("class", "ui disabled teal large button")
    }
}


function showProofCut(type, index, on, num) {
    if (on == "yes") {
        $("#"+type+index).attr("onClick", "showProofCut('"+type+"',"+index+",'no',"+num+")")
        $("#Arrow"+type+index).attr("class", "caret down icon")
        for (var i = 0; i < num; i++) {
            $("#"+type+"proof"+index+""+i).css("display", "none")
        }
    } else {
        $("#"+type+index).attr("onClick", "showProofCut('"+type+"',"+index+",'yes',"+num+")")
        $("#Arrow"+type+index).attr("class", "caret up icon")
        for (var i = 0; i < num; i++) {
            $("#"+type+"proof"+index+""+i).css("display", "flex")
        }
    }
}


function checkCut() {
    $("#results").css("visibility", "hidden")
    $("#loading").attr("class", "ui active inverted dimmer")
    $("#axiom").html("")
    $("#rank").html("")
    $("#grade").html("")
    var ruletemp1 = $("#"+rule1)
    var name1 = ruletemp1.attr("rule_name")
    var side1 = ruletemp1.attr("side")
    var conclusion1 = ruletemp1.attr("conclusion")
    var premises1 = ruletemp1.attr("premises")
    var rule_sml1 = "Rule(\""+name1+"\","+side1+","+conclusion1+","+premises1+")"
    var cutform = ruletemp1.attr("cutvar")
    $.post("/sequoia/cutElim", {rule1 : rule_sml1, formula : cutform, init_rules : init_strings, conn_rules : conn_strings, wL : weak_l, wR : weak_r}, function(data, status) {
        $("#results").css("visibility", "visible")
        var output = data.output.split("%%%")
        var result = output[0]
        var answer = ["",""]
        if (result == "T") {
            answer[0] = "Cut admissibility proof succeeds"
            answer[1] = "The selected cut rule is admissible in this calculus. For each rule and connective the proof tree transformations are shown below."
        } else if (result == "F") {
            answer[0] = "Cut admissibility proof fails"
            answer[1] = "The selected cut rule might not be admissible in this calculus. For certain rules or connectives proof tree transformations could not be found. This check is sound but not complete."
        }
        $("#info_header").html(answer[0])
        $("#info_text").html(answer[1])
        $("#info_answer").attr("class", "ui info message")
        $("#info_answer").css("visibility", "visible")
        var axioms = output[1].split("@@@")
        var ranks = output[2].split("@@@")
        var grades = output[3].split("@@@")
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
                            '<div class="header">$$'+it_ordered[i]+'$$</div>'+
                        '</div>'+
                        '<div id="AX'+i+'" class="ui bottom attached button" onClick=showProofCut("AX",'+i+',"no",'+proofs_list.length+')>'+
                            '<i id="ArrowAX'+i+'" class="caret down icon"></i>'+
                        '</div>'+
                    '</div>'
                )
                for (var j = 0; j < proofs_list.length; j++) {
                    if (proofs_list[j] != "") {
                        var display_proofs = proofs_list[j].split("~~~")
                        proof_content["axiom"].push(display_proofs[1])
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
        var rk = $("#rank")
        for (var i = 0; i < ranks.length; i++) {
            if (ranks[i] != "") {
                var temp = ranks[i].split("###")
                var color = "red"
                if (temp[0] == "T") {
                    color = "green"
                }
                var proofs_list = temp[1].split("&&&")
                rk.append( 
                    '<div class="'+color+' card">'+
                        '<div class="content">'+
                            '<div class="header">$$'+rl_ordered[i]+'$$</div>'+
                        '</div>'+
                        '<div id="RK'+i+'" class="ui bottom attached button" onClick=showProofCut("RK",'+i+',"no",'+proofs_list.length+')>'+
                            '<i id="ArrowRK'+i+'" class="caret down icon"></i>'+
                        '</div>'+
                    '</div>'
                )
                for (var j = 0; j < proofs_list.length; j++) {
                    if (proofs_list[j] != "") {
                        var display_proofs = proofs_list[j].split("~~~")
                        proof_content["rank"].push(display_proofs[1])
                        rk.append(
                            '<div class="ui card" id="RKproof'+i+""+j+'" style="display: none;>'+
                                '<div class="content">'+
                                    '<div class="header">'+display_proofs[0]+'</div>'+
                                '</div>'+
                            '</div>'
                        )
                    }
                }
            }
        }
        var gd = $("#grade")
        for (var i = 0; i < grades.length; i++) {
            if (grades[i] != "") {
                var temp = grades[i].split("###")
                var color = "red"
                if (temp[0] == "T") {
                    color = "green"
                }
                var proofs_list = temp[1].split("&&&")
                gd.append( 
                    '<div class="'+color+' card">'+
                        '<div class="content">'+
                            '<div class="header">$$'+con_ordered[i]+'$$</div>'+
                        '</div>'+
                        '<div id="GD'+i+'" class="ui bottom attached button" onClick=showProofCut("GD",'+i+',"no",'+proofs_list.length+')>'+
                            '<i id="ArrowGD'+i+'" class="caret down icon"></i>'+
                        '</div>'+
                    '</div>'
                )
                for (var j = 0; j < proofs_list.length; j++) {
                    if (proofs_list[j] != "") {
                        var display_proofs = proofs_list[j].split("~~~")
                        proof_content["grade"].push(display_proofs[1])
                        gd.append(
                            '<div class="ui card" id="GDproof'+i+""+j+'" style="display: none;>'+
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
        $("#download").attr("onclick", "download(\"Cut_Admissibility\")")
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, ax[0]], function() { 
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, rk[0]], function() {
                MathJax.Hub.Queue(["Typeset", MathJax.Hub, gd[0]], function() {
                    $("#loading").attr("class", "ui inactive inverted dimmer")
                })
            })
        })
    })
}