// Sequoia Copyright (C) 2020  Zan Naeem, Abdulrahman Alfayad
// This program comes with ABSOLUTELY NO WARRANTY; for details see LICENSE.
// This is free software, and you are welcome to redistribute it
// under certain conditions; see LICENSE for details.


var parser_copy = pt

function cutSelect(opt, conc, prem, parsed_conc, parsed_prem, calc_id) {
    $('#modal3').modal({
        onApprove: function () {
            var v = $("#var").val()
            if (v == "") {
                return
            } else {
                $("#var").val("")
                sendRule(opt, "FormVar(\""+v+"\")", conc, prem, parsed_conc, parsed_prem, calc_id)
            }
        }
    })
    .modal('setting', 'closable', false).modal('show')
}


function sendRule(opt, cutvar, conc, prem, parsed_conc, parsed_prem, calc_id) {
    if (opt == "Add") {
        $.post("/sequoia/api/rule", {rule : rule_name, conclusion : conc, premises : JSON.stringify(prem),
            parsed_conc : parsed_conc, parsed_prem : JSON.stringify(parsed_prem) , calculus : calc_id,
            connective : rule_connective, side : rule_side, type : rule_type, cutvar : cutvar})
    } else if (opt == "Update") {
        var rule_id = $("#rule_id").text()
        $.get("/sequoia/api/rules/"+calc_id, function (rls, status) {
            var rules = rls.rules
            var still_exists = false
            for (var i = 0; i < rules.length; i++) {
                if (rule_id == rules[i]._id) {
                    still_exists = true
                }
            }
            if (!still_exists) {
                $.post("/sequoia/api/rule", {rule : rule_name, conclusion : conc, premises : JSON.stringify(prem),
                    parsed_conc : parsed_conc, parsed_prem : JSON.stringify(parsed_prem) , calculus : calc_id, 
                    connective : rule_connective, side : rule_side, type : rule_type, cutvar : cutvar})
            } else {
                $.ajax({
                    url: "/sequoia/api/rule",
                    type: "PUT",
                    data : { id : rule_id, rule : rule_name, 
                        conclusion : conc, premises : JSON.stringify(prem), parsed_conc : parsed_conc, 
                        parsed_prem : JSON.stringify(parsed_prem), calculus : calc_id, 
                        connective : rule_connective, side : rule_side, type : rule_type, cutvar : cutvar}, function(data) {}})
            }
        })
    }
    window.location.href = "/sequoia/calculus/"+calc_id
}


function placeRule(opt) {
    var parser_text = parser_copy
    var arrow = "SeqSign = \"NO-ARROW\" "
    var sep = "CtxSep = \"NO-SEP\" "
    var conn = "Conn = \"NO-Conn\" "
    var set = "CtxVar = \"NO-SET\" "
    var form = "FormVar = \"NO-FORM\" "
    var atom_var = "AtomVar = \"NO-ATOMVAR\" "
    var atom = "Atom = \"NO-ATOM\" "
    var calc_id = $("#calc_id").text()
    $.get("/sequoia/api/rule_symbols/"+calc_id, function(sb, status) {
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
    var extra_text = "\n" + arrow + "\n" + sep + "\n" + conn + "\n" + set + "\n" + form + "\n" + atom_var + "\n" + atom + "\n" 
    parser_text += extra_text
    var parser = peg.generate(parser_text)
    parse_and_check(parser, opt)
    })
}


function parse_and_check(parser, opt) {
    var calc_id = $("#calc_id").text()
    var prem = rule_premises
    var parsed_prem = []
    if (prem[0] != "" && prem[0].replace(/\s\s+/g, " ") ==  " ") {
        prem[0] = ""
    }
    if (prem[0] != ""){
        for (var i = 0; i < prem.length; i++) {
            try {
                parsed_prem.push(parser.parse(prem[i]))
            }
            catch(error) {
                $("#warning_header").html("Rule Parsing Error")
                $("#warning_text").html("Rule sequents must be structurally valid and contain symbols from the rule symbols table.")
                $("#warning").css("visibility","visible")
                return
            }
        }
    }
    var conc = rule_conclusion
    try {
        var parsed_conc = parser.parse(conc)
    }
    catch(error) {
        $("#warning_header").html("Rule Parsing Error")
        $("#warning_text").html("Rule sequents must be structurally valid and contain symbols from the rule symbols table.")
        $("#warning").css("visibility","visible")
        return
    }
    if (rule_type == "Cut") {
        cutSelect(opt, conc, prem, parsed_conc, parsed_prem, calc_id)
    } else {
        sendRule(opt, "NONE", conc, prem, parsed_conc, parsed_prem, calc_id)
    }
}
