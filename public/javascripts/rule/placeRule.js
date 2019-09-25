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

    $.get("/api/get-symbols", function(sb, status) {
        syms = sb
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
    var warning_text = "<div id=\"parse warning\"><div class=\"ui red negative message\">"+
    "<div class=\"header\">Unrecognized Symbols</div>"+
    "<p>All symbols used in calculus should be inputted to table</p></div>"

    var prem = []
    var parsed_prem = []
    var rule = document.getElementById("rule_name").value
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
                var warning = document.getElementById("warning")
                warning.innerHTML = warning_text
                return
            }
        }
    }

    var conc = document.getElementById("Conclusion").value
    try {
        var conc_final = parser.parse(conc)
    }   
    catch(error) {
        var warning = document.getElementById("warning")
        warning.innerHTML = warning_text
        return
    }

    if (opt == "Add") {
        $.post("/api/rule", {rule : rule, conclusion : conc, premises : JSON.stringify(prem),
            parsed_conc : conc_final ,parsed_prem : JSON.stringify(parsed_prem)})
    }
    else if (opt == "Update") {
        $.ajax({
            url: "/api/rule",
            type: "PUT",
            data : { id : document.getElementById("id").innerHTML , rule : rule, 
                conclusion : conc, premises : JSON.stringify(prem), parsed_conc : conc_final, 
                parsed_prem : JSON.stringify(parsed_prem)}})
    }
    window.location.href = "/"
}
