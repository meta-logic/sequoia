var parser_copy = pt
var parser = ""

function clear() {
    document.getElementById("seq").remove()
    document.getElementById("apply").remove()
    document.getElementById("table").remove()
    document.getElementById("first-modal").remove()
    document.getElementById("warning").innerHTML =""
}

function useSequent() {
    var parser_text = parser_copy
    var arrow = "SeqSign = \"NO-ARROW\" "
    var sep = "CtxSep = \"NO-SEP\" "
    var conn = "Conn = \"NO-Conn\" "
    var set = "CtxVar = \"NO-SET\" "
    var form = "FormVar = \"NO-FORM\" "
    var atom_var = "AtomVar = \"NO-ATOMVAR\" "
    var atom = "Atom = \"NO-ATOM\" "

    $.get("/api/get-symbols", function(sb, status) {
        syms = sb
        for (var i = 0; i < syms.length; i++) {
            var symbol = syms[i].symbol
            var type = syms[i].type
            if (symbol.includes("\\")) {
                symbol = "\\" + symbol
            }
            if (type == "primary separator") {
                arrow += "/ \"" + symbol + "\" "
            }
            else if (type == "separator") {
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
    extra_text = "\n" + arrow + "\n" + sep + "\n" + conn + "\n" + set + "\n" + form + "\n" + atom_var + "\n" + atom + "\n" 
    parser_text += extra_text
    var temp_parser = peg.generate(parser_text)
    parse_and_use(temp_parser)
    })
}


function parse_and_use(temp_parser) {
    var warning_text = "<div id=\"parse warning\"><div class=\"ui red negative message\">"+
    "<div class=\"header\">Unrecognized Symbols</div>"+
    "<p>All symbols used in calculus should be inputted to table</p></div>"

    var sequent = document.getElementById("Sequent").value.replace(/\(/g, "").replace(/\)/g, "")
    try {
        var sequent_final = temp_parser.parse(sequent).replace(/\\/g, "\\\\")
        leaf_id = 0
        seq_text = sequent
    }   
    catch(error) {
        var warning = document.getElementById("warning")
        warning.innerHTML = warning_text
        return
    }
    clear()
    parser = temp_parser
}
