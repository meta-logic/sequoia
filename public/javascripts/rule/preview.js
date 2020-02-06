var v = 0

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
    var calc_id = $("#calc_id").text()
    $("#warning").css("visibility","hidden")
    $.get("/api/rules/"+calc_id, function (rls, status) {
        var rules = rls.rules
        var rule_name = $("#rule_name").val()
        var premises = $("#i0").val()
        var conc = $("#conclusion").val()
        var connective = $("#connective").val()
        var side = $("#side").val()
        var opt = $("#page").text()
        if (rule_name == "") {
            $("#warning_header").html("Rule Name Missing")
            $("#warning_text").html("Rules must be given a name.")
            $("#warning").css("visibility","visible")
            return
        }
        for (var i = 0; i < rules.length; i++) {
            if (rule_name == rules[i].rule) {
                if (opt == "Add") {
                    $("#warning_header").html("Redundant Names")
                    $("#warning_text").html("A rule with that name is already defined.")
                    $("#warning").css("visibility","visible")
                    return
                }
                else if (opt == "Update" && $("#rule_id").val() != rules[i]._id){
                    $("#warning_header").html("Redundant Names")
                    $("#warning_text").html("A rule with that name is already defined.")
                    $("#warning").css("visibility","visible")
                    return
                }
            } 
        }
        if (side == "") {
            $("#warning_header").html("Rule Side Missing")
            $("#warning_text").html("Rules must be associated either with a side if its a normal rule, with structural if its a structural rule, with cut if it's a cut rule, or with none if there is no clear side (inital and axiom rules).")
            $("#warning").css("visibility","visible")
            return
        }
        if (connective == "" && (side == "Right" || side == "Left")) {
            $("#warning_header").html("Rule Main Connective Missing")
            $("#warning_text").html("Rules must be associated with a main connective.")
            $("#warning").css("visibility","visible")
            return
        }
        if (conc.trim() == "") {
            $("#warning_header").html("Conclusion Missing")
            $("#warning_text").html("Rules must have a non-empty conclusion.")
            $("#warning").css("visibility","visible")
            return
        }
        premises.replace(/\s\s+/g, " ")
        for (var i = 1; i <= v; i++) {
            if ($("#i"+i).val().trim() != "") {
                premises += " \\quad \\quad " + $("#i"+i).val()
            }
        }
        $("#rule").html('$$\\frac{'+premises+'}{'+conc+'}'+rule_name+'$$')
        MathJax.Hub.Queue(["Typeset",MathJax.Hub,$("#rule")[0]])
        var addButton = $("#submit")
        addButton.attr("onClick", "placeRule('"+opt+"')") 
        addButton.html(opt+' This Rule')
        addButton.css("visibility","visible")
        $("#sym_table").css("visibility","visible")
        $("#typ").css("visibility","visible")
    })
}