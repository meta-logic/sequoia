// Sequoia Copyright (C) 2020  Zan Naeem
// This program comes with ABSOLUTELY NO WARRANTY; for details type `show w'.
// This is free software, and you are welcome to redistribute it
// under certain conditions; type `show c' for details.


function addUser () {
    $("#warning").css("visibility","hidden")
    $("#p1").attr("class", "required field")
    $("#p2").attr("class", "required field")
    $("#u").attr("class", "required field")
    var username = $("#username").val().trim()
    var password1 = $("#password1").val()
    var password2 = $("#password2").val()
    var email = $("#email").val()
    var occupation = $("#occupation").val()
    if (username == "" || password1 == "" || password2 == "") {
        if (username == "") {
            $("#u").attr("class", "required field error")
        }
        if (password1 == "") {
            $("#p1").attr("class", "required field error")
        }
        if (password2 == "") {
            $("#p2").attr("class", "required field error")
        }
        return
    } else if (username.length < 8 || password1.length < 8 || password2.length < 8) {
        if (username.length < 8) {
            $("#u").attr("class", "required field error")
        }
        if (password1.length < 8 ) {
            $("#p1").attr("class", "required field error")
        }
        if (password2.length < 8) {
            $("#p2").attr("class", "required field error")
        }
        $("#warning_header").html("Username and passwords must be at least eight characters long.")
        $("#warning").css("visibility","visible")
        return
    } else {
        $.get("/sequoia/api/users/"+username, function (data, status) {
            if (data.status == "success") {
                $("#u").attr("class", "required field error")
                $("#warning_header").html("Username already exists.")
                $("#warning").css("visibility","visible")
                return
            } else {
                if (password1 != password2) {
                    $("#p1").attr("class", "required field error")
                    $("#p2").attr("class", "required field error")
                    $("#warning_header").html("Passwords are not the same.")
                    $("#warning").css("visibility","visible")
                    return
                } else {
                    $.post("/sequoia/api/user", {username : username, password : password1, 
                        email : email, occupation : occupation}, function(data, status) {
                        window.location.href = "/sequoia/login"})
                }
            }
        })
    }
    return
}