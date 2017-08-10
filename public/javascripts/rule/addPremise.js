v = 0;
function addPremise() {
	v++;

	// getting the premise div content
	var div = document.getElementById('premise');
	// adding a premise input
	div.innerHTML = div.innerHTML + '<input type="text" id="i' + v.toString() + '" placeholder="Premise"><p style="color: white">s</p>';
}