// Sequoia Copyright (C) 2020  Zan Naeem
// This program comes with ABSOLUTELY NO WARRANTY; for details see LICENSE.
// This is free software, and you are welcome to redistribute it
// under certain conditions; see LICENSE for details.


$("#main-menu").sticky({});
$("#Properties_icon").attr("class", "active item")
var calc_id = $("#calc_id").text()
$("#Calculus_icon").attr("href", "/sequoia/calculus/"+calc_id)
$("#Prooftree_icon").attr("href", "/sequoia/calculus/"+calc_id+"/apply")
$("#Properties_icon").attr("href", "/sequoia/calculus/"+calc_id+"/properties")
var property = $("#property").text()
if (property == "Main Page") {
    $("#prop1").attr("href", "/sequoia/calculus/"+calc_id+"/properties/init_coherence")
    $("#prop2").attr("href", "/sequoia/calculus/"+calc_id+"/properties/weak_admissability")
    $("#prop3").attr("href", "/sequoia/calculus/"+calc_id+"/properties/permutability")
    $("#prop4").attr("href", "/sequoia/calculus/"+calc_id+"/properties/cut_admissability")
    $("#prop5").attr("href", "/sequoia/calculus/"+calc_id+"/properties/invertibility")
}
if (property == "Permutability") {
    get_rules_toPage()
} else if (property == "Cut Admissibility") {
    get_cuts_toPage()
}


function unzip(item_list) {
    var item1 = []
    var item2 = []
    for (var j = 0; j < item_list.length; j++) {
        item1.push(item_list[j][0])
        item2.push(item_list[j][1])
    }
    return [item1,item2]
}


function list_to_string(item_list) {
    var item_string = ""
    for (var j = 0; j < item_list.length; j++) {
        item_string += item_list[j] + ","
    }
    return "["+item_string.slice(0,-1)+"]"
}