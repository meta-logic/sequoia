// Sequoia Copyright (C) 2020  Zan Naeem
// This program comes with ABSOLUTELY NO WARRANTY; for details see LICENSE.
// This is free software, and you are welcome to redistribute it
// under certain conditions; see LICENSE for details.


var parser_copy = pt

function fixRules(callback) {
    var parser_text = parser_copy
    var arrow = "SeqSign = \"NO-ARROW\" "
    var sep = "CtxSep = \"NO-SEP\" "
    var conn = "Conn = \"NO-Conn\" "
    var set = "CtxVar = \"NO-SET\" "
    var form = "FormVar = \"NO-FORM\" "
    var atom_var = "AtomVar = \"NO-ATOMVAR\" "
    var atom = "Atom = \"NO-ATOM\" "
    $.get("/sequoia/api/rule_symbols/"+calc_id, function(sb, status) {
        var syms = sb.symbols
        syms = syms.sort(function(a, b) {
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
    var parser = peg.generate(parser_text)
    $.get("/sequoia/api/rules/"+calc_id, function(rls, status) {
        var rules = rls.rules
            for (var i = 0; i < rules.length; i++) {
                parse_and_fix(parser, rules[i])
            }
        callback()
        })
    })
}


function parse_and_fix(parser, rule) {
    var prem = rule.premises
    var parsed_prem = []
    if (prem[0] != "") {
        for (var i = 0; i < prem.length; i++) {
            try {
                parsed_prem.push(parser.parse(prem[i]))
            }   
            catch(error) {
                deleteRule(-1,rule._id)
                return
            }
        }
    }
    var conc = rule.conclusion
    try {
        var conc_final = parser.parse(conc)
    }   
    catch(error) {
        deleteRule(-1,rule._id)
        return
    }
    $.ajax({
        url: "/sequoia/api/rule",
        type: "PUT",
        data : {id : rule._id, rule : rule.rule, 
            conclusion : conc, premises : JSON.stringify(prem), parsed_conc : conc_final, 
            parsed_prem : JSON.stringify(parsed_prem), calculus : calc_id, 
            connective : rule.connective, side : rule.side, type : rule.type, cutvar : rule.cutvar, function(data) {}}})
}