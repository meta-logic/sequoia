// Sequoia Copyright (C) 2020  Zan Naeem
// This program comes with ABSOLUTELY NO WARRANTY; for details see LICENSE.
// This is free software, and you are welcome to redistribute it
// under certain conditions; see LICENSE for details.


$("#main-menu").sticky({});
if ($("#page").text() == "fail") {
    $("#warning").css("visibility", "visible")
} else if (page == "in") {
    $("#go_button").html('Let\'s Go <i class="right arrow icon"></i>')
}
