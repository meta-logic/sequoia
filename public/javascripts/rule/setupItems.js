$("#main-menu").sticky({});
var calc_id = $("#calc_id").text()
$("#Calculus_icon").attr("href", "/calculus/"+calc_id)
$("#Prooftree_icon").attr("href", "/calculus/"+calc_id+"/apply")
$("#Properties_icon").attr("href", "/calculus/"+calc_id+"/properties")
$("#add_button").attr("href", "/calculus/"+calc_id+"/add-rule")
$.get("/api/calculus/"+calc_id, function (calc, status) {
    $("#title").html(calc.calculus.title + $("#title").html())
    $("#description").html(calc.calculus.description)
    get_rules_toPage()
    get_symbols_toTable("rule")
})
