async function pageLoad() {
    const response = await fetch("tableData.json");
    const savedData = await response.json();

    alert(JSON.stringify(savedData));
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