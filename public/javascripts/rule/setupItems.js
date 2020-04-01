$("#main-menu").sticky({});
$("#Calculus_icon").attr("class", "active item")
var calc_id = $("#calc_id").text()
$("#Calculus_icon").attr("href", "/sequoia/calculus/"+calc_id)
$("#Prooftree_icon").attr("href", "/sequoia/calculus/"+calc_id+"/apply")
$("#Properties_icon").attr("href", "/sequoia/calculus/"+calc_id+"/properties")
$("#add_button").attr("href", "/sequoia/calculus/"+calc_id+"/add-rule")
$.get("/sequoia/api/calculus/"+calc_id, function (calc, status) {
    $("#title").html(calc.calculus.title + $("#title").html())
    $("#description").html(calc.calculus.description)
    get_rules_toPage()
    get_symbols_toTable("rule")
})
