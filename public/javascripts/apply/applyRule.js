var constraint_history = []
var rng_index = "0"
var fresh_symbols = {}

function applyRule(i) {
    var warning_text = "<div id=\"apply warning\"><div class=\"ui red negative message\">"+
    "<div class=\"header\">Rule and Premise Mismatch</div>"+
    "<p>This rule cannot be applied to the selected premise</p></div>"

    if (leaf_id == "-1") {
        return
    }
    var type = document.getElementById("prooftree_" + leaf_id + "_conc").getAttribute("class")
    if (type == "conc") {
        return
    }
    var ruletemp = document.getElementById("r"+i)
    var name = ruletemp.getAttribute("rule_name").replace(/\\/g, "\\\\")
    var conclusion = ruletemp.getAttribute("conclusion")
    var premises = ruletemp.getAttribute("premises")
    var rule_sml = "Rule(\""+name+"\",None,"+conclusion+","+premises+")"
    updateParser(fresh_symbols, function() {
        var sequent = parser.parse(seq_text).replace(/\\/g, "\\\\")
        var tree_sml = "DerTree(\""+leaf_id+"\","+sequent+", NoRule, [])"
        $.post("/apply", { rule: rule_sml, tree: tree_sml, node_id: "\""+leaf_id+"\"", index : rng_index }, function(data, status) {
            var output = data.output.slice(1,-1).split("&&")
            if (data.output == "NOT APPLICABLE"){
                document.getElementById("warning").innerHTML = warning_text
                return
            }
            var apply_warning = document.getElementById("apply warning")
            if (apply_warning != null){
                apply_warning.remove()
            }
            var prem_set = []
            var cons_set = []
            for (k = 0; k < output.length; k++) {
                prems_cons = output[k].split("@@")
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
                index = 0
                build_proof_tree(leaf_id, name, prem_set[0])
                $(".conc-temp").click(function() {
                    leaf_id = this.id.split("_")[1]
                    seq_text = $(this).find("script")[0].innerText
                    console.log(seq_text)
                })
                var constraints = document.getElementById('side_menu_L')
                constraint_history.push(cons_set[index])
                var the_constraints = constraint_history.flat()
                constraints.innerHTML = ""
                for (i = 0; i < the_constraints.length; i++) {
                    if (the_constraints[i] != "") {
                        constraints.innerHTML += '<div class="item">$$'+the_constraints[i]+'$$</div>'
                    }
                }
                MathJax.Hub.Queue([ "Typeset", MathJax.Hub, constraints ])
            }
            else {
                var message = document.getElementById('info_prems')
                message.innerHTML = 
                "<div class=\"ui info message\">"+
                    "<div class=\"header\">Multiple Applications</div>"+
                    "<div class=\"content\">"+
                        "<p>The rule can be applied to a the selected sequent in more than one way. "+ 
                        "Select the set of premises for which you would like to use to continue building the tree on the selected sequent.</p>"+
                    "</div><ul id = \"choice\" class=\"list\"></ul></div>"
                var choice = document.getElementById('choice')
                for (i = 0; i < prem_set.length; i++) {
                    var display_prem = prem_set[i].join("\\qquad ")
                    choice.innerHTML += "<div id = \"select\" num = "+i+" class=\"ui attahced secondary basic button select\">$$"+display_prem+"$$</div>"
                }
                MathJax.Hub.Queue([ "Typeset", MathJax.Hub, choice ])

                $(".select").click(function() {
                    index = parseInt(this.getAttribute("num").toString())
                    message.innerHTML = "<br><br><br><br><br><br>"
                    build_proof_tree(leaf_id, name, prem_set[index])
                    $(".conc-temp").click(function() {
                        leaf_id = this.id.split("_")[1]
                        seq_text = $(this).find("script")[0].innerText
                        console.log(seq_text)
                    })
                    var constraints = document.getElementById('side_menu_L')
                    constraint_history.push(cons_set[index])
                    var the_constraints = constraint_history.flat()
                    constraints.innerHTML = ""
                    for (i = 0; i < the_constraints.length; i++) {
                        if (the_constraints[i] != "") {
                            constraints.innerHTML += '<div class="item">$$'+the_constraints[i]+'$$</div>'
                        }
                    }
                    MathJax.Hub.Queue([ "Typeset", MathJax.Hub, constraints ])
                })
            }
        })
    })
    console.log(constraint_history)
}


function undo() {
    if (previous.length != 0) {
        var undo_items = previous.shift()
        var undo_id = undo_items[0] 
        var undo_branch_count = undo_items[1] 
        var undo_seq = undo_items[2]
        var proof_tree = $("#prooftree")[0]
        proof_tree.setAttribute("count", undo_branch_count)
        var conclusion = $("#prooftree_" + undo_id + "_conc")[0]
        conclusion.setAttribute("class", "conc-temp")
        $(".conc-temp").click(function() {
            leaf_id = this.id.split("_")[1]
            seq_text = $(this).find("script")[0].innerText
            console.log(seq_text)
        })
        conclusion.removeAttribute("colspan")
        document.getElementById("delete_id"+undo_id).remove()
        leaf_id = undo_id
        seq_text = undo_seq

        var constraints = document.getElementById('side_menu_L')
        constraint_history.pop()
        var the_constraints = constraint_history.flat()
        for (i = 0; i < the_constraints.length; i++) {
            if (the_constraints[i] != "") {
                constraints.innerHTML += '<div class="item">$$'+the_constraints[i]+'$$</div>'
            }
        }
        MathJax.Hub.Queue([ "Typeset", MathJax.Hub, constraints ])
    }
    console.log(constraint_history)
}
