var r = 0

function get_rules_toPage() {
    var rules_container = document.getElementById("rules")
    for (i = 0; i < r; i++) {
        entry = document.getElementById("rule_card"+i)
        if (entry != null) {
            entry.remove()
        }
    }
    $.get("/api/get-rules", function (rules, status) {
        for (var i = 0; i < rules.length; i++) {
            var temp = "'" + rules[i]._id + "'"
            rules_container.innerHTML += "<div id=\"rule_card"+ i.toString() +"\" class=\"four wide column\"><div class=\"ui card\" id=\"r"+ i.toString() +"\"></div></div>"
            var rule_container = document.getElementById(("r" + i.toString()))
            rule_container.innerHTML = "\\[\\frac{"+ rules[i].premises.join(" \\quad \\quad ")+"}{"+ rules[i].conclusion +"}"+rules[i].rule+"\\]" + "<div class=\"extra content\"><div class=\"ui two buttons\"><a class=\"ui basic blue button\" href=\"/edit-rule/"+ rules[i]._id +"\">Edit</a><a class=\"ui basic red button\" onClick=\"deleteRule("+ temp +")\">Delete</a></div></div>"
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
