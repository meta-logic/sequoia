var c = 0

function showInfo ( modal_num) {
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

function get_calculi_toPage() {
    var calculi_container = document.getElementById("calculi")
    for (i = 0; i < c; i++) {
        entry = document.getElementById("calc_card"+i)
        if (entry != null) {
            entry.remove()
        }
    }
    var user_id = document.getElementById("user_id").innerHTML
    $.get("/api/calculi/"+user_id, function (calcs, status) {
        var calculi = calcs.calculi
        for (var i = 0; i < calculi.length; i++) {
            calculi_container.innerHTML +=
            '<div id="calc_card'+i+'" class="card">'
                +'<a class="content" href=calculus/'+calculi[i]._id+'>'
                    +'<div class="header">'+calculi[i].title+'</div>'
                    +'<div class="description">'+calculi[i].description+'</div>'
                +'</a>'
                +'<div class="ui red bottom attached button" onClick=deleteCalculus("'+calculi[i]._id+'")>'
                    +'<i class="close icon"></i>Delete'
                +'</div>'
            +'</div>'
            }
        MathJax.Hub.Queue(["Typeset",MathJax.Hub,calculi_container])
        c = calculi.length
    })
}

function addCalculus() {
    var title = document.getElementById("title").value
    var description = document.getElementById("description").value
    var user_id = document.getElementById("user_id").innerHTML
    if (title != "" && description != "") {
        $.post("/api/calculus", {title : title, description : description, user : user_id}, function(data, status){
            document.getElementById("title").value = ""
            document.getElementById("description").value = ""
            get_calculi_toPage()
        }
    )}
}

function addSomeCalculus(sample) {
    var title = document.getElementById("title").value
    var description = document.getElementById("description").value
    var user_id = document.getElementById("user_id").innerHTML
    var the_symbols = []
    var the_rules = []
    $.post("/api/calculus", {title : "Sample Calculus", description : "This is a sample calculus with BLAH BLAH BLAH", user : user_id}, function(data, status){
        the_symbols = [ {symbol : "A", type: "formula variable", group : "rule", calculus : data.calculus._id},
                        {symbol : "B", type: "formula variable", group : "rule", calculus : data.calculus._id},
                        {symbol : "C", type: "formula variable", group : "rule", calculus : data.calculus._id},
                        {symbol : "\\Gamma", type: "context variable", group : "rule", calculus : data.calculus._id},
                        {symbol : "\\Gamma_1", type: "context variable", group : "rule", calculus : data.calculus._id},
                        {symbol : "\\Gamma_2", type: "context variable", group : "rule", calculus : data.calculus._id},
                        {symbol : "\\vdash", type: "sequent sign", group : "rule", calculus : data.calculus._id},
                        {symbol : "\\wedge", type: "connective", group : "rule", calculus : data.calculus._id},
                        {symbol : "\\vee", type: "connective", group : "rule", calculus : data.calculus._id},
                        {symbol : "\\supset", type: "connective", group : "rule", calculus : data.calculus._id}
                    ]
        the_rules = [   {rule : "init", conclusion : '\\Gamma, A \\vdash A', 
                            premises : JSON.stringify([]),
                            parsed_conc : 'Seq (Single (Ctx ([CtxVar ("\\Gamma")], [FormVar ("A")])), Con ("\\vdash"), Single (Ctx ([], [FormVar ("A")])))',
                            parsed_prem : JSON.stringify([]), 
                            calculus : data.calculus._id, connective : "", side : "None"},
                        {rule : "\\wedge_L", conclusion : '\\Gamma, A \\wedge B \\vdash C', 
                            premises : JSON.stringify(['\\Gamma, A, B \\vdash C']),
                            parsed_conc : 'Seq (Single (Ctx ([CtxVar ("\\Gamma")], [Form (Con ("\\wedge"), [FormVar ("A"),FormVar ("B")])])), Con ("\\vdash"), Single (Ctx ([], [FormVar ("C")])))',
                            parsed_prem : JSON.stringify(['Seq (Single (Ctx ([CtxVar ("\\Gamma")], [FormVar ("A"), FormVar ("B")])), Con ("\\vdash"), Single (Ctx ([], [FormVar ("C")])))']), 
                            calculus : data.calculus._id, connective : "\\wedge", side : "Left"},
                        {rule : "\\wedge_R", conclusion : '\\Gamma_1, \\Gamma_2 \\vdash A \\wedge B', 
                            premises : JSON.stringify(['\\Gamma_1  \\vdash A', '\\Gamma_2  \\vdash B']),
                            parsed_conc : 'Seq (Single (Ctx ([CtxVar ("\\Gamma_1"), CtxVar ("\\Gamma_2")], [])), Con ("\\vdash"), Single (Ctx ([], [Form (Con ("\\wedge"), [FormVar ("A"),FormVar ("B")])])))',
                            parsed_prem : JSON.stringify(['Seq (Single (Ctx ([CtxVar ("\\Gamma_1")], [])), Con ("\\vdash"), Single (Ctx ([], [FormVar ("A")])))', 'Seq (Single (Ctx ([CtxVar ("\\Gamma_2")], [])), Con ("\\vdash"), Single (Ctx ([], [FormVar ("B")])))']), 
                            calculus : data.calculus._id, connective : "\\wedge", side : "Right"},
                        {rule : "\\vee_L", conclusion : '\\Gamma_1, \\Gamma_2, A \\vee B \\vdash C', 
                            premises : JSON.stringify(['\\Gamma_1, A \\vdash C', '\\Gamma_2, B \\vdash C']),
                            parsed_conc : 'Seq (Single (Ctx ([CtxVar ("\\Gamma_1"), CtxVar ("\\Gamma_2")], [Form (Con ("\\vee"), [FormVar ("A"),FormVar ("B")])])), Con ("\\vdash"), Single (Ctx ([], [FormVar ("C")])))',
                            parsed_prem : JSON.stringify(['Seq (Single (Ctx ([CtxVar ("\\Gamma_1")], [FormVar ("A")])), Con ("\\vdash"), Single (Ctx ([], [FormVar ("C")])))', 'Seq (Single (Ctx ([CtxVar ("\\Gamma_2")], [FormVar ("B")])), Con ("\\vdash"), Single (Ctx ([], [FormVar ("C")])))']), 
                            calculus : data.calculus._id, connective : "\\vee", side : "Left"},
                        {rule : "\\vee_{R_1}", conclusion : '\\Gamma \\vdash A \\vee B', 
                            premises : JSON.stringify(['\\Gamma  \\vdash A']),
                            parsed_conc : 'Seq (Single (Ctx ([CtxVar ("\\Gamma")], [])), Con ("\\vdash"), Single (Ctx ([], [Form (Con ("\\vee"), [FormVar ("A"),FormVar ("B")])])))',
                            parsed_prem : JSON.stringify(['Seq (Single (Ctx ([CtxVar ("\\Gamma")], [])), Con ("\\vdash"), Single (Ctx ([], [FormVar ("A")])))']), 
                            calculus : data.calculus._id, connective : "\\vee", side : "Right"},
                        {rule : "\\vee_{R_2}", conclusion : '\\Gamma \\vdash A \\vee B', 
                            premises : JSON.stringify(['\\Gamma  \\vdash B']),
                            parsed_conc : 'Seq (Single (Ctx ([CtxVar ("\\Gamma")], [])), Con ("\\vdash"), Single (Ctx ([], [Form (Con ("\\vee"), [FormVar ("A"),FormVar ("B")])])))',
                            parsed_prem : JSON.stringify(['Seq (Single (Ctx ([CtxVar ("\\Gamma")], [])), Con ("\\vdash"), Single (Ctx ([], [FormVar ("B")])))']), 
                            calculus : data.calculus._id, connective : "\\vee", side : "Right"},
                        {rule : "\\supset_L", conclusion : '\\Gamma_1, \\Gamma_2, A \\supset B \\vdash C', 
                            premises : JSON.stringify(['\\Gamma_1 \\vdash A','\\Gamma_2, B \\vdash C']),
                            parsed_conc : 'Seq (Single (Ctx ([CtxVar ("\\Gamma_1"), CtxVar ("\\Gamma_2")], [Form (Con ("\\supset"), [FormVar ("A"),FormVar ("B")])])), Con ("\\vdash"), Single (Ctx ([], [FormVar ("C")])))',
                            parsed_prem : JSON.stringify(['Seq (Single (Ctx ([CtxVar ("\\Gamma_1")], [])), Con ("\\vdash"), Single (Ctx ([], [FormVar ("A")])))', 'Seq (Single (Ctx ([CtxVar ("\\Gamma_2")], [FormVar ("B")])), Con ("\\vdash"), Single (Ctx ([], [FormVar ("C")])))']), 
                            calculus : data.calculus._id, connective : "\\supset", side : "Left"},
                        {rule : "\\supset_R", conclusion : '\\Gamma \\vdash A \\supset B', 
                            premises : JSON.stringify(['\\Gamma, A \\vdash B']),
                            parsed_conc : 'Seq (Single (Ctx ([CtxVar ("\\Gamma")], [])), Con ("\\vdash"), Single (Ctx ([], [Form (Con ("\\supset"), [FormVar ("A"),FormVar ("B")])])))',
                            parsed_prem : JSON.stringify(['Seq (Single (Ctx ([CtxVar ("\\Gamma")], [FormVar ("A")])), Con ("\\vdash"), Single (Ctx ([], [FormVar ("B")])))']), 
                            calculus : data.calculus._id, connective : "\\supset", side : "Right"}
                    ]
        $.post("/api/symbols_init", {items : JSON.stringify(the_symbols)}, function(data, status){
            $.post("/api/rules_init", {items : JSON.stringify(the_rules)}, function(data, status){
                document.getElementById("title").value = ""
                document.getElementById("description").value = ""
                get_calculi_toPage()
            })
        })
    })
}

function deleteCalculus(id) {
    $('#modal1').modal({
        onApprove: function(){
            $.ajax({
                url: "/api/calculus",
                type: "DELETE",
                data : { "id" : id },
                success: function(result) {
                    get_calculi_toPage()
                    console.log("Calculus sucessfully deleted.")
                },
                error: function(result) {
                    console.log("ERROR: Calculus could not be deleted.")
                }
            })
        }
    })
    .modal('setting', 'closable', false)
    .modal('show')

    
}
