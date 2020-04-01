var parser_copy = pt
var formula_parser_copy = fpt

function updateParser(new_symbols, callback) {
    var parser_text = parser_copy
    var formula_parser_text = formula_parser_copy
    var arrow = "SeqSign = \"NO-ARROW\" "
    var sep = "CtxSep = \"NO-SEP\" "
    var conn = "Conn = \"NO-Conn\" "
    var set = "CtxVar = \"NO-SET\" "
    var form = "FormVar = \"NO-FORM\" "
    var atom_var = "AtomVar = \"NO-ATOMVAR\" "
    var atom = "Atom = \"NO-ATOM\" "
    var calc_id = $("#calc_id").text()
    var context_variables = []
    for (var symbol in new_symbols) {
        if (symbol.includes("\\")) {
            symbol = "\\" + symbol
        }
        context_variables.push(symbol)
    }
    $.get("/sequoia/api/cert_symbols/"+calc_id, function(sb, status) {
        var syms = sb.symbols
        syms = syms.sort(function(a, b){
            return b.symbol.length - a.symbol.length
        })
        for (var i = 0; i < syms.length; i++) {
            var symbol = syms[i].symbol
            var type = syms[i].type
            if (symbol.includes("\\")) {
                symbol = "\\" + symbol
            }
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
                context_variables.push(symbol)
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

        context_variables = context_variables.sort(function(a, b){
            return b.length - a.length
        })
        for (var i = 0; i < context_variables.length; i ++) {
            set += "/ \"" + context_variables[i] + "\" "
        }

    var extra_text = "\n" + arrow + "\n" + sep + "\n" + conn + "\n" + set + "\n" + form + "\n" + atom_var + "\n" + atom + "\n" 
    parser_text += extra_text
    parser = peg.generate(parser_text)
    formula_parser_text += extra_text
    formula_parser = peg.generate(formula_parser_text)
    callback()
    })
}

