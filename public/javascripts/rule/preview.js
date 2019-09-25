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
        premises += "<input type=\"text\" id=\"i" + i.toString() + "\" placeholder=\"Premise\" value=\""+ value +"\"><button onclick=\"removePremise(" + i.toString()+ ")\" class=\"ui circular icon button\"><i class=\"icon close\"></i></button><p style=\"color: white\">s</p>"
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
        premises += "<input type=\"text\" id=\"i" + i.toString() + "\" placeholder=\"Premise\" value=\""+ value +"\"><button onclick=\"removePremise(" + i.toString()+ ")\" class=\"ui circular icon button\"><i class=\"icon close\"></i></button><p style=\"color: white\">s</p>"
    }

    for (i = index + 1; i < v; i++) {
        value = document.getElementById("i" + i.toString()).value
        premises += "<input type=\"text\" id=\"i" + (i-1).toString() + "\" placeholder=\"Premise\" value=\""+ value +"\"><button onclick=\"removePremise(" + (i-1).toString()+ ")\" class=\"ui circular icon button\"><i class=\"icon close\"></i></button><p style=\"color: white\">s</p>"
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

    $.get("/api/get-rules", function (rls, status) {
        var rule = document.getElementById("rule")
        var rule_name = document.getElementById("rule_name").value
        var premises = document.getElementById("i0").value
        var conc = document.getElementById("Conclusion").value
        var warning = document.getElementById("warning")
        var addButton = document.getElementById("add")
        var table = document.getElementById("table")

        var parse_warning = document.getElementById("parse warning")
        if (parse_warning != null){
            parse_warning.remove()
        }

        if (rule_name == "") {
            warning.innerHTML = warning_text_name
            return
        }
        var name_warning = document.getElementById("name warning")
        if (name_warning != null){
            name_warning.remove()
        }
        rules = rls
        for (var i = 0; i < rules.length; i++) {
            if (rule_name == rules[i].rule) {
                if (opt == "Add") {
                    warning.innerHTML = warning_text_red
                    return
                }
                else if (opt == "Update" && document.getElementById("id").value != rules[i]._id){
                    warning.innerHTML = warning_text_red
                    return
                }
            } 
        }
        var redundant_warning = document.getElementById("redundant warning")
        if (redundant_warning != null){
            redundant_warning.remove()
        }

        premises.replace(/\s\s+/g, " ")
        for (var i = 1; i <= v; i++) {
            if (document.getElementById("i" + i.toString()).value.trim() != "") {
                premises += " \\quad \\quad " + document.getElementById("i" + i.toString()).value
            }
        }
        if (conc.trim() == "") {
            warning.innerHTML = warning_text_conc
            return
        }
        var conclusion_warning = document.getElementById("conclusion warning")
        if (conclusion_warning != null){
            conclusion_warning.remove()
        }
        rule.innerHTML = "\\[\\frac{"+premises+"}{"+conc+"}"+rule_name+"\\]"
        MathJax.Hub.Queue(["Typeset",MathJax.Hub,rule])

        var sub = document.getElementById("submit")
        if (sub != null) {
            sub.remove()
        }
        addButton.innerHTML = "<a id = \"submit\" class=\"ui fluid circular icon button green\" onclick=\"placeRule("+"\'"+opt+"\'"+")\">"+opt+" This Rule</a>"

        var symtbl = document.getElementById("sym_table")
        if (symtbl != null) {
            symtbl.remove()
        }
        table.innerHTML =
            "<table id=\"sym_table\" class= \"ui sortable fixed single line celled table\"> <thead> <tr><th>Symbols</th> <th>Types</th> </tr></thead>"+ 
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