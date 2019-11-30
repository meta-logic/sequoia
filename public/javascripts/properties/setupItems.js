var calc_id = document.getElementById("calc_id").innerHTML
document.getElementById("Calculus icon").setAttribute("href", "/calculus/"+calc_id)
document.getElementById("Proof Tree icon").setAttribute("href", "/calculus/"+calc_id+"/apply")
document.getElementById("Properties icon").setAttribute("href", "/calculus/"+calc_id+"/properties")
var property = document.getElementById("property").innerHTML
if (property == "Main Page") {
    document.getElementById("prop1").setAttribute("href", "/calculus/"+calc_id+"/properties/permutability")
    document.getElementById("prop2").setAttribute("href", "/calculus/"+calc_id+"/properties/init_coherence")
    document.getElementById("prop3").setAttribute("href", "/calculus/"+calc_id+"/properties/weak_admissability")
    document.getElementById("prop4").setAttribute("href", "/calculus/"+calc_id+"/properties/cut_admissability")
}
if (property == "Permutability") {
    $.get("/api/calculus/"+calc_id, function (calc, status) {
        get_rules_toPage()
    })
}