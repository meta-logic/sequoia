var previous = []
var leaf_id = "-1"
var seq_text = ""

function insert_in_tree(branch_id, rule, derivations) {
    var proof_tree = $("#prooftree_"+branch_id)
    proof_tree.append('<div id="applied_'+branch_id+'" class="rule">$$\\scriptsize{'+rule+'}$$</div>')
    var new_trees = ""
    for (var i = 0; i < derivations.length; i++) {
        new_trees +=
            '<div id="prooftree_'+branch_id+i+'" class="tree">'+
                '<div id="exp_'+branch_id+i+'" class="sequence">'+
                    '<div id="conc_'+branch_id+i+'" class="leaf">$$'+derivations[i]+'$$</div>'+
                '</div>'+
            '</div>'
    }
    $("#conc_"+branch_id).attr("class", "conclusion")
    var tree_branch = $("#exp_"+branch_id)
    tree_branch.html('<div id="delete_'+branch_id+'" class="premises">'+new_trees+'</div>'+tree_branch.html() )
    MathJax.Hub.Queue(["Typeset", MathJax.Hub,$("#applied_"+branch_id)[0]])
    MathJax.Hub.Queue(["Typeset",MathJax.Hub,$("#delete_"+branch_id)[0]])
    previous.unshift([branch_id,seq_text])
}


function remove_from_tree(branch_id) {
    $("#applied_"+branch_id).remove()
    $("#delete_"+branch_id).remove()
    $("#conc_"+branch_id).attr("class", "leaf")
}
