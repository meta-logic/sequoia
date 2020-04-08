// Sequoia Copyright (C) 2020  Zan Naeem
// This program comes with ABSOLUTELY NO WARRANTY; for details type `show w'.
// This is free software, and you are welcome to redistribute it
// under certain conditions; type `show c' for details.


$("#main-menu").sticky({});
var page = $("#page").text()
if (page == "fail") {
    $("#warning").css("visibility","visible")
} else if (page == "in") {
    $("#go_button").html('Let\'s Go <i class="right arrow icon"></i>')
}
