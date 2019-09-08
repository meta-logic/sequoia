
function applyRule(i) {
    var warning_text = "<div id=\"apply warning\"><div class=\"ui red negative message\">"+
    "<div class=\"header\">Rule and Premise Mismatch</div>"+
    "<p>This rule cannot be applied to the selected premise</p></div>"

    var ruletemp = document.getElementById("r"+i)
    var name = ruletemp.getAttribute("rule_name")
    var side = ruletemp.getAttribute("rule_name")[-1]
    var conclusion = ruletemp.getAttribute("conclusion")
    var premises = ruletemp.getAttribute("premises")
    var rule_sml = "Rule(\""+name+"\",None,"+conclusion+","+premises+")"
    var sequent = parser.parse(seq_text).replace(/\\/g, "\\\\")
    var tree_sml = "DevTree(\""+leaf_id+"\","+sequent+", NoRule, [])"

    // console.log(rule_sml)
    // console.log(tree_sml)

    $.post("/apply", { rule: rule_sml, tree: tree_sml, node_id: "\""+leaf_id+"\"" }, function(data, status) {
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
        for (k = 0; k < output.length; k++) {
            prem_set.push(output[k].trim().slice(1,-1).split("##"))
        }

        if (prem_set.length == 1) {
            build_proof_tree(leaf_id, name, prem_set[0])
            $(".conc-temp").click(function() {
                leaf_id = this.id.split("_")[1]
                seq_text = $(this).find("script")[0].innerText
                console.log(seq_text)
            })
        }
        else {
            var index
            var message = document.getElementById('info_prems')
            message.innerHTML = 
            "<div class=\"ui info message\">"+
                "<div class=\"header\">Multiple Applications</div>"+
                "<div class=\"content\">"+
                    "<p>The rule can be applied to a the selected sequent in more than one way."+ 
                    "Select the set of premises on how you would like to build the tree from the selected sequent.</p>"+
                "</div><ul id = \"choice\" class=\"list\"></ul></div>"
            
            var choice = document.getElementById('choice')
            for (i = 0; i < prem_set.length; i++) {
                var display_prem = prem_set[i].join("\\qquad")
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
            })
        }
    })
}

