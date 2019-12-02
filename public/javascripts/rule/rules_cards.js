var r = 0

function get_rules_toPage() {
    var rules_container = document.getElementById("rules")
    if (rules_container == null) { return }
    for (i = 0; i < r; i++) {
        entry = document.getElementById("rule_card"+i)
        if (entry != null) {
            entry.remove()
        }
    }
    var calc_id = document.getElementById("calc_id").innerHTML
    $.get("/api/rules/"+calc_id, function (rls, status) {
        var rules = rls.rules
        for (var i = 0; i < rules.length; i++) {
            rules_container.innerHTML += 
            '<div id="rule_card'+i+'" class="ui card">' 
                +'<div class="content">'
                    +'\\[\\frac{'+rules[i].premises.join(" \\quad \\quad ")+'}{'+rules[i].conclusion+'}'+rules[i].rule+'\\]' 
                +'</div>'
                +'<div class="ui bottom attached buttons">'
                    +'<a class="ui basic blue button" href="/calculus/'+calc_id+'/edit-rule/'+rules[i]._id+'">Edit</a>'
                    +'<a class="ui basic red button" onClick=deleteRule("'+rules[i]._id+'")>Delete</a>'
                +'</div>'
            +'</div>'
        }
        MathJax.Hub.Queue(["Typeset",MathJax.Hub,rules_container])
        r = rules.length
    })
}

function deleteRule (id) {
    $.ajax({
        url: "/api/rule",
        type: "DELETE",
        data : { "id" : id },
        success: function(result) {
            get_rules_toPage()
            console.log("Rule sucessfully deleted.")
        },
        error: function(result) {
            console.log("ERROR: rule could not be deleted.")
        }
    })
}
