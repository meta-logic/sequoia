function deleteRule (id) {
	console.log(id);
	$.ajax({
	    url: '/api/rule',
	    type: 'DELETE',
	    data : { 'id' : id },
	    success: function(result) {
	        console.log(result);
	    }
	});
}