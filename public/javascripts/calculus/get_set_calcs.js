// Sequoia Copyright (C) 2020  Zan Naeem
// This program comes with ABSOLUTELY NO WARRANTY; for details see LICENSE.
// This is free software, and you are welcome to redistribute it
// under certain conditions; see LICENSE for details.


var c = 0

function get_calculi_toPage() {
    var calculi_container = $("#calculi")
    for (var i = 0; i < c; i++) {
        var entry = $("#calc_"+i)
        if (entry != null) {
            entry.remove()
        }
    }
    $.get("/sequoia/api/calculi/"+user_id, function(calcs, status) {
        var calculi = calcs.calculi
        for (var i = 0; i < calculi.length; i++) {
            calculi_container.append(
                '<div id="calc_'+i+'" class="card">'+
                    '<div class="content">'+
                        '<div class="header">'+calculi[i].title+'</div>'+
                        '<div class="description">'+calculi[i].description+'</div>'+
                    '</div>'+
                    '<div class="ui bottom attached buttons">'+
                        '<a class="ui basic blue button" href=/sequoia/calculus/'+calculi[i]._id+'>Select</a>'+
                        '<a id="delete_'+i+'" class="ui basic red button" onClick=deleteCalculus('+i+',"'+calculi[i]._id+'")>Delete</a>'+
                    '</div>'+
                '</div>'
            )
        }
        c = calculi.length
    })
}


function addCalculus() {
    var calculi_container = $("#calculi")
    var title = escape_norm($("#title").val().trim())
    var description = escape_norm($("#description").val().trim())
    if (title != "" && description != "") {
        $.post("/sequoia/api/calculus", {title : title, description : description, user : user_id}, function(data, status) {
            calculi_container.append(
                '<div id="calc_'+c+'" class="card">'+
                    '<div class="content">'+
                        '<div class="header">'+data.calculus.title+'</div>'+
                        '<div class="description">'+data.calculus.description+'</div>'+
                    '</div>'+
                    '<div class="ui bottom attached buttons">'+
                        '<a class="ui basic blue button" href=/sequoia/calculus/'+data.calculus._id+'>Select</a>'+
                        '<a id="delete_'+c+'" class="ui basic red button" onClick=deleteCalculus('+c+',"'+data.calculus._id+'")>Delete</a>'+
                    '</div>'+
                '</div>'
            )
            c++
            $("#title").val("")
            $("#description").val("")
        })
    }
}


function addSomeCalculus(num) {
    var calculi_container = $("#calculi")
    var sample = ["LJ", "LK", "S4","Lax"][num]
    var title = sample
    var description = "This is a sample calculus with some basic rules. Try it out!"
    $.post("/sequoia/api/calculus", {title : title, description : description, user : user_id}, function(data, status) {
        var sampleCalc = data.calculus
        var syms_rules = sample_calc(sample, sampleCalc._id)
        $.post("/sequoia/api/symbols_init", {items : JSON.stringify(syms_rules[0])}, function(data, status) {
            $.post("/sequoia/api/rules_init", {items : JSON.stringify(syms_rules[1])}, function(data, status) {
                calculi_container.append(
                    '<div id="calc_'+c+'" class="card">'+
                        '<div class="content">'+
                            '<div class="header">'+sampleCalc.title+'</div>'+
                            '<div class="description">'+sampleCalc.description+'</div>'+
                        '</div>'+
                        '<div class="ui bottom attached buttons">'+
                            '<a class="ui basic blue button" href=/sequoia/calculus/'+sampleCalc._id+'>Select</a>'+
                            '<a id="delete_'+c+'" class="ui basic red button" onClick=deleteCalculus('+c+',"'+sampleCalc._id+'")>Delete</a>'+
                        '</div>'+
                    '</div>'
                )
                c++
                $("#title").val("")
                $("#description").val("")
            })
        })
    })
}


function deleteCalculus(card_id, mongo_id) {
    $("#modal1").modal({
        onApprove: function() {
            $.ajax({
                url: "/sequoia/api/calculus",
                type: "DELETE",
                data : {"id" : mongo_id},
                success: function(result) {
                    $("#calc_"+card_id).hide('slow', function() {$("#calc_"+card_id).remove()})
                    for (var i = card_id+1; i < c; i++) {
                        var delete_text = $("#delete_"+i).attr("onClick").split(",")[1]
                        var new_delete_text = "deleteCalculus("+(i-1)+","+delete_text
                        $("#delete_"+i).attr("onClick", new_delete_text)
                        $("#delete_"+i).attr("id", "delete_"+(i-1))
                        $("#calc_"+i).attr("id", "calc_"+(i-1))
                    }
                    c --
                    console.log("Calculus sucessfully deleted.")
                },
                error: function(result) {
                    console.log("ERROR: Calculus could not be deleted.")
                }
            })
        }
    })
    .modal("setting", "closable", false).modal("show")
}