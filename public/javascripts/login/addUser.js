
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
    if (username != "" && password1 != "" && password2 != "") {
        $.get("/api/users/"+username, function (data, status) {
            if (data.status != "success") {
                if (password1 == password2) {
                    $.post("/api/user", {username : username, password : password1, 
                        email : email, occupation : occupation}, function(data, status) {
                        window.location.href = "/login"})
                } else {
                    $("#p1").attr("class", "required field error")
                    $("#p2").attr("class", "required field error")
                    $("#warning_header").html("Passwords are not the same.")
                    $("#warning").css("visibility","visible")
                    return
                }
            } else {
                $("#u").attr("class", "required field error")
                $("#warning_header").html("Username already exists.")
                $("#warning").css("visibility","visible")
                return
            }
        })
    }
}