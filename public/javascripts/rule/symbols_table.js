var s = 0

function showInfo (del, id) {
    $('.ui.modal').modal({
        onApprove: function(){
            if (del == true) {
                delete_symbol_fromTable(id)
            }  else {
                update_symbol_inTable(id)
            }
        }
    })
    .modal('setting', 'closable', false)
    .modal('show')
}


function get_symbols_toTable() {
    $.get("/api/get-symbols", function(sb, status) {
        s = 0
        syms = sb
        for (var i = 0; i < syms.length; i++) {
            symb = syms[i].symbol
            typ = syms[i].type
            new_id = "sym" + i
            select_id = "typ" + i
            var row = document.createElement("tr")
            row.setAttribute("id", "row"+i);
            row.innerHTML = "<td id ="+new_id+" value = "+symb+"><type=\"text\">$$"+symb+"$$</td>"
            +"<td id ="+select_id+"><type=\"text\">"+typ
            +"<button onclick=\"showInfo(true,"+i+")\" class=\"ui right floated circular red icon button\"><i class=\"icon close\"></i></button></td>"
            document.getElementById("table_head").insertBefore(row, document.getElementById("row"+(i-1)))
            MathJax.Hub.Queue(["Typeset",MathJax.Hub,symb])
            s++
        }
    })
}


function add_symbol_toTable() {
    symb = document.getElementById("sym").value
    typ = document.getElementById("select-sym").value
    if (symb.replace(/\s/g, '').length > 0 && typ != "") {


        $.get("/api/get-symbols", function(sb, status) {
            syms = sb; ind = -1
            for (var i = 0; i < syms.length; i++) {
                if (symb == syms[i].symbol) {
                    ind = i
                }
            }
            if (ind != -1) {
                showInfo(false,ind)
                // update_symbol_inTable(ind)
            }
            else {
                $.post("/api/symbols", {symbol : symb, type : typ}, function(data, status) {
                    for (i = 0; i < s; i++) {
                        document.getElementById("table_head").removeChild(document.getElementById("row"+i))
                    }
                    get_symbols_toTable()
                })
            }
        })


    }
    document.getElementById("sym").value = ""
    document.getElementById("select-sym").value = ""
}


function delete_symbol_fromTable (val) {
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
            get_symbols_toTable()
            console.log("Symbol sucessfully deleted.")
        },
        error: function(result) {
            console.log("ERROR: Symbol could not be deleted.")
        }
    })
}


function update_symbol_inTable (val) {
    var symbol = document.getElementById("sym"+val).getAttribute('value')
    $.ajax({
        url: "/api/symbols",
        type: "DELETE",
        data : {"symbol" : symbol},
        success: function(result) {
            $.post("/api/symbols", {symbol : symb, type : typ}, function(data, status) {
                fixRules()
                for (i = 0; i < s; i++) {
                    document.getElementById("table_head").removeChild(document.getElementById("row"+i))
                }
                for (i = 0; i < r; i++) {
                    document.getElementById("rule_card"+i).remove()
                }
                get_rules_toPage()
                get_symbols_toTable()
            })
            console.log("Symbol successfully updated.")
        },
        error: function(result) {
            console.log("ERROR: Symbol could not be updated.")
        }
    })
}