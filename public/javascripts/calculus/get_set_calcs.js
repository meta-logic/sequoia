var c = 0

function addCalculus() {
    var title = document.getElementById("title").value
    var description = document.getElementById("description").value
    $.post("/api/calculus", { title : title, description : description}, function(data, status){
        get_calculi_toPage()
    })
}

function get_calculi_toPage() {
    var calculi_container = document.getElementById("calculi")
    for (i = 0; i < c; i++) {
        entry = document.getElementById("calc_card"+i)
        if (entry != null) {
            entry.remove()
        }
    }
    $.get("/api/get-calculi", function (calculi, status) {
        for (var i = 0; i < calculi.length; i++) {
            var temp = "'" + calculi[i]._id + "'"
            calculi_container.innerHTML += "<div id=\"calc_card"+ i +"\" class=\"four wide column\"><div class=\"ui card\" id=\"c"+ i +"\"></div></div>"
            var calc_container = document.getElementById(("c" + i))
            calc_container.innerHTML = calculi[i].title 
            + "<br><br><div class=\"extra content\"><div class=\"ui two buttons\"><a class=\"ui green button\" onClick=\"onClick=\"goToCalculus("+ temp +")\">GO</a><a class=\"ui red button\" onClick=\"deleteCalculus("+ temp +")\">Delete</a></div></div>"
        }
        MathJax.Hub.Queue(["Typeset",MathJax.Hub,calculi_container])
        c = calculi.length
    })
}

function deleteCalculus(id) {
    $.ajax({
        url: "/api/calculus",
        type: "DELETE",
        data : { "id" : id },
        success: function(result) {
            get_calculi_toPage()
            console.log("Calc sucessfully deleted.")
            
        },
        error: function(result) {
            console.log("ERROR: Calc could not be deleted.")
        }
    })
}

function goToCalculus(id) {return}
