// Sequoia Copyright (C) 2020  Zan Naeem, Abdulrahman Alfayad
// This program comes with ABSOLUTELY NO WARRANTY; for details see LICENSE.
// This is free software, and you are welcome to redistribute it
// under certain conditions; see LICENSE for details.


function insertTD(title,description) {
    console.log(title)
    console.log(description)
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
                '<button class="tiny ui button" onclick="updateTD(\''+title+'\',\''+description+'\')">'+
                    '<i class="grey check icon"></i>'+
                '</button>'+
            '</div>'+
        '</div>'
    )
    $("#title").val(title)
    $("#description").val(description)
}


function updateTD(title,description) {
    var newtitle = $("#title").val().trim()
    var newdescription = $("#description").val().trim()
    if (newtitle != "" && newdescription != "") {
        title = newtitle
        description = newdescription
        $.ajax({
            url: "/sequoia/api/calculus",
            type: "PUT",
            data : { id : $("#calc_id").text(), title : title, description : description, function(data) {}}})
    }
    $("#editArea").html(
        '<div id="title" class="ui middle aligned center aligned huge teal header">'+title+
            '<div id="description" class="sub header">'+description+
                '<button class="tiny ui button" onclick="insertTD(\''+title+'\',\''+description+'\')" style="margin-left: 10px;">'+
                    '<i class="grey pencil alternate icon"></i>'+
                '</button>'+
            '</div>'+
        '</div>'+
        '<br>'
    )
}