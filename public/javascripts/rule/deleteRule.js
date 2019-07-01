function deleteRule (id) {
    console.log(id)
    $.ajax({
        url: "/api/rule",
        type: "DELETE",
        data : { "id" : id },
        success: function(result) {
            console.log("Rule sucessfully deleted.")
            console.log(result)
        },
        error: function(result) {
            console.log("ERROR: rule could not be deleted.")
            console.log(result)
        }
    })
}
