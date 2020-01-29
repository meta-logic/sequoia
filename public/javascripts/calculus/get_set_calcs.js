var c = 0

function get_calculi_toPage() {
    var calculi_container = document.getElementById("calculi")
    for (i = 0; i < c; i++) {
        entry = document.getElementById("calc_card"+i)
        if (entry != null) {
            entry.remove()
        }
    }
    var user_id = document.getElementById("user_id").innerHTML
    $.get("/api/calculi/"+user_id, function (calcs, status) {
        var calculi = calcs.calculi
        for (var i = 0; i < calculi.length; i++) {
            calculi_container.innerHTML +=
            '<div id="calc_card'+i+'" class="card">'
                +'<a class="content" href=calculus/'+calculi[i]._id+'>'
                    +'<div class="header">'+calculi[i].title+'</div>'
                    +'<div class="description">'+calculi[i].description+'</div>'
                +'</a>'
                +'<div class="ui red bottom attached button" onClick=deleteCalculus("'+calculi[i]._id+'")>'
                    +'<i class="close icon"></i>Delete'
                +'</div>'
            +'</div>'
            }
        MathJax.Hub.Queue(["Typeset",MathJax.Hub,calculi_container])
        c = calculi.length
    })
}

function addCalculus() {
    var title = document.getElementById("title").value
    var description = document.getElementById("description").value
    var user_id = document.getElementById("user_id").innerHTML
    if (title != "" && description != "") {
        $.post("/api/calculus", {title : title, description : description, user : user_id}, function(data, status){
            document.getElementById("title").value = ""
            document.getElementById("description").value = ""
            get_calculi_toPage()
        }
    )}
}

function addSomeCalculus(sample) {
    var title = document.getElementById("title").value
    var description = document.getElementById("description").value
    var user_id = document.getElementById("user_id").innerHTML
    var the_symbols = []
    var the_rules = []
    $.post("/api/calculus", {title : sample, description : "This is a sample calculus with some basic rules. Try it out!", user : user_id}, function(data, status){
        syms_rules = sample_calc(sample, data.calculus)
        $.post("/api/symbols_init", {items : JSON.stringify(syms_rules[0])}, function(data, status){
            $.post("/api/rules_init", {items : JSON.stringify(syms_rules[1])}, function(data, status){
                document.getElementById("title").value = ""
                document.getElementById("description").value = ""
                get_calculi_toPage()
            })
        })
    })
}

function deleteCalculus(id) {
    $('#modal1').modal({
        onApprove: function(){
            $.ajax({
                url: "/api/calculus",
                type: "DELETE",
                data : { "id" : id },
                success: function(result) {
                    get_calculi_toPage()
                    console.log("Calculus sucessfully deleted.")
                },
                error: function(result) {
                    console.log("ERROR: Calculus could not be deleted.")
                }
            })
        }
    })
    .modal('setting', 'closable', false)
    .modal('show')

    
}
