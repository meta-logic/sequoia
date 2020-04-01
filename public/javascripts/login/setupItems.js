$("#main-menu").sticky({});
var page = $("#page").text()
if (page == "fail") {
    $("#warning").css("visibility","visible")
} else if (page == "in") {
    $("#go_button").html('Let\'s Go <i class="right arrow icon"></i>')
}
