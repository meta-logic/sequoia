$("#main-menu").sticky({});
$("#Properties_icon").attr("class", "active item")
var calc_id = $("#calc_id").text()
$("#Calculus_icon").attr("href", "/calculus/"+calc_id)
$("#Prooftree_icon").attr("href", "/calculus/"+calc_id+"/apply")
$("#Properties_icon").attr("href", "/calculus/"+calc_id+"/properties")
var property = $("#property").text()
if (property == "Main Page") {
    $("#prop1").attr("href", "/calculus/"+calc_id+"/properties/init_coherence")
    $("#prop2").attr("href", "/calculus/"+calc_id+"/properties/weak_admissability")
    $("#prop3").attr("href", "/calculus/"+calc_id+"/properties/permutability")
    $("#prop4").attr("href", "/calculus/"+calc_id+"/properties/cut_admissability")
}
if (property == "Permutability") {
    $.get("/api/calculus/"+calc_id, function (calc, status) {
        get_rules_toPage()
    })
}


function list_to_string(item_list) {
    var item_string = ""
    for (var j = 0; j < item_list.length; j++) {
        item_string += item_list[j] + ","
    }
    return "["+item_string.slice(0,-1)+"]"
}