var constraint_history = []
var rng_index = "0"
var fresh_symbols = {}
var cut_var = ""
var cut_form = ""
var latex_tree = []

function find_tree(id) {
    var tree = latex_tree[0]
    for(var i = 1; i < id.length; i++) {
        tree = tree["premises"][parseInt(id[i])] 
    }
    return tree
}


function insert_premises(id, rulename, prems) {
    var latex_prems = []
    for(var i = 0; i < prems.length; i++) {
        latex_prems.push({"conclusion" : prems[i], "rulename" : "", "premises" : []})
    }
    find_tree(id)["rulename"] = rulename
    find_tree(id)["premises"] = latex_prems
}


function remove_premises(id) {
    find_tree(id)["rulename"] = ""
    find_tree(id)["premises"] = []
}


function export_to_latex(tree) {
    var premises = tree["premises"]
    var rulename = tree["rulename"]
    var conclusion = tree["conclusion"]
    if (rulename == "") {
        return conclusion
    } else {
        var latex_prems = []
        for(var i = 0; i < premises.length; i++) {
            latex_prems.push(export_to_latex(premises[i]))
        }
        var latex = "\\infer["+rulename+"]{"+conclusion+"}{"+latex_prems.join(" & ")+"}"
    }
    return latex
}


function sendEmail(tree) {
    var latex = export_to_latex(tree)
    $("#latex").html(latex)
    $('#modal3').modal({
        onApprove: function () {
            var email = $("#email").val()
            window.open('mailto:'+encodeURIComponent(email)+'?subject='+encodeURIComponent("Sequoia Latex Proof Tree")+'&body='+encodeURIComponent(latex));
        }
    }).modal('setting', 'closable', false).modal('show')
}


function cutSelect (type, callback) {
    $("#modal_warning").css("visibility","hidden")
    if (type != "Cut") {
        callback()
    } else {
        $('#modal2').modal({
            onApprove: function () {
                var v = $("#var").val()
                var f = $("#form").val()
                if (v == "" || f == "") {
                    $("#modal_warning").css("visibility","visible")
                    return false
                } else {
                    cut_var = v
                    cut_form = f
                    $("#var").val("")
                    $("#form").val("")
                    callback()
                }
            }
        })
        .modal('setting', 'closable', false).modal('show')
    }
}


function applyRule(i) {
    $("#warning").css("visibility","hidden")
    $("#info").css("display","none")
    if (leaf_id == "-1") return
    if ($("#conc_"+leaf_id).attr("class") == "conclusion") return
    var ruletemp = $("#r"+i)
    var name = ruletemp.attr("rule_name").replace(/\\/g, "\\\\")
    var side = ruletemp.attr("side")
    var type = ruletemp.attr("type")
    var conclusion = ruletemp.attr("conclusion")
    var premises = ruletemp.attr("premises")
    cutSelect (type, function () { 
        updateParser(fresh_symbols, function() {
            try {
                var sequent = parser.parse(seq_text).replace(/\\/g, "\\\\")
            } catch(error) {
                $("#warning_header").html("Sequent Parsing Error")
                $("#warning_text").html("Sequents must be structurally valid and contain term symbols from the sequent symbols table.")
                $("#warning").css("visibility","visible")
                return
            }
            var rule_sml = "Rule(\""+name+"\",None,"+conclusion+","+premises+")"
            var tree_sml = "DerTree(\""+leaf_id+"\","+sequent+", NONE, [])"
            var params = { rule: rule_sml, tree: tree_sml, node_id: "\""+leaf_id+"\"", index : rng_index, subs: "[]" }
            if (type == "Cut") {
                try {
                    var cF = formula_parser.parse(cut_form).replace(/\\/g, "\\\\")
                } catch(error) {
                    $("#warning_header").html("Formula Parsing Error")
                    $("#warning_text").html("Cut formulas must be structurally valid and contain term symbols from the sequent symbols table.")
                    $("#warning").css("visibility","visible")
                    return
                }
                params = { rule: rule_sml, tree: tree_sml, node_id: "\""+leaf_id+"\"", index : rng_index, subs: "[Fs(FormVar(\""+cut_var+"\"),"+cF+")]" }
            }
            $.post("/apply", params, function(data, status) {
                cut_var = ""
                cut_form = ""
                var output = data.output.slice(1,-1).split("&&")
                if (data.output == "NOT APPLICABLE") {
                    $("#warning_header").html("Rule and Premise Mismatch")
                    $("#warning_text").html("This rule cannot be applied to the selected premise.")
                    $("#warning").css("visibility","visible")
                    return
                }
                var prem_set = []
                var cons_set = []
                for (var k = 0; k < output.length; k++) {
                    var prems_cons = output[k].split("@@")
                    cons_set.push(prems_cons[0].trim().slice(1,-1).split("##"))
                    prem_set.push(prems_cons[1].trim().slice(1,-1).split("##"))
                    fresh_list = prems_cons[2].trim().slice(1,-1).split("##")
                    for (var y = 0; y < fresh_list.length; y++) {
                        if (fresh_list[y].length != 0) {
                            fresh_symbols[fresh_list[y]] = fresh_list[y]
                        }
                    }
                    rng_index = prems_cons[3].trim().slice(1,-1).split("##")[0]
                }
                if (prem_set.length == 1) {
                    var index = 0
                    insert_in_tree(leaf_id, name.replace(/\\\\/g,"\\"), prem_set[0])
                    insert_premises(leaf_id, name.replace(/\\\\/g,"\\"), prem_set[0])
                    $(".leaf").click(function() {
                        leaf_id = this.id.split("_")[1]
                        seq_text = $(this).find("script")[0].innerText
                        $("#warning").css("visibility","hidden")
                    })
                    constraint_history.push(cons_set[index])
                    var the_constraints = constraint_history.flat()
                    var constraints = $("#side_menu_L")
                    constraints.html("")
                    for (i = 0; i < the_constraints.length; i++) {
                        if (the_constraints[i] != "") {
                            constraints.append('<div class="item">$$'+the_constraints[i]+'$$</div>') 
                        }
                    }
                    MathJax.Hub.Queue(["Typeset",MathJax.Hub,constraints[0]])
                } else {
                    var choice = $("#choice")
                    choice.html("")
                    for (var i = 0; i < prem_set.length; i++) {
                        var display_prem = prem_set[i].join("\\qquad ")
                        choice.append('<div id="select" num='+i+' class="ui attahced secondary basic button select">$$'+display_prem+'$$</div>')
                    }
                    MathJax.Hub.Queue([ "Typeset",MathJax.Hub,choice[0]])
                    $("#info").css("display","block")
                    $(".select").click(function() {
                        var index = parseInt(this.getAttribute("num"))
                        $("#info").css("display","none")
                        insert_in_tree(leaf_id, name.replace(/\\\\/g,"\\"), prem_set[index])
                        insert_premises(leaf_id, name.replace(/\\\\/g,"\\"), prem_set[index])
                        $(".leaf").click(function() {
                            leaf_id = this.id.split("_")[1]
                            seq_text = $(this).find("script")[0].innerText
                            $("#warning").css("visibility","hidden")
                        })
                        constraint_history.push(cons_set[index])
                        var the_constraints = constraint_history.flat()
                        var constraints = $("#side_menu_L")
                        constraints.html("")
                        for (var i = 0; i < the_constraints.length; i++) {
                            if (the_constraints[i] != "") {
                                constraints.append('<div class="item">$$'+the_constraints[i]+'$$</div>') 
                            }
                        }
                        MathJax.Hub.Queue(["Typeset",MathJax.Hub,constraints[0]])
                    })
                }
            })
        })
    })
}


function undo() {
    $("#warning").css("visibility","hidden")
    $("#info").css("display","none")
    if (previous.length != 0) {
        var undo_items = previous.shift()
        leaf_id = undo_items[0] 
        seq_text = undo_items[1]
        remove_from_tree(leaf_id)
        remove_premises(leaf_id)
        $(".leaf").click(function() {
            leaf_id = this.id.split("_")[1]
            seq_text = $(this).find("script")[0].innerText
            $("#warning").css("visibility","hidden")
        })
        constraint_history.pop()
        var the_constraints = constraint_history.flat()
        var constraints = $("#side_menu_L")
        constraints.html("")
        for (var i = 0; i < the_constraints.length; i++) {
            if (the_constraints[i] != "") {
                constraints.append('<div class="item">$$'+the_constraints[i]+'$$</div>') 
            }
        }
        MathJax.Hub.Queue(["Typeset",MathJax.Hub,constraints[0]])
    }
}
