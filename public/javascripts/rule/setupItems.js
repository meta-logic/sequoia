$('#main-menu').sticky({});
var calc_id = document.getElementById("calc_id").innerHTML
document.getElementById("Calculus icon").setAttribute("href", "/calculus/"+calc_id)
document.getElementById("Proof Tree icon").setAttribute("href", "/calculus/"+calc_id+"/apply")
document.getElementById("Properties icon").setAttribute("href", "/calculus/"+calc_id+"/properties")
$.get("/api/calculus/"+calc_id, function (calc, status) {
    document.getElementById("add_button").setAttribute("href", "/calculus/"+calc_id+"/add-rule")
    document.getElementById("title").innerHTML = calc.calculus.title + document.getElementById("title").innerHTML
    document.getElementById("description").innerHTML = calc.calculus.description
    get_rules_toPage()
    get_symbols_toTable('rule')
})
