function addCalculus() {
    var prem = []
    var title = document.getElementById("title").value
    var description = document.getElementById("description").value

    $.post("/api/calculus", { title : title, description : description}, function(data, status){
        console.log(data)
    })
}