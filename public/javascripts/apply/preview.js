
function preview() {
    var conc = document.getElementById("Sequent").value.replace(/\(/g, " ( ").replace(/\)/g, " ) ")
    var applyButton = document.getElementById("apply")
    var table = document.getElementById("table")
    var init_sequent = document.getElementById("init sequent")

    init_sequent.innerHTML =
		"<div style=\"margin: 35px;\"><table id=\"prooftree\" count=\"1\" style=\"margin: auto;\"><tr><td class=\"conc-temp\" id=\"prooftree_0_conc\">\\[" +
		conc +
        "\\]</td></tr></table></p></div>"
    MathJax.Hub.Queue([ "Typeset", MathJax.Hub, init_sequent ])

    applyButton.innerHTML = "<a id = \"submit\" class=\"ui fluid circular icon button teal\" onclick=\"useSequent()\">Start Building Tree</a>"

    var parse_warning = document.getElementById("parse warning")
    if (parse_warning != null){
        parse_warning.remove()
    }
    var symtbl = document.getElementById("sym_table")
    if (symtbl != null) {
        symtbl.remove()
    }
    table.innerHTML =
        "<table id=\"sym_table\" class= \"ui sortable fixed single line celled table\"> <thead> <tr><th>Sequent Term Symbols</th> <th>Types</th> </tr></thead>"+ 
            "<tbody id=\"init\"><tbody>"+
            "<tbody id=\"table_head\">"+ 
                "<tr id = \"input_row\">"+
                    "<td id= \"input_field\" style=\"text-align:center\">"+
                        "<div class=\"ui input focus\">"+
                            "<input id=\"sym\" type=\"text\" placeholder=\"Symbol Here\">"+
                        "</div>"+
                    "</td>"+
                    "<td id= \"select_field\" >"+
                        "<select class=\"ui search dropdown\" style=\"fixed\" id=\"select-sym\" ><option value=\"\">Type</option><option value=\"atom\">atom</option><option value=\"atom variable\">atom variable</option><option value=\"formula variable\">formula variable</option><option value=\"context variable\">context variable</option></select>"+
                        "<button class=\"ui right floated button primary\" onclick=\"add_symbol_toTable(\'seq\')\">Add Symbol</button>"+
                    "</td></tr></tbody></table><br><br>"
    get_symbols_toTable("seq")
}
