var calc_id = document.getElementById("calc_id").innerHTML
document.getElementById("Calculus icon").setAttribute("href", "/calculus/"+calc_id)
document.getElementById("Proof Tree icon").setAttribute("href", "/calculus/"+calc_id+"/apply")
document.getElementById("Properties icon").setAttribute("href", "/calculus/"+calc_id+"/properties")
$.get("/api/calculus/"+calc_id, function (calc, status) {
    get_rules_toPage()
})