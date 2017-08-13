v = 0;
function addPremise() {
	v++;

	// getting the premise div content
	var div = document.getElementById('premise');
	// adding a premise input
	div.innerHTML = div.innerHTML + '<input type="text" id="i' + v.toString() + '" placeholder="Premise"><button onclick="addPremise()" class="ui circular icon button green"><i class="icon add"></i></button><p style="color: white">s</p>';
}