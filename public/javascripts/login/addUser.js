function addUser() {
    var username = document.getElementById("username").value
    var password1 = document.getElementById("password1").value
    var password2 = document.getElementById("password2").value
    var email = document.getElementById("email").value
    var occupation = document.getElementById("occupation").value
    if (username != "" && password1 != "" && email != "" && occupation != "") {
        $.get("/api/users/"+username, function (data, status) {
            if (data.status != "success") {
                if (password1 == password2) {
                    $.post("/api/user", { username : username, password : password1, 
                        email : email, occupation : occupation}, function(data, status){
                        window.location.href = "/login"})
                } else {
                    document.getElementById("warning").innerHTML =
                    "<div class=\"ui red negative message\">"
                    +"<p>Passwords are not the same</p></div>"
                }
            } else {
                document.getElementById("warning").innerHTML =
                "<div class=\"ui red negative message\">"
                +"<p>Username already exists</p></div>"
            }
        })
    }
}