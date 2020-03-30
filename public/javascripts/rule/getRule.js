var calc_id = $("#calc_id").text()
$("#Calculus_icon").attr("href", "/sequoia/calculus/"+calc_id)
$("#Prooftree_icon").attr("href", "/sequoia/calculus/"+calc_id+"/apply")
$("#Properties_icon").attr("href", "/sequoia/calculus/"+calc_id+"/properties")
if ($("#page").text() == "Update") {
    $("#prev button").attr("onclick", "preview('Update')") 
    $.get("/api/rule/"+$("#rule_id").text(), function (data, status) {
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