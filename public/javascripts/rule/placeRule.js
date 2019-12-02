var parser_copy = pt

function placeRule(opt) {
    var parser_text = parser_copy
    var arrow = "SeqSign = \"NO-ARROW\" "
    var sep = "CtxSep = \"NO-SEP\" "
    var conn = "Conn = \"NO-Conn\" "
    var set = "CtxVar = \"NO-SET\" "
    var form = "FormVar = \"NO-FORM\" "
    var atom_var = "AtomVar = \"NO-ATOMVAR\" "
    var atom = "Atom = \"NO-ATOM\" "
    var calc_id = document.getElementById("calc_id").innerHTML

    $.get("/api/rule_symbols/"+calc_id, function(sb, status) {
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
    var parser = peg.generate(parser_text)
    parse_and_place(parser, opt)
    })
}


function parse_and_place(parser, opt) {
    var warning_text_symb = "<div id=\"parse warning\"><div class=\"ui red negative message\">"+
    "<div class=\"header\">Unrecognized Symbols</div>"+
    "<p>All symbols used in calculus should be inputted to table</p></div>"
    var calc_id = document.getElementById("calc_id").innerHTML
    var prem = []
    var parsed_prem = []
    var rule_name = document.getElementById("rule_name").value
    var connective = document.getElementById("connective").value
    var side = document.getElementById("side").value
    var warning = document.getElementById("warning")

    prem.push(document.getElementById("i0").value)
    for (var i = 1; i <= v; i++) {
        var p = document.getElementById("i" + i.toString()).value
        if (p.trim() != ""){
            prem.push(p)
        }
        
    }

    if (prem[0] != "" && prem[0][0].replace(/\s\s+/g, " ") == " ") {
        prem[0] = ""
    }
    if (prem[0] != ""){
        for (var i = 0; i < prem.length; i++) {
            try {
                parsed_prem.push(parser.parse(prem[i]))
            }   
            catch(error) {
                warning.innerHTML = warning_text_symb
                return
            }
        }
    }

    var conc = document.getElementById("Conclusion").value
    try {
        var conc_final = parser.parse(conc)
    }   
    catch(error) {
        warning.innerHTML = warning_text
        return
    }

    if (document.getElementById("parse warning") != null){
        document.getElementById("parse warning").remove()
    }

    if (opt == "Add") {
        $.post("/api/rule", {rule : rule_name, conclusion : conc, premises : JSON.stringify(prem),
            parsed_conc : conc_final ,parsed_prem : JSON.stringify(parsed_prem) , calculus : calc_id,
            connective : connective, side : side})
    } else if (opt == "Update") {
        var rule_id = document.getElementById("rule_id").innerHTML
        $.get("/api/rules/"+calc_id, function (rls, status) {
            var rules = rls.rules
            var still_exists = false
            for (var i = 0; i < rules.length; i++) {
                still_exists = rule_id == rules[i]._id
            }
            if (!still_exists) {
                $.post("/api/rule", {rule : rule_name, conclusion : conc, premises : JSON.stringify(prem),
                    parsed_conc : conc_final ,parsed_prem : JSON.stringify(parsed_prem) , calculus : calc_id, 
                    connective : connective, side : side})
            } else {
                $.ajax({
                    url: "/api/rule",
                    type: "PUT",
                    data : { id : rule_id, rule : rule_name, 
                        conclusion : conc, premises : JSON.stringify(prem), parsed_conc : conc_final, 
                        parsed_prem : JSON.stringify(parsed_prem), calculus : calc_id, 
                        connective : connective, side : side}, function(data) {}})
            }
        })
    }
    window.location.href = "/calculus/"+calc_id
}
