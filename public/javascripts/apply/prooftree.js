var leaf_id = "0"
var seq_text = ""
// A function to build on proof trees
// Input:
// - Proof tree html container ID (string)
// - Proof tree branch to expand on (int)
// - Rule being applied (string)
// - Array of derivations ([string])
// Output: A branch/branches with the given derivation(s) expanding from the given branch in the proof tree provided
function build_proof_tree(branch_id, rule, derivations) {
    // retrieving the proof tree branch html
    var proof_tree = $("#prooftree")[0]

    // getting the total number of branches to assign ids for the new branches
    var branch_count = parseInt(proof_tree.getAttribute("count"))
    proof_tree.setAttribute("count", branch_count + derivations.length - 1)

    // retrieving the proof tree branch html
    var proof_tree_branch = $("#prooftree_" + branch_id + " tbody")[0]
    if (branch_count == 1) proof_tree_branch = $("#prooftree tbody")[0]

    // creating the line on top of the branch
    var conclusion = $("#prooftree_" + branch_id + "_conc")[0]
    conclusion.setAttribute("class", "conc")
    conclusion.setAttribute("colspan", derivations.length)

    // creating the rule
    var rule = "<td class=\"rulename\" rowspan=\"2\"><div class=\"rulename\">\\[" + rule + "\\]</div></td>"

    // creating the new derivation branches
    var new_branches = ""
    for (var i = 0; i < derivations.length; i++) {
        new_branches +=
			"<td><table id=\"" +
			"prooftree" +
			"_" +
			branch_id + i +
			"\"> \
            <tr><td class=\"conc-temp\" id=\"" +
			"prooftree" +
			"_" +
			branch_id + i +
			"_conc" +
			"\">\\[" +
			derivations[i] +
			"\\]</td></tr>\
        </table></td>"
    }

    var row = "<tr>" + new_branches + rule + "</tr>"

    // adding the derivations to the branch
    proof_tree_branch.innerHTML = row + proof_tree_branch.innerHTML

    //applying mathjax
    MathJax.Hub.Queue([ "Typeset", MathJax.Hub, proof_tree_branch.firstElementChild ])
}

// $(".conc-temp").click(function() {
//     leaf_id = parseInt(this.id.split("_")[1])
//     seq_text = $(this).find("script")[0].innerText
// })
