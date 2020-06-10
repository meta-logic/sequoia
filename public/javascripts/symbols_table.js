// Sequoia Copyright (C) 2020  Zan Naeem, Abdulrahman Alfayad
// This program comes with ABSOLUTELY NO WARRANTY; for details see LICENSE.
// This is free software, and you are welcome to redistribute it
// under certain conditions; see LICENSE for details.


var s = 0

function showInfo(update, card_id, mongo_id, tbl) {
    $("#modal1").modal({
        onApprove: function() {
            delete_symbol_fromTable(update, card_id, mongo_id, tbl)
        }
    })
    .modal("setting", "closable", false).modal("show")
}


function get_symbols_toTable(tbl) {
    $("#atom_row").html("")
    $("#atom_variable_row").html("")
    $("#formula_variable_row").html("")
    $("#context_variable_row").html("")
    $("#connective_row").html("")
    $("#sequent_sign_row").html("")
    $("#context_separator_row").html("")
    $.get("/sequoia/api/"+tbl+"_symbols/"+calc_id, function(sb, status) {
        var syms = sb.symbols
        for (var i = 0; i < syms.length; i++) {
            var sym = syms[i].symbol
            var typ = syms[i].type
            typ = typ.split(" ").join("_")
            $("#"+typ+"_row").append(
            '<div class="ui animated basic button" onclick="showInfo(false,'+i+',\''+syms[i]._id+'\',\''+tbl+'\')">'+
                '<div class="visible black content">'+
                    '<h4 class="ui basic black header">$$'+sym+'$$</h4>'+
                '</div>'+
                '<div class="hidden content">'+
                    '<i class="red close icon"></i>'+
                '</div>'+
            '</div>')
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, sym])
        }
        s = syms.length
        $("#sym").val("")
        $("#typ").val("")
    })
}


function get_cert_symbols_toTable() {
    var sym_table = $("#cert_table_head")
    $.get("/sequoia/api/cert_symbols/"+calc_id, function(sb, status) {
        var syms = sb.symbols
        for (var i = 0; i < syms.length; i++) {
            var sym = syms[i].symbol
            var row = document.createElement("tr")
            row.setAttribute("id", "cert_row"+i)
            sym_table.after(row, $("#cert_row"+(i-1)))
            row = $("#cert_row"+i)
            row.html(
                '<td id="cert_sym'+i+'" value='+sym+'>$$'+sym+'$$</td>'+
                '<td id="cert_ltx'+i+'" value='+sym+'>'+sym+'</td>'
            )
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, sym])
        }
    })
}


function add_symbol_toTable(tbl) {
    var other = "seq"
    if (tbl == "seq") {
        other = "rule"
    }
    var symb = escape_latex($("#sym").val().trim())
    var typ = escape_latex($("#typ").val().trim())
    if (symb.includes("^") || symb.includes("'") || symb.includes('"') || symb.includes('*')) {
        $("#warning_header").html("Invalid Character")
        $("#warning_text").html("Please refrain from using superscripts when naming variables.")
        $("#warning").css("visibility", "visible")
        return
    }
    $("#warning").css("visibility", "hidden")
    if (symb != "" && typ != "") {
        $.get("/sequoia/api/"+tbl+"_symbols/"+calc_id, function(sb, status) {
            var syms = sb.symbols 
            var ind = -1
            var mg_id = -1
            for (var i = 0; i < syms.length; i++) {
                if (symb == syms[i].symbol) {
                    ind = i
                    mg_id = syms[i]._id
                }
            }
            if (ind != -1) {
                showInfo(true,ind,mg_id,tbl)
            } else {
                $.get("/sequoia/api/"+other+"_symbols/"+calc_id, function(sb, status) {
                    var syms = sb.symbols
                    for (var i = 0; i < syms.length; i++) {
                        if (symb == syms[i].symbol) {
                            if (other = "seq") {
                                var table = "sequent term"
                            } else {
                                var table = "rule"
                            }
                            $("#warning_header").html("Symbol in Use")
                            $("#warning_text").html("This symbol already exists in the "+table+" symbols table. Try using a differnt one.")
                            $("#warning").css("visibility", "visible")
                            return
                        }
                    }
                    $("#warning").css("visibility", "hidden")
                    $.post("/sequoia/api/symbols", {symbol : symb, type : typ, group : tbl, calculus : calc_id}, function(data, status) {
                        typ = typ.split(" ").join("_")
                        $("#"+typ+"_row").append(
                        '<div class="ui animated basic button" onclick="showInfo(false,'+s+',\''+data.symbol._id+'\',\''+tbl+'\')">'+
                            '<div class="visible black content">'+
                                '<h4 class="ui basic black header">$$'+symb+'$$</h4>'+
                            '</div>'+
                            '<div class="hidden content">'+
                                '<i class="red close icon"></i>'+
                            '</div>'+
                        '</div>')
                        s++
                        $("#sym").val("")
                        $("#typ").val("")
                        MathJax.Hub.Queue(["Typeset", MathJax.Hub, symb])
                    })
                })
            }
        })
    }
}


function delete_symbol_fromTable(update, card_id, mongo_id, tbl) {
    $.ajax({
        url: "/sequoia/api/symbols",
        type: "DELETE",
        data : {"id" : mongo_id},
        success: function(result) {
            if (update) {
                $.post("/sequoia/api/symbols", {symbol : $("#sym").val(), type : $("#typ").val(), group : tbl, calculus : calc_id}, function(data, status) {
                    if (tbl == "rule") {
                        fixRules(get_rules_toPage)
                    }
                    get_symbols_toTable(tbl)
                })
            } else {
                if (tbl == "rule") {
                    fixRules(get_rules_toPage)
                }
                get_symbols_toTable(tbl)
            }
            console.log("Symbol sucessfully deleted.")
        },
        error: function(result) {
            console.log("ERROR: Symbol could not be deleted.")
        }
    })
}