// Sequoia Copyright (C) 2020  Zan Naeem, Abdulrahman Alfayad
// This program comes with ABSOLUTELY NO WARRANTY; for details see LICENSE.
// This is free software, and you are welcome to redistribute it
// under certain conditions; see LICENSE for details.


var r = 0

function get_rules_toPage() {
    var rules_container = $("#rules")
    if (rules_container[0] == null)
        return
    for (i = 0; i < r; i++) {
        var entry = $("#rule_"+i)
        if (entry != null) {
            entry.remove()
        }
    }
    $.get("/sequoia/api/rules/"+$("#calc_id").text(), function (rls, status) {
        var rules = rls.rules
        for (var i = 0; i < rules.length; i++) {
            var card_content = '$$\\frac{'+rules[i].premises.join(" \\quad \\quad ")+'}{'+rules[i].conclusion+'}'+rules[i].rule+'$$'
            rules_container.append( 
                '<div id="rule_'+i+'" class="ui card">'+
                    '<div class="content">'+card_content+'</div>'+
                    '<div class="ui bottom attached buttons">'+
                        '<a class="ui basic blue button" href="/sequoia/calculus/'+calc_id+'/edit-rule/'+rules[i]._id+'">Edit</a>'+
                        '<a id="deleteR_'+i+'" class="ui basic red button" onClick=deleteRule('+i+',"'+rules[i]._id+'")>Delete</a>'+
                    '</div>'+
                '</div>'
            )
            MathJax.Hub.Queue(["Typeset",MathJax.Hub,card_content])
        }
        r = rules.length
    })
}


function deleteRule(card_id, mongo_id) {
    $.ajax({
        url: "/sequoia/api/rule",
        type: "DELETE",
        data : {"id" : mongo_id},
        success: function(result) {
            if (card_id != -1) {
                $("#rule_"+card_id).hide('slow', function(){$("#rule_"+card_id).remove()})
                for (var i = card_id+1; i < r; i++) {
                    var delete_text = $("#deleteR_"+i).attr("onClick").split(",")[1]
                    var new_delete_text = "deleteRule("+(i-1)+","+delete_text
                    $("#deleteR_"+i).attr("onClick", new_delete_text)
                    $("#deleteR_"+i).attr("id", "deleteR_"+(i-1))
                    $("#rule_"+i).attr("id", "rule_"+(i-1))
                }
                r --
            }
            console.log("Rule sucessfully deleted.")
        },
        error: function(result) {
            console.log("ERROR: rule could not be deleted.")
        }
    })
}