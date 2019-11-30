function addUser() {
    var username = document.getElementById("username").value
    var password = document.getElementById("password").value
    if (username != "" && password != "") {
        $.post("/api/user", { username : username, password : password}, function(data, status){
            window.location.href = "/login"
        }
    )}
}