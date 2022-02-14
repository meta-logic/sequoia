// Sequoia Copyright (C) 2020  Zan Naeem, Abdulrahman Alfayad
// This program comes with ABSOLUTELY NO WARRANTY; for details see LICENSE.
// This is free software, and you are welcome to redistribute it
// under certain conditions; see LICENSE for details.


var parser_copy = pt
var parser = ""
var formula_parser = ""

function useSequent() {
    var parser_text = parser_copy
    var arrow = "SeqSign = \"NO-ARROW\" "
    var sep = "CtxSep = \"NO-SEP\" "
    var conn = "Conn = \"NO-Conn\" "
    var set = "CtxVar = \"NO-SET\" "
    var form = "FormVar = \"NO-FORM\" "
    var atom_var = "AtomVar = \"NO-ATOMVAR\" "
    var atom = "Atom = \"NO-ATOM\" "
    $.get("/sequoia/api/parsing_symbols/"+calc_id, function(sb, status) {
        var syms = sb.symbols
        syms = syms.sort(function(a, b) {
            return b.symbol.length - a.symbol.length
        })
        for (var i = 0; i < syms.length; i++) {
            var symbol = syms[i].symbol
            var type = syms[i].type
            symbol = symbol.replace(/\\/g, "\\\\")
            if (type == "sequent sign") {
                arrow += "/ \"" + symbol + "\" "
            }
            else if (type == "context separator") {
                sep += "/ \"" + symbol + "\" "
            }
            else if (type == "connective") {
                conn += "/ \"" + symbol + "\" "
            }
            else if (type == "context variable") {
                set += "/ \"" + symbol + "\" "
            }
            else if (type == "formula variable") {
                form += "/ \"" + symbol + "\" "
            }
            else if (type == "atom variable") {
                atom_var += "/ \"" + symbol + "\" "
            }
            else if (type == "atom") {
                atom += "/ \"" + symbol + "\" "
            }
        }
    var extra_text = "\n" + arrow + "\n" + sep + "\n" + conn + "\n" + set + "\n" + form + "\n" + atom_var + "\n" + atom + "\n" 
    parser_text += extra_text
    var temp_parser = peg.generate(parser_text)
    parse_and_use(temp_parser)
    })
}


function parse_and_use(temp_parser) {
    var sequent = $("#Sequent").val().replace(/\(/g, " ( ").replace(/\)/g, " ) ")
    try {
        var sml_seq = temp_parser.parse(sequent).replace(/\\/g, "\\\\")
    }
    catch(error) {
        $("#warning_header").html("Sequent Parsing Error")
        $("#warning_text").html("Sequents must be structurally valid and contain term symbols from the sequent term symbols table.")
        $("#warning").css("visibility", "visible")
        return
    }
    $("#seq").css("display", "none")
    $("#note").css("visibility", "hidden")
    $("#submit").css("visibility", "hidden")
    $("#warning").css("visibility", "hidden")
    $("#export").attr("class", "ui fluid huge icon button green")
    $("#undo").attr("class", "ui fluid huge icon button red")
    parser = temp_parser
    $(".leaf").click(function() {
        leaf_id = this.id.split("_")[1]
        seq_text = $(this).find("script")[0].innerText
        $(this).css('background-color', 'rgb(235, 235, 235)')
        $("#warning").css("visibility", "hidden")
    })
    var stree = "DerTree(\"0\","+sml_seq+",NONE,[])"
    sml_history.push(stree)
    var ltree ="\\deduce[]{"+sequent+"}{0}"
    latex_history.push(ltree)
    var htree = 
        "<div id=\"prooftree_0\" class=\"tree\">"+
            "<div id=\"exp_0\" class=\"sequence\">"+
                "<div id=\"conc_0\" class=\"leaf\">$$"+sequent+"$$</div>"+
            "</div>"+
        "</div>"
    tree_history.push(htree)
}
