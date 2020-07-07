// Sequoia Copyright (C) 2020  Zan Naeem
// This program comes with ABSOLUTELY NO WARRANTY; for details see LICENSE.
// This is free software, and you are welcome to redistribute it
// under certain conditions; see LICENSE for details.


var rng_index = "0"
var fresh_symbols = {}
var seq_text = ""
var leaf_id = "-1"
var cut_form = ""
var sml_history = []
var latex_history = []
var tree_history = []
var smlconstraint_history = ["nil"]
var constraint_history = []
var proof_content = {}

function seeLatex() {
    var latex_tree = latex_history[latex_history.length-1]
    var latex_constraints = ""
    $("#latex").html("Tree: <br>"+latex_tree)
    if (constraint_history.length > 0) {
        latex_constraints = ((constraint_history[constraint_history.length-1]).join(" AND "))
        $("#latex").append("<br><br> Constraints: <br>"+latex_constraints+"")
    }
    $('#modal3').modal({
        onApprove: function() {
            var tree_content = latex_history[latex_history.length-1]
            var constraint_content = "NONE"
            if (constraint_history.length != 0) {
                constraint_content = constraint_history[constraint_history.length-1].join(" \\quad \/ \\quad ")
                if (constraint_content == "") {
                    constraint_content = "NONE"
                }
            } 
            proof_content["tree"] = tree_content
            proof_content["constraints"] = constraint_content
            download("LatexTree")
        }
    }).modal('setting', 'closable', false).modal('show')
}


function cutSelect(type, callback) {
    $("#modal_warning").css("visibility", "hidden")
    if (type != "Cut") {
        callback()
    } else {
        $('#modal2').modal({
            onApprove: function() {
                var f = escape_latex($("#form").val().trim())
                if (f == "") {
                    $("#modal_warning").css("visibility", "visible")
                    return false
                } else {
                    cut_form = f
                    $("#form").val("")
                    callback()
                }
            }
        })
        .modal('setting', 'closable', false).modal('show')
    }
}


function applyRule(i) {
    $("#warning").css("visibility", "hidden")
    $("#info").css("display", "none")
    if (leaf_id == "-1") return
    if ($("#conc_"+leaf_id).attr("class") == "conclusion") return
    var ruletemp = $("#r"+i)
    var name = ruletemp.attr("rule_name").replace(/\\/g, "\\\\")
    var side = ruletemp.attr("side")
    var type = ruletemp.attr("type")
    var cutvar = ruletemp.attr("cutvar")
    var conclusion = ruletemp.attr("conclusion")
    var premises = ruletemp.attr("premises")
    cutSelect(type, function() { 
        updateParser(fresh_symbols, function() {
            try {
                var sequent = parser.parse(seq_text).replace(/\\/g, "\\\\")
            } catch(error) {
                $("#warning_header").html("Sequent Parsing Error")
                $("#warning_text").html("Sequents must be structurally valid and contain term symbols from the sequent symbols table.")
                $("#warning").css("visibility", "visible")
                return
            }
            var rule_sml = "Rule(\""+name+"\",None,"+conclusion+","+premises+")"
            var tree_sml = sml_history[sml_history.length-1]
            var constraints_sml = smlconstraint_history[smlconstraint_history.length-1]
            var params = {rule : rule_sml, constraints : constraints_sml, tree : tree_sml, node_id : "\""+leaf_id+"\"", index : rng_index, subs : "[]"}
            if (type == "Cut") {
                try {
                    var cF = formula_parser.parse(cut_form).replace(/\\/g, "\\\\")
                } catch(error) {
                    $("#warning_header").html("Formula Parsing Error")
                    $("#warning_text").html("Cut formulas must be structurally valid and contain term symbols from the sequent symbols table.")
                    $("#warning").css("visibility", "visible")
                    return
                }
                params = {rule : rule_sml, constraints : constraints_sml, tree : tree_sml, node_id : "\""+leaf_id+"\"", index : rng_index, subs : "[Fs("+cutvar+","+cF+")]"}
            }
            $.post("/sequoia/apply", params, function(data, status) {
                cut_var = ""
                cut_form = ""
                var output = data.output.slice(1,-1).split("&&")
                if (data.output == "NOT APPLICABLE") {
                    $("#warning_header").html("Rule and Premise Mismatch")
                    $("#warning_text").html("This rule cannot be applied to the selected premise.")
                    $("#warning").css("visibility", "visible")
                    return
                }
                var cons_set = []
                var new_sml_cons = []
                var prem_set = []
                var new_latex_trees = []
                var new_html_trees = []
                var new_sml_trees = []
                for (var k = 0; k < output.length; k++) {
                    var prems_cons = output[k].split("@@@")
                    var cons_sml = prems_cons[0].trim().slice(1,-1).split("%%%")
                    cons_set.push(cons_sml[0].split("###"))
                    new_sml_cons.push(cons_sml[1])
                    var prems_latex_html_sml = prems_cons[1].trim().slice(1,-1).split("%%%")
                    prem_set.push(prems_latex_html_sml[0].split("###"))
                    new_latex_trees.push(prems_latex_html_sml[1])
                    new_html_trees.push(prems_latex_html_sml[2])
                    new_sml_trees.push(prems_latex_html_sml[3])
                    fresh_list = prems_cons[2].trim().slice(1,-1).split("###")
                    for (var y = 0; y < fresh_list.length; y++) {
                        if (fresh_list[y].length != 0) {
                            fresh_symbols[fresh_list[y]] = fresh_list[y]
                        }
                    }
                    rng_index = prems_cons[3].trim().slice(1,-1).split("###")[0]
                }
                if (prem_set.length == 1) {
                    var index = 0
                    insert_new_tree(cons_set[index], new_sml_cons[index], new_latex_trees[index], new_html_trees[index], new_sml_trees[index])
                } else {
                    var choice = $("#choice")
                    choice.html("")
                    for (var i = 0; i < prem_set.length; i++) {
                        var display_prem = prem_set[i].join("\\qquad ")
                        choice.append('<div id="select" num='+i+' class="ui attahced secondary basic button select">$$'+display_prem+'$$</div>')
                    }
                    MathJax.Hub.Queue(["Typeset", MathJax.Hub, choice[0]])
                    $("#info").css("display", "block")
                    $(".select").click(function() {
                        var index = parseInt(this.getAttribute("num"))
                        $("#info").css("display", "none")
                        insert_new_tree(cons_set[index], new_sml_cons[index], new_latex_trees[index], new_html_trees[index], new_sml_trees[index])
                    })
                }
            })
        })
    })
}


function undo() {
    $("#warning").css("visibility", "hidden")
    $("#info").css("display", "none")
    if (tree_history.length > 1) {
        insert_old_tree()
    }
}