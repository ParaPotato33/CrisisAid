async function pageLoad() {
    const response = await fetch("tableData.json");
    var savedData = await response.json();
	var table = document.getElementById("crisisTable");

	for (var i = 0; i < savedData.crisis.length; i++) {
		var crisis = savedData.crisis[i];
		var row = table.insertRow();
		for (var j = 0; j < Object.entries(crisis).length; j++) {
			var cell = row.insertCell();
			cell.innerHTML = JSON.stringify(Object.entries(crisis)[j][1]).replace(/"+/g, "");
		}
	}
}

function newCrisis(CrisisForm) {
	var country = CrisisForm.CountryInput.value;
	CrisisForm.CountryInput.value = "";
	var table = document.getElementById("crisisTable");
	var row = table.insertRow();

	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);
	var cell3 = row.insertCell(2);
	const time = new Date();

	cell1.innerHTML = time.getHours().toString().concat(":", time.getMinutes(), ":", time.getSeconds());
	cell2.innerHTML = time.getDate().toString().concat("/", time.getMonth() + 1, "/", time.getFullYear());
	cell3.innerHTML = country;
}