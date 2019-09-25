var parser_copy = pt

function fixRules() {
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
        $.get("/api/get-rules", function (rls, status) {
            rules = rls
            for (var i = 0; i < rules.length; i++) {
                parse_and_fix(parser, rules[i])
            }
        })
    })
}


function parse_and_fix(parser, rule) {
    var prem = rule.premises
    var parsed_prem = []
    console.log(rule.conclusion)
    if (prem[0] != ""){
        for (var i = 0; i < prem.length; i++) {
            try {
                parsed_prem.push(parser.parse(prem[i]))
            }   
            catch(error) {
                deleteRule (rule._id)
                return
            }
        }
    }
    var conc = rule.conclusion
    try {
        var conc_final = parser.parse(conc)
    }   
    catch(error) {
        deleteRule (rule._id)
        return
    }
    $.ajax({
        url: "/api/rule",
        type: "PUT",
        data : { id : rule._id , rule : rule.rule, 
            conclusion : conc, premises : JSON.stringify(prem), parsed_conc : conc_final, 
            parsed_prem : JSON.stringify(parsed_prem)},
        success : function(result) {get_rules_toPage()}})
}