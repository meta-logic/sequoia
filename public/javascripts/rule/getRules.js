var rules = ""
var rules_container = document.getElementById("rules")
var rule_container = ""
var temp = ""

$.get("/api/get-rules", function (rules, status) {
    rules = rules

    for (var i = 0; i < rules.length; i++) {
        temp = "'" + rules[i]._id + "'"
        rules_container.innerHTML += "<div class=\"four wide column\"><div class=\"ui card\" id=\"r"+ i.toString() +"\"></div></div>"
        rule_container = document.getElementById(("r" + i.toString()))
        rule_container.innerHTML = "\\[\\frac{"+ rules[i].premises.join(" \\quad \\quad ")+"}{"+ rules[i].conclusion +"}"+rules[i].rule+"\\]" + "<div class=\"extra content\"><div class=\"ui two buttons\"><a class=\"ui basic blue button\" href=\"/edit-rule/"+ rules[i]._id +"\">Edit</a><a class=\"ui basic red button\" onClick=\"deleteRule("+ temp +")\" href=\"/\">Delete</a></div></div>"
        MathJax.Hub.Queue(["Typeset",MathJax.Hub,rule_container])	
    }

})
