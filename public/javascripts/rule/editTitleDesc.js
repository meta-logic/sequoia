// Sequoia Copyright (C) 2020  Zan Naeem, Abdulrahman Alfayad
// This program comes with ABSOLUTELY NO WARRANTY; for details see LICENSE.
// This is free software, and you are welcome to redistribute it
// under certain conditions; see LICENSE for details.


var calcTitle = ""
var calcDesc = ""

function insertTD() {
    $("#editArea").html(
        '<div class="row">'+
            '<div class="ui input">'+
                '<input id="title" type="text" placeholder="Title">'+
            '</div>'+
        '</div>'+
        '<br>'+
        '<div class="row">'+
            '<div class="ui fluid input">'+
                '<input id="description" type="text" placeholder="Description">'+
                '<button class="tiny ui button" onclick="updateTD()">'+
                    '<i class="grey check icon"></i>'+
                '</button>'+
            '</div>'+
        '</div>'
    )
    $("#title").val(calcTitle)
    $("#description").val(calcDesc)
}


function updateTD() {
    var newtitle = escape_norm($("#title").val().trim())
    var newdescription = escape_norm($("#description").val().trim())
    if (newtitle != "" && newdescription != "") {
        calcTitle = newtitle
        calcDesc = newdescription
    }
    $("#editArea").html(
        '<div id="title" class="ui middle aligned center aligned huge teal header">'+calcTitle+
            '<div id="description" class="sub header">'+calcDesc+
                '<button class="tiny ui button" onclick="insertTD()" style="margin-left: 10px;">'+
                    '<i class="grey pencil alternate icon"></i>'+
                '</button>'+
            '</div>'+
        '</div>'+
        '<br>'
    )
    $.ajax({
        url: "/sequoia/api/calculus",
        type: "PUT",
        data : {id : calc_id, title : calcTitle, description : calcDesc, function(data) {}}})
}