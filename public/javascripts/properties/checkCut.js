// Sequoia Copyright (C) 2020  Zan Naeem
// This program comes with ABSOLUTELY NO WARRANTY; for details type `show w'.
// This is free software, and you are welcome to redistribute it
// under certain conditions; type `show c' for details.


var rule1 = ""
var cutform = ""

function selectRule(bl, i) {
    $("#info_answer").css("visibility","hidden")
    if (bl && rule1 == "") {
        rule1 = "r"+i
        $("#rule_card"+i).attr("class", "ui raised card")
        $("#b"+i).attr("class", "ui active bottom attached button")
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


function showProof(type, index, on) {
    if (on == "yes") {
        $("#"+type+index).attr("onClick", "showProof('"+type+"',"+index+",'no')")
        $("#"+type+"proof"+index).css("display", "none")
    } else {
        $("#"+type+index).attr("onClick", "showProof('"+type+"',"+index+",'yes')")
        $("#"+type+"proof"+index).css("display", "flex")
    }
}


function cutSelect () {
    $('#modal1').modal({
        onApprove: function () {
            var v = $("#var").val()
            if (v == "") {
                return
            } else {
                cutform = "FormVar(\""+v+"\")"
                $("#var").val("")
                checkCut()
            }
        }
    })
    .modal('setting', 'closable', false).modal('show')
}


function checkCut() {
    $("#results").css("visibility","hidden")
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
    $.post("/sequoia/cutElim", { rule1: rule_sml1, formula: cutform, init_rules: init_strings, conn_rules: conn_strings, wL: weak_l, wR: weak_r }, function(data, status) {
        $("#results").css("visibility","visible")
        var output = data.output.split("%%%")
        var answer = output[0].split("@@@")
        var axioms = output[1].split("@@@")
        var ranks = output[2].split("@@@")
        var grades = output[3].split("@@@")
        var message = $("#info_answer")
        message.attr("class", "ui info message")
        $("#info_header").html(answer[0])
        $("#info_text").html(answer[1])
        message.css("visibility","visible")
        var ax = $("#axiom")
        for (var i = 0; i < axioms.length; i++) {
            if (axioms[i] != "") {
                var temp = axioms[i].split("###")
                var color = "red"
                if (temp[0] == "T") {
                    color = "green"
                }
                ax.append( 
                    '<div class="'+color+' card">'+
                        '<div class="content">'+
                            '<div class="header">$$'+it_ordered[i]+'$$</div>'+
                        '</div>'+
                        '<div id="AX'+i+'" class="ui bottom attached button" onClick=showProof("AX",'+i+',"no")>'+
                            '<i class="question icon"></i>'+
                        '</div>'+
                    '</div>'+
                    '<div class="ui one cards" id="AXproof'+i+'" style="display: none;">'+
                    '</div>'
                )
                var proofs_list = temp[1].split("&&&")
                var ax_proofs = $("#AXproof"+i)
                for (var j = 0; j < proofs_list.length; j++) {
                    if (proofs_list[j] != "") {
                        ax_proofs.append(
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
        var rk = $("#rank")
        for (var i = 0; i < ranks.length; i++) {
            if (ranks[i] != "") {
                var temp = ranks[i].split("###")
                var color = "red"
                if (temp[0] == "T") {
                    color = "green"
                }
                rk.append( 
                    '<div class="'+color+' card">'+
                        '<div class="content">'+
                            '<div class="header">$$'+rl_ordered[i]+'$$</div>'+
                        '</div>'+
                        '<div id="RK'+i+'" class="ui bottom attached button" onClick=showProof("RK",'+i+',"no")>'+
                            '<i class="question icon"></i>'+
                        '</div>'+
                    '</div>'+
                    '<div class="ui one cards" id="RKproof'+i+'" style="display: none;">'+
                    '</div>'
                )
                var proofs_list = temp[1].split("&&&")
                var rk_proofs = $("#RKproof"+i)
                for (var j = 0; j < proofs_list.length; j++) {
                    if (proofs_list[j] != "") {
                        rk_proofs.append(
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
        var gd = $("#grade")
        for (var i = 0; i < grades.length; i++) {
            if (grades[i] != "") {
                var temp = grades[i].split("###")
                var color = "red"
                if (temp[0] == "T") {
                    color = "green"
                }
                gd.append( 
                    '<div class="'+color+' card">'+
                        '<div class="content">'+
                            '<div class="header">$$'+con_ordered[i]+'$$</div>'+
                        '</div>'+
                        '<div id="GD'+i+'" class="ui bottom attached button" onClick=showProof("GD",'+i+',"no")>'+
                            '<i class="question icon"></i>'+
                        '</div>'+
                    '</div>'+
                    '<div class="ui one cards" id="GDproof'+i+'" style="display: none;">'+
                    '</div>'
                )
                var proofs_list = temp[1].split("&&&")
                var gd_proofs = $("#GDproof"+i)
                for (var j = 0; j < proofs_list.length; j++) {
                    if (proofs_list[j] != "") {
                        gd_proofs.append(
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
        var r1 = rule1.slice(1,rule1.length)
        $("#rule_card"+r1).attr("class", "ui card")
        $("#b"+r1).attr("class", "ui bottom attached button")
        $("#b"+r1).attr("onClick", 'selectRule("true",'+r1+')')
        $("#i"+r1).attr("class", 'add icon')
        $("#cut_button").attr("class", "ui disabled teal large button")
        rule1 = ""
        MathJax.Hub.Queue(["Typeset",MathJax.Hub,ax[0]], function () { 
            MathJax.Hub.Queue(["Typeset",MathJax.Hub,rk[0]], function () {
                MathJax.Hub.Queue(["Typeset",MathJax.Hub,gd[0]], function () {
                    $("#loading").attr("class", "ui inactive inverted dimmer")
                })
            })
        })
    })
}