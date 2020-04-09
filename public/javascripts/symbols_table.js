// Sequoia Copyright (C) 2020  Zan Naeem, Abdulrahman Alfayad
// This program comes with ABSOLUTELY NO WARRANTY; for details see LICENSE.
// This is free software, and you are welcome to redistribute it
// under certain conditions; see LICENSE for details.


var s = 0

function showInfo(update, card_id, mongo_id, tbl) {
    $("#modal1").modal({
        onApprove: function(){
            delete_symbol_fromTable(update, card_id, mongo_id, tbl)
        }
    })
    .modal("setting", "closable", false).modal("show")
}


function get_symbols_toTable(tbl) {
    var sym_table = $("#table_head")
    for (i = 0; i < s; i++) {
        var entry = $("#row"+i)
        if (entry != null) {
            entry.remove()
        }
    }
    $.get("/sequoia/api/"+tbl+"_symbols/"+$("#calc_id").text(), function(sb, status) {
        var syms = sb.symbols
        for (var i = 0; i < syms.length; i++) {
            var sym = syms[i].symbol
            var typ = syms[i].type
            var row = document.createElement("tr")
            row.setAttribute("id", "row"+i)
            sym_table.after(row, $("#row"+(i-1)))
            row = $("#row"+i)
            var button_action = 'showInfo(false,'+i+',\''+syms[i]._id+'\',\''+tbl+'\')'
            row.html(
                '<td id="sym'+i+'" value='+sym+'>$$'+sym+'$$</td>'+
                '<td id ="typ'+i+'" value='+typ+'>'+typ+
                    '<button id="deleteS_'+i+'" onclick="'+button_action+'" class="ui right floated circular red icon button">'+
                        '<i class="icon close"></i>'+
                    '</button>'+
                '</td>'
            )
            MathJax.Hub.Queue(["Typeset",MathJax.Hub,sym])
        }
        s = syms.length
        $("#sym").val("")
        $("#typ").val("")
    })
}


function add_symbol_toTable(tbl) {
    var other = "seq"
    if (tbl == "seq") {
        other = "rule"
    }
    var sym_table = $("#table_head")
    var symb = $("#sym").val().trim()
    var typ = $("#typ").val()
    calc_id = $("#calc_id").text()
    if (symb.includes("^") || symb.includes("'") || symb.includes('"') || symb.includes('*')) {
        $("#warning_header").html("Invalid Character")
        $("#warning_text").html("Please refrain from using superscripts when naming variables.")
        $("#warning").css("visibility","visible")
        return
    }
    $("#warning").css("visibility","hidden")
    if (symb.replace(/\s/g, '').length > 0 && typ != "") {
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
                    var exists = false
                    for (var i = 0; i < syms.length; i++) {
                        if (symb == syms[i].symbol) {
                            if (other = "seq") {
                                var table = "sequent term"
                            } else {
                                var table = "rule"
                            }
                            $("#warning_header").html("Symbol in Use")
                            $("#warning_text").html("This symbol already exists in the "+table+" symbols table. Try using a differnt one.")
                            $("#warning").css("visibility","visible")
                            return
                        }
                    }
                    $("#warning").css("visibility","hidden")
                    $.post("/sequoia/api/symbols", {symbol : symb, type : typ, group : tbl, calculus : calc_id}, 
                    function(data, status) {
                        var row = document.createElement("tr")
                        row.setAttribute("id", "row"+s)
                        sym_table.after(row, $("#row"+(s-1)))
                        row = $("#row"+s)
                        var button_action = 'showInfo(false,'+s+',\''+data.symbol._id+'\',\''+tbl+'\')'
                        row.html(
                            '<td id="sym'+s+'" value='+symb+'>$$'+symb+'$$</td>'+
                            '<td id ="typ'+s+'" value='+typ+'>'+typ+
                                '<button id="deleteS_'+s+'" onclick="'+button_action+'" class="ui right floated circular red icon button">'+
                                    '<i class="icon close"></i>'+
                                '</button>'+
                            '</td>'
                        )
                        s++
                        $("#sym").val("")
                        $("#typ").val("")
                        MathJax.Hub.Queue(["Typeset",MathJax.Hub,symb])
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
                $.post("/sequoia/api/symbols", {symbol : $("#sym").val(), type : $("#typ").val(), group : tbl, calculus : $("#calc_id").text()}, 
                function(data, status) {
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