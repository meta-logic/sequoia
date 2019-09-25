var s = 0

function showInfo (del, id, tbl, modal_num) {
    $('#modal'+modal_num).modal({
        onApprove: function(){
            if (del == true) {
                delete_symbol_fromTable(id, tbl)
            } else {
                update_symbol_inTable(id, tbl)
            }
        }
    })
    .modal('setting', 'closable', false)
    .modal('show')
}


function get_symbols_toTable(tbl) {
    var req = "/api/get-symbols"
    var other
    if (tbl == "seq")
        {req = "/api/get-seq_symbols"}
    $.get(req, function(sb, status) {
        s = 0
        syms = sb
        for (var i = 0; i < syms.length; i++) {
            symb = syms[i].symbol
            typ = syms[i].type
            new_id = "sym" + i
            select_id = "typ" + i
            var row = document.createElement("tr")
            row.setAttribute("id", "row"+i);
            if (tbl == "rule") {
                button_action = "showInfo(true,"+i+",\'rule\',1)"
            } else {
                button_action = "delete_symbol_fromTable("+i+",\'seq\')"
            } 
            row.innerHTML = "<td id ="+new_id+" value = "+symb+"><type=\"text\">$$"+symb+"$$</td>"
            +"<td id ="+select_id+"><type=\"text\">"+typ
            +"<button onclick=\""+button_action+"\" class=\"ui right floated circular red icon button\"><i class=\"icon close\"></i></button></td>"
            document.getElementById("table_head").insertBefore(row, document.getElementById("row"+(i-1)))
            MathJax.Hub.Queue(["Typeset",MathJax.Hub,symb])
            s++
        }
    })
}


function add_symbol_toTable(tbl) {
    var req = "/api/get-symbols"
    var other_req = "/api/get-seq_symbols"
    if (tbl == "seq") {
        req = "/api/get-seq_symbols"
        other_req = "/api/get-symbols"
    }
    symb = document.getElementById("sym").value
    typ = document.getElementById("select-sym").value
    
    if (symb.replace(/\s/g, '').length > 0 && typ != "") {
        $.get(req, function(sb, status) {
            syms = sb; ind = -1
            for (var i = 0; i < syms.length; i++) {
                if (symb == syms[i].symbol) {
                    ind = i
                }
            }
            if (ind != -1 && tbl == "rule") {
                showInfo(false,ind,tbl,1)
            } else if (ind != -1 && tbl == "seq"){
                update_symbol_inTable(ind, tbl)
            } else {
                $.get(other_req, function(sb, status) {
                    syms = sb; ind = -1
                    for (var i = 0; i < syms.length; i++) {
                        if (symb == syms[i].symbol) {
                            ind = i
                        }
                    }
                    if (ind != -1) {
                        showInfo(false,ind,tbl,2)
                    }
                    else {
                        $.post("/api/symbols", {symbol : symb, type : typ, group : tbl}, function(data, status) {
                            for (i = 0; i < s; i++) {
                                document.getElementById("table_head").removeChild(document.getElementById("row"+i))
                            }
                            get_symbols_toTable(tbl)
                        })
                    }
                })
            }
        })
    }
    document.getElementById("sym").value = ""
    document.getElementById("select-sym").value = ""
}


function delete_symbol_fromTable (val, tbl) {
    var symbol = document.getElementById("sym"+val).getAttribute('value')
    $.ajax({
        url: "/api/symbols",
        type: "DELETE",
        data : {"symbol" : symbol},
        success: function(result) {
            fixRules()
            for (i = 0; i < s; i++) {
                document.getElementById("table_head").removeChild(document.getElementById("row"+i))
            }
            for (i = 0; i < r; i++) {
                document.getElementById("rule_card"+i).remove()
            }
            get_rules_toPage()
            get_symbols_toTable(tbl)
            console.log("Symbol sucessfully deleted.")
        },
        error: function(result) {
            console.log("ERROR: Symbol could not be deleted.")
        }
    })
}


function update_symbol_inTable (val, tbl) {
    var symbol = document.getElementById("sym"+val).getAttribute('value')
    $.ajax({
        url: "/api/symbols",
        type: "DELETE",
        data : {"symbol" : symbol},
        success: function(result) {
            $.post("/api/symbols", {symbol : symb, type : typ, group : tbl}, function(data, status) {
                fixRules()
                for (i = 0; i < s; i++) {
                    document.getElementById("table_head").removeChild(document.getElementById("row"+i))
                }
                for (i = 0; i < r; i++) {
                    document.getElementById("rule_card"+i).remove()
                }
                get_rules_toPage()
                get_symbols_toTable(tbl)
            })
            console.log("Symbol successfully updated.")
        },
        error: function(result) {
            console.log("ERROR: Symbol could not be updated.")
        }
    })
}