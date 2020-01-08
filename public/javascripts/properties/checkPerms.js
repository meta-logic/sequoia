var rule1 = ""
var rule2 = ""

function selectRule(bl, i) {
    if (bl == "true" && (rule1 == "" || rule2 == "")) {
        if (rule1 == "") {
            rule1 = "r"+i
        } else if (rule2 == "") {
            rule2 = "r"+i
        }
        document.getElementById("rule_card"+i).setAttribute("class", "ui raised card")
        document.getElementById("b"+i).setAttribute("class", "ui active bottom attached button")
        document.getElementById("b"+i).setAttribute("onClick", 'selectRule("false",'+i+')')
        document.getElementById("i"+i).setAttribute("class", 'close icon')
    } else if (bl == "false") {
        if (rule1 == "r"+i) {
            rule1 = ""
        } else if (rule2 == "r"+i) {
            rule2 = ""
        }
        document.getElementById("rule_card"+i).setAttribute("class", "ui card")
        document.getElementById("b"+i).setAttribute("class", "ui bottom attached button")
        document.getElementById("b"+i).setAttribute("onClick", 'selectRule("true",'+i+')')
        document.getElementById("i"+i).setAttribute("class", 'add icon')
        document.getElementById("perm_button").setAttribute("class", "ui disabled teal large button")
    }
    if (rule1 != "" && rule2 != "") {
        document.getElementById("perm_button").setAttribute("class", "ui teal large button")
    }
}

function permRules() {
    document.getElementById("loading").setAttribute("class", "ui active inverted dimmer")
    document.getElementById('info_answer').innerHTML = ""
    document.getElementById("good_trees").innerHTML = ""
    document.getElementById("bad_trees").innerHTML = ""

    warning_init = '<div id="init warning" class="ui red negative message">'
        +'<div class="header">Not Permutable</div>'
            +'<p>Please select rules that are not axioms or init rules</p>'
        +'</div>'

    var ruletemp1 = document.getElementById(rule1)
    var name1 = ruletemp1.getAttribute("rule_name").replace(/\\/g, "\\\\")
    var side1 = ruletemp1.getAttribute("side")
    var conclusion1 = ruletemp1.getAttribute("conclusion")
    var premises1 = ruletemp1.getAttribute("premises")
    var rule_sml1 = "Rule(\""+name1+"\",None,"+conclusion1+","+premises1+")"

    var ruletemp2 = document.getElementById(rule2)
    var name2 = ruletemp2.getAttribute("rule_name").replace(/\\/g, "\\\\")
    var side2 = ruletemp2.getAttribute("side")
    var conclusion2 = ruletemp2.getAttribute("conclusion")
    var premises2 = ruletemp2.getAttribute("premises")
    var rule_sml2 = "Rule(\""+name2+"\",None,"+conclusion2+","+premises2+")"

    var message = document.getElementById('info_answer')

    if (side1 == "None" || side2 == "None") {
        message.innerHTML = warning_init
        document.getElementById("loading").setAttribute("class", "ui inactive inverted dimmer")
        return
    }
    if (document.getElementById('init warning') != null) {
        document.getElementById('init warning').remove()
    }

    var init_list = "["
    for (var j = 0; j < r; j++) {
        if ("None" == document.getElementById("r"+j).getAttribute("side")) {
            var init = document.getElementById("r"+j)
            var nameInit = init.getAttribute("rule_name").replace(/\\/g, "\\\\")
            var conclusionInit = init.getAttribute("conclusion")
            var rule_smlInit = "Rule(\""+nameInit+"\",None,"+conclusionInit+",\[\])"
            init_list += rule_smlInit + ","
        }
    }
    init_list = init_list.slice(0,Math.max(1,init_list.length-1)) + "]"


    $.post("/permute", { rule1: rule_sml1, rule2: rule_sml2, init_rules: init_list }, function(data, status) {
        var output = data.output.split("%%%")
        var answer = output[0].split("@@@")
        var trees = output[1].split("&&&")
        var goodtrees = trees[0].split("###")
        var badtrees = trees[1].split("###")
        var message = document.getElementById('info_answer')
        message.innerHTML = '<div id="answer" class="ui info message">'
            +'<div class="header">'+answer[0]+'</div>'
                +'<p>'+answer[1]+'</p>'
            +'</div>'

        if (goodtrees.length > 1) {
            var gtrees = document.getElementById("good_trees")
            for (var i = 0; i < goodtrees.length; i++) {
                if (goodtrees[i] != "") {
                    gtrees.innerHTML += 
                        '<div id="gtree_card'+i+'" class="ui green card">'
                            +'<div class="content">'+goodtrees[i]+'</div></div>'
                }
            }
        }
        if (badtrees.length > 1) {
            var btrees = document.getElementById("bad_trees")
            for (var i = 0; i < badtrees.length; i++) {
                if (badtrees[i] != "") {
                    btrees.innerHTML += 
                        '<div id="btree_card'+i+'" class="ui red card">'
                            +'<div class="content">'+badtrees[i]+'</div>'
                }
            }
        }
        var r1 = rule1[1]
        document.getElementById("rule_card"+r1).setAttribute("class", "ui card")
        document.getElementById("b"+r1).setAttribute("class", "ui bottom attached button")
        document.getElementById("b"+r1).setAttribute("onClick", 'selectRule("true",'+r1+')')
        document.getElementById("i"+r1).setAttribute("class", 'add icon')

        var r2 = rule2[1]
        document.getElementById("rule_card"+r2).setAttribute("class", "ui card")
        document.getElementById("b"+r2).setAttribute("class", "ui bottom attached button")
        document.getElementById("b"+r2).setAttribute("onClick", 'selectRule("true",'+r2+')')
        document.getElementById("i"+r2).setAttribute("class", 'add icon')

        document.getElementById("perm_button").setAttribute("class", "ui disabled teal large button")
        rule1 = ""
        rule2 = ""

        MathJax.Hub.Queue(["Typeset",MathJax.Hub,gtrees], function () { 
            MathJax.Hub.Queue(["Typeset",MathJax.Hub,btrees], function () {
                document.getElementById("loading").setAttribute("class", "ui inactive inverted dimmer")
            })
        })
    })
}