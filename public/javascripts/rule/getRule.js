// Sequoia Copyright (C) 2020  Zan Naeem, Abdulrahman Alfayad
// This program comes with ABSOLUTELY NO WARRANTY; for details see LICENSE.
// This is free software, and you are welcome to redistribute it
// under certain conditions; see LICENSE for details.


var calc_id = $("#calc_id").text()
var rule_id = ""
$("#main-menu").sticky({});
$("#Calculus_icon").attr("class", "active item")
$("#Calculus_icon").attr("href", "/sequoia/calculus/"+calc_id)
$("#Prooftree_icon").attr("href", "/sequoia/calculus/"+calc_id+"/apply")
$("#Properties_icon").attr("href", "/sequoia/calculus/"+calc_id+"/properties")
if ($("#page").text() == "Update") {
    rule_id = $("#rule_id").text()
    $("#prev button").attr("onclick", "preview('Update')")
    $.get("/sequoia/api/rule/"+rule_id, function(data, status) {
        $("#rule_id").val(data.rule._id)
        $("#rule_name").val(data.rule.rule)
        $("#side").val(data.rule.side)
        $("#kind").val(data.rule.type)
        $("#connective").val(data.rule.connective)
        for (var i = 0; i < data.rule.premises.length; i++) {
            if (i > 0) {
                addPremise()
            }
            $("#i"+i).val(data.rule.premises[i])
        }
        $("#conclusion").val(data.rule.conclusion)
    })
}
get_symbols_toTable("rule")