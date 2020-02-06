var rule1 = ""
var rule2 = ""

function selectRule(bl, i) {
    $("#info_answer").css("visibility","hidden")
    if (bl && (rule1 == "" || rule2 == "")) {
        if (rule1 == "") {
            rule1 = "r"+i
        } else if (rule2 == "") {
            rule2 = "r"+i
        }
        $("#rule_card"+i).attr("class", "ui raised card")
        $("#b"+i).attr("class", "ui active bottom attached button")
        $("#b"+i).attr("onClick", 'selectRule(false,'+i+')')
        $("#i"+i).attr("class", 'close icon')
    } else if (!bl) {
        if (rule1 == "r"+i) {
            rule1 = ""
        } else if (rule2 == "r"+i) {
            rule2 = ""
        }
        $("#rule_card"+i).attr("class", "ui card")
        $("#b"+i).attr("class", "ui bottom attached button")
        $("#b"+i).attr("onClick", 'selectRule(true,'+i+')')
        $("#i"+i).attr("class", 'add icon')
        $("#perm_button").attr("class", "ui disabled teal large button")
    }
    if (rule1 != "" && rule2 != "") {
        $("#perm_button").attr("class", "ui teal large button")
    }
}

function permRules() {
    $("#loading").attr("class", "ui active inverted dimmer")
    $("#good_trees").html("")
    $("#bad_trees").html("")
    var ruletemp1 = $("#"+rule1)
    var name1 = ruletemp1.attr("rule_name")
    var side1 = ruletemp1.attr("side")
    var conclusion1 = ruletemp1.attr("conclusion")
    var premises1 = ruletemp1.attr("premises")
    var rule_sml1 = "Rule(\""+name1+"\","+side1+","+conclusion1+","+premises1+")"
    var ruletemp2 = $("#"+rule2)
    var name2 = ruletemp2.attr("rule_name")
    var side2 = ruletemp2.attr("side")
    var conclusion2 = ruletemp2.attr("conclusion")
    var premises2 = ruletemp2.attr("premises")
    var rule_sml2 = "Rule(\""+name2+"\","+side2+","+conclusion2+","+premises2+")"
    $.post("/permute", { rule1: rule_sml1, rule2: rule_sml2, init_rules: init_strings, wL: weak_l, wR: weak_r}, function(data, status) {
        var output = data.output.split("%%%")
        var answer = output[0].split("@@@")
        var trees = output[1].split("&&&")
        var goodtrees = trees[0].split("###")
        var badtrees = trees[1].split("###")
        var message = $("#info_answer")
        message.attr("class", "ui info message")
        $("#info_header").html(answer[0])
        $("#info_text").html(answer[1])
        message.css("visibility","visible")
        var gtrees = $("#good_trees")
        for (var i = 0; i < goodtrees.length; i++) {
            if (goodtrees[i] != "") {
                gtrees.append( 
                    '<div id="gtree_card'+i+'" class="ui green card">'+
                        '<div class="content">'+goodtrees[i]+'</div>'+
                    '</div>'
                )
            }
        }
        var btrees = $("#bad_trees")
        for (var i = 0; i < badtrees.length; i++) {
            if (badtrees[i] != "") {
                btrees.append( 
                    '<div id="btree_card'+i+'" class="ui red card">'+
                        '<div class="content">'+badtrees[i]+'</div>'+
                    '</div>'
                )
            }
        }
        var r1 = rule1.slice(1,rule1.length)
        $("#rule_card"+r1).attr("class", "ui card")
        $("#b"+r1).attr("class", "ui bottom attached button")
        $("#b"+r1).attr("onClick", 'selectRule("true",'+r1+')')
        $("#i"+r1).attr("class", 'add icon')
        var r2 = rule2.slice(1,rule2.length)
        $("#rule_card"+r2).attr("class", "ui card")
        $("#b"+r2).attr("class", "ui bottom attached button")
        $("#b"+r2).attr("onClick", 'selectRule("true",'+r2+')')
        $("#i"+r2).attr("class", 'add icon')
        $("#perm_button").attr("class", "ui disabled teal large button")
        rule1 = ""
        rule2 = ""
        MathJax.Hub.Queue(["Typeset",MathJax.Hub,gtrees[0]], function () { 
            MathJax.Hub.Queue(["Typeset",MathJax.Hub,btrees[0]], function () {
                $("#loading").attr("class", "ui inactive inverted dimmer")
            })
        })
    })
}