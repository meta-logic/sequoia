$.get("/api/rule/" + document.getElementById("id").innerHTML , function (data, status) {
    var rule = data.rule
    document.getElementById("rule_name").value = data.rule.rule
    document.getElementById("Conclusion").value = data.rule.conclusion
    document.getElementById("id").value = data.rule._id
    for (var i = 1; i < data.rule.premises.length; i++) {
        addPremise()
    }
    for (i = 0; i < data.rule.premises.length; i++) {
        document.getElementById("i" + i.toString()).value = data.rule.premises[i]
    }

})
