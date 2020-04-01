$("#main-menu").sticky({});
$("#Prooftree_icon").attr("class", "active item")
var calc_id = $("#calc_id").text()
$("#Calculus_icon").attr("href", "/sequoia/calculus/"+calc_id)
$("#Prooftree_icon").attr("href", "/sequoia/calculus/"+calc_id+"/apply")
$("#Properties_icon").attr("href", "/sequoia/calculus/"+calc_id+"/properties")
$.get("/sequoia/api/calculus/"+calc_id, function (calc, status) {
    get_rules_toPage()
    get_symbols_toTable("seq")
})


function list_to_string(item_list) {
    var item_string = ""
    for (var j = 0; j < item_list.length; j++) {
        item_string += item_list[j] + ","
    }
    return "["+item_string.slice(0,-1)+"]"
}