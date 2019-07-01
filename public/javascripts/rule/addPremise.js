var v = 0
function addPremise() {
    var premises = ""
    var value = ""
    v++
    // getting the premise div content
    var div = document.getElementById("premise")
    // adding a premise input
    for (var i = 0; i < v; i++) {
        value = document.getElementById("i" + i.toString()).value
        premises += "<input type=\"text\" id=\"i" + i.toString() + "\" placeholder=\"Premise\" value=\""+ value +"\"><button onclick=\"removePremise(" + i.toString()+ ")\" class=\"ui circular icon button\"><i class=\"icon close\"></i></button><p style=\"color: white\">s</p>"
    }
    premises += "<input type=\"text\" id=\"i" + v.toString() + "\" placeholder=\"Premise\"><button onclick=\"addPremise()\" class=\"ui circular icon button green\"><i class=\"icon add\"></i></button><p style=\"color: white\">s</p>"
    div.innerHTML = premises
}

function removePremise(index) {
    var premises = ""
    var value = ""
    // getting the premise div content
    var div = document.getElementById("premise")
    // adding a premise input
    for (var i = 0; i < index; i++) {
        value = document.getElementById("i" + i.toString()).value
        premises += "<input type=\"text\" id=\"i" + i.toString() + "\" placeholder=\"Premise\" value=\""+ value +"\"><button onclick=\"removePremise(" + i.toString()+ ")\" class=\"ui circular icon button\"><i class=\"icon close\"></i></button><p style=\"color: white\">s</p>"
    }

    for (i = index + 1; i < v; i++) {
        value = document.getElementById("i" + i.toString()).value
        premises += "<input type=\"text\" id=\"i" + (i-1).toString() + "\" placeholder=\"Premise\" value=\""+ value +"\"><button onclick=\"removePremise(" + (i-1).toString()+ ")\" class=\"ui circular icon button\"><i class=\"icon close\"></i></button><p style=\"color: white\">s</p>"
    }
    value = document.getElementById("i" + v.toString()).value
    v--
    premises += "<input type=\"text\" id=\"i" + v.toString() + "\" placeholder=\"Premise\" value=\""+ value +"\"><button onclick=\"addPremise()\" class=\"ui circular icon button green\"><i class=\"icon add\"></i></button><p style=\"color: white\">s</p>"
    div.innerHTML = premises
} 
