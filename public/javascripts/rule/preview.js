var v = 0


function addPremise() {
    var premises = ""
    var value = ""
    v++
    // getting the premise div content
    var div = document.getElementById("premise")
    // adding a premise input
    for (var i = 0; i < v; i++) {
        value = document.getElementById("i" + i.toString()).value
        premises += "<input type=\"text\" id=\"i" + i.toString() + "\" placeholder=\"Premise\" value=\""+ value +"\"><button onclick=\"removePremise(" + i.toString()+ ")\" class=\"ui circular icon button red\"><i class=\"icon close\"></i></button><p style=\"color: white\">s</p>"
    }
    premises += "<input type=\"text\" id=\"i" + v.toString() + "\" placeholder=\"Premise\"><button onclick=\"addPremise()\" class=\"ui circular icon button green\"><i class=\"icon add\"></i></button><p style=\"color: white\">s</p>"
    div.innerHTML = premises
}


function removePremise(index) {
    var premises = ""
    var value = ""
    // getting the premise div content
    var div = document.getElementById("premise")
    // adding a premise input
    for (var i = 0; i < index; i++) {
        value = document.getElementById("i" + i.toString()).value
        premises += "<input type=\"text\" id=\"i" + i.toString() + "\" placeholder=\"Premise\" value=\""+ value +"\"><button onclick=\"removePremise(" + i.toString()+ ")\" class=\"ui circular icon button red\"><i class=\"icon close\"></i></button><p style=\"color: white\">s</p>"
    }

    for (i = index + 1; i < v; i++) {
        value = document.getElementById("i" + i.toString()).value
        premises += "<input type=\"text\" id=\"i" + (i-1).toString() + "\" placeholder=\"Premise\" value=\""+ value +"\"><button onclick=\"removePremise(" + (i-1).toString()+ ")\" class=\"ui circular icon button red\"><i class=\"icon close\"></i></button><p style=\"color: white\">s</p>"
    }
    value = document.getElementById("i" + v.toString()).value
    v--
    premises += "<input type=\"text\" id=\"i" + v.toString() + "\" placeholder=\"Premise\" value=\""+ value +"\"><button onclick=\"addPremise()\" class=\"ui circular icon button green\"><i class=\"icon add\"></i></button><p style=\"color: white\">s</p>"
    div.innerHTML = premises
} 


function preview (opt) {
    var warning_text_red = "<div id=\"redundant warning\"><div class=\"ui red negative message\">"+
    "<div class=\"header\">Redundant Names</div>"+
    "<p>A rule with that name already exists</p></div></div>"
    var warning_text_conc = "<div id=\"conclusion warning\"><div class=\"ui red negative message\">"+
    "<div class=\"header\">Empty Conclusion</div>"+
    "<p>Rules must have a non-empty conclusion</p></div></div>"
    var warning_text_name = "<div id=\"name warning\"><div class=\"ui red negative message\">"+
    "<div class=\"header\">Missing Rule Name</div>"+
    "<p>Rules must be given name</p></div></div>"
    var warning_text_side = "<div id=\"side warning\"><div class=\"ui red negative message\">"+
    "<div class=\"header\">Missing Side</div>"+
    "<p>Rules must be clearly associated with either a side or with none</p></div></div>"
    var warning_text_connective = "<div id=\"connective warning\"><div class=\"ui red negative message\">"+
    "<div class=\"header\">Missing Main Connective</div>"+
    "<p>Rules must be associated with a main connective</p></div></div>"
    var calc_id = document.getElementById("calc_id").innerHTML

    $.get("/api/rules/"+calc_id, function (rls, status) {
        var rules = rls.rules

        var rule = document.getElementById("rule")
        var rule_name = document.getElementById("rule_name").value
        var premises = document.getElementById("i0").value
        var conc = document.getElementById("Conclusion").value
        var connective  = document.getElementById("connective").value
        var side = document.getElementById("side").value
        var warning = document.getElementById("warning")
        var addButton = document.getElementById("add")
        var table = document.getElementById("table")

        if (document.getElementById("parse warning") != null){
            document.getElementById("parse warning").remove()
        }
        if (rule_name == "") {
            warning.innerHTML = warning_text_name
            return
        }
        if (document.getElementById("name warning") != null){
            document.getElementById("name warning").remove()
        }
        if (side == "") {
            warning.innerHTML = warning_text_side
            return
        }
        if (document.getElementById("side warning") != null){
            document.getElementById("side warning").remove()
        }
        if (connective == "" && (side == "Right" || side == "Left")) {
            warning.innerHTML = warning_text_connective
            return
        }
        if (document.getElementById("connective warning") != null){
            document.getElementById("connective warning").remove()
        }
        for (var i = 0; i < rules.length; i++) {
            if (rule_name == rules[i].rule) {
                if (opt == "Add") {
                    warning.innerHTML = warning_text_red
                    return
                }
                else if (opt == "Update" && document.getElementById("rule_id").value != rules[i]._id){
                    warning.innerHTML = warning_text_red
                    return
                }
            } 
        }
        if (document.getElementById("redundant warning") != null){
            document.getElementById("redundant warning").remove()
        }
        if (conc.trim() == "") {
            warning.innerHTML = warning_text_conc
            return
        }
        if (document.getElementById("conclusion warning") != null){
            document.getElementById("conclusion warning").remove()
        }

        premises.replace(/\s\s+/g, " ")
        for (var i = 1; i <= v; i++) {
            if (document.getElementById("i" + i.toString()).value.trim() != "") {
                premises += " \\quad \\quad " + document.getElementById("i" + i.toString()).value
            }
        }
        rule.innerHTML = "\\[\\frac{"+premises+"}{"+conc+"}"+rule_name+"\\]"
        MathJax.Hub.Queue(["Typeset",MathJax.Hub,rule])

        if (document.getElementById("submit") != null) {
            document.getElementById("submit").remove()
        }
        addButton.innerHTML = "<a id = \"submit\" class=\"ui fluid large circular icon button green\" onclick=\"placeRule("+"\'"+opt+"\'"+")\">"+opt+" This Rule</a>"

        if (document.getElementById("sym_table") != null) {
            document.getElementById("sym_table").remove()
        }
        table.innerHTML =
            "<table id=\"sym_table\" class= \"ui sortable fixed single line celled table\"> <thead> <tr><th>Rule Symbols</th> <th>Types</th> </tr></thead>"+ 
                "<tbody id=\"init\"><tbody>"+
                "<tbody id=\"table_head\">"+ 
                    "<tr id = \"input_row\">"+
                        "<td id= \"input_field\" style=\"text-align:center\">"+
                            "<div class=\"ui input focus\">"+
                                "<input id=\"sym\" type=\"text\" placeholder=\"Symbol Here\">"+
                            "</div>"+
                        "</td>"+
                        "<td id= \"select_field\" >"+
                            "<select class=\"ui search dropdown\" style=\"fixed\" id=\"select-sym\" ><option value=\"\">Type</option><option value=\"atom variable\">atom variable</option><option value=\"formula variable\">formula variable</option><option value=\"connective\">connective</option><option value=\"context variable\">context variable</option><option value=\"sequent sign\">sequent sign</option><option value=\"context separator\">context separator</option><option value=\"empty\">empty</option></select>"+
                            "<button class=\"ui right floated button primary\" onclick=\"add_symbol_toTable(\'rule\')\">Add Symbol</button>"+
                        "</td></tr></tbody></table><br><br>"
        s = 0
        get_symbols_toTable("rule")
    })
}