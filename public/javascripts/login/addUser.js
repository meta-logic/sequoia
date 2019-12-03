function addUser() {
    var username = document.getElementById("username").value
    var password = document.getElementById("password").value
    var email = document.getElementById("email").value
    var occupation = document.getElementById("occupation").value
    if (username != "" && password != "" && email != "" && occupation != "") {
        $.get("/api/users/"+username, function (data, status) {
            if (data.status != "success") {
                $.post("/api/user", { username : username, password : password, 
                    email : email, occupation : occupation}, function(data, status){
                    window.location.href = "/login"})
            } else {
                document.getElementById("warning").innerHTML =
                "<div class=\"ui red negative message\">"
                +"<p>Username already exists</p></div>"
            }
        })
    }
}