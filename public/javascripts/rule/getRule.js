var calc_id = document.getElementById("calc_id").innerHTML
document.getElementById("Calculus icon").setAttribute("href", "/calculus/"+calc_id)
document.getElementById("Proof Tree icon").setAttribute("href", "/calculus/"+calc_id+"/apply")
document.getElementById("Properties icon").setAttribute("href", "/calculus/"+calc_id+"/properties")
var page = document.getElementById("page").innerHTML
if (page == "edit") {
    document.getElementById("prev button").setAttribute("onclick", "preview('Update')") 
    $.get("/api/rule/" + document.getElementById("rule_id").innerHTML , function (data, status) {
        document.getElementById("rule_id").value = data.rule._id
        document.getElementById("rule_name").value = data.rule.rule
        document.getElementById("side").value = data.rule.side
        document.getElementById("connective").value = data.rule.connective
        for (var i = 0; i < data.rule.premises.length; i++) {
            if (i > 0) {
                addPremise()
            }
            document.getElementById("i" + i.toString()).value = data.rule.premises[i]
        }
        document.getElementById("Conclusion").value = data.rule.conclusion

    })
}