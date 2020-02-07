var v = 0
var rule_name = ""
var rule_type = ""
var rule_side = ""
var rule_connective = ""
var rule_premises = []
var rule_conclusion = ""

function addPremise() {
    var premises = ""
    v++
    var div = $("#premise")
    for (var i = 0; i < v; i++) {
        var value = $("#i"+i).val()
        premises += 
            '<input type="text" id="i'+i+'" placeholder="Premise" value="'+value+'">'+
                '<button onclick="removePremise('+i+')" class="ui circular icon button red">'+
                    '<i class="icon close"></i>'+
                '</button>'+
            '</input>'
    }
    premises += 
        '<input type="text" id="i'+v+'" placeholder="Premise">'+
            '<button onclick="addPremise()" class="ui circular icon button green">'+
                '<i class="icon add"></i>'+
            '</button>'+
        '</input>'
    div.html(premises)
}


function removePremise(index) {
    var premises = ""
    var div = $("#premise")
    for (var i = 0; i < index; i++) {
        var value = $("#i"+i).val()
        premises += 
            '<input type="text" id="i'+i+'" placeholder="Premise" value="'+value+'">'+
                '<button onclick="removePremise('+i+')" class="ui circular icon button red">'+
                    '<i class="icon close"></i>'+
                '</button>'+
            '</input>'
    }
    for (var i = index + 1; i < v; i++) {
        var value = $("#i"+i).val()
        premises += 
            '<input type="text" id="i'+(i-1)+'" placeholder="Premise" value="'+value+'">'+
                '<button onclick="removePremise('+(i-1)+')" class="ui circular icon button red">'+
                    '<i class="icon close"></i>'+
                '</button>'+
            '</input>'
    }
    var value = $("#i"+v).val()
    v--
    premises += 
        '<input type="text" id="i'+v+'" placeholder="Premise" value="'+value+'">'+
            '<button onclick="addPremise()" class="ui circular icon button green">'+
                '<i class="icon add"></i>'+
            '</button>'+
        '</input>'
    div.html(premises)
}


function preview() {
    $("#warning").css("visibility","hidden")
    var calc_id = $("#calc_id").text()
    $.get("/api/rules/"+calc_id, function (rls, status) {
        var rules = rls.rules
        rule_name = $("#rule_name").val()
        rule_type = $("#kind").val()
        rule_side = $("#side").val()
        rule_connective = $("#connective").val()
        temp_premises = $("#i0").val().replace(/\s\s+/g, " ")
        rule_premises = [($("#i0").val())]
        for (var i = 1; i <= v; i++) {
            var prem_seq = $("#i"+i).val()
            if (prem_seq.trim() != "") {
                temp_premises += " \\quad \\quad " + prem_seq
                rule_premises.push(prem_seq)
            }
        }
        rule_conclusion = $("#conclusion").val()
        var opt = $("#page").text()
        if (rule_name == "") {
            $("#warning_header").html("Rule Name Missing")
            $("#warning_text").html("A rule must be given a name.")
            $("#warning").css("visibility","visible")
            $("#submit").attr("class","ui disabled fluid large circular icon button green")
            return
        }
        for (var i = 0; i < rules.length; i++) {
            if (rule_name == rules[i].rule) {
                if (opt == "Add") {
                    $("#warning_header").html("Redundant Names")
                    $("#warning_text").html("A rule with that name is already defined.")
                    $("#warning").css("visibility","visible")
                    $("#submit").attr("class","ui disabled fluid large circular icon button green")
                    return
                }
                else if (opt == "Update" && $("#rule_id").text() != rules[i]._id){
                    $("#warning_header").html("Redundant Names")
                    $("#warning_text").html("A rule with that name is already defined.")
                    $("#warning").css("visibility","visible")
                    $("#submit").attr("class","ui disabled fluid large circular icon button green")
                    return
                }
            } 
        }
        if (rule_type == "") {
            $("#warning_header").html("Rule Type Missing")
            $("#warning_text").html("A rule must be associated with a rule type.")
            $("#warning").css("visibility","visible")
            $("#submit").attr("class","ui disabled fluid large circular icon button green")
            return
        }
        if (rule_side == "" || !((rule_side == "None" && (rule_type == "Axiom" || rule_type == "Cut")) ||
            ((rule_side == "Left" || rule_side == "Right") && (rule_type == "Logical" || rule_type == "Structural")))) {
            $("#warning_header").html("Rule Side Error")
            $("#warning_text").html("A Logical or Structural type rule must be associated with a Left or Right side, and an Axiom or Cut type rule must be associated with None.")
            $("#warning").css("visibility","visible")
            $("#submit").attr("class","ui disabled fluid large circular icon button green")
            return
        }
        if (rule_connective == "" && rule_type == "Logical") {
            $("#warning_header").html("Main Connective Missing")
            $("#warning_text").html("A Logical type rule must be associated with a main connective.")
            $("#warning").css("visibility","visible")
            $("#submit").attr("class","ui disabled fluid large circular icon button green")
            return
        }
        if (rule_conclusion.trim() == "") {
            $("#warning_header").html("Conclusion Missing")
            $("#warning_text").html("A rule must have a non-empty conclusion.")
            $("#warning").css("visibility","visible")
            $("#submit").attr("class","ui disabled fluid large circular icon button green")
            return
        }
        $("#rule").html('$$\\frac{'+temp_premises+'}{'+rule_conclusion+'}'+rule_name+'$$')
        MathJax.Hub.Queue(["Typeset",MathJax.Hub,$("#rule")[0]])
        var addButton = $("#submit")
        addButton.attr("onClick", "placeRule('"+opt+"')") 
        addButton.html(opt+' This Rule')
        addButton.css("visibility","visible")
        $("#sym_table").css("visibility","visible")
        $("#typ").css("visibility","visible")
        $("#submit").attr("class","ui fluid large circular icon button green")
    })
}