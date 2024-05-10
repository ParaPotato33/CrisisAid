//Run on page load
//Loads saved table data
window.onload = async function() {
	pageLoad();
};
pageLoad = async function() {
	//fetch and store table data
	const response = await fetch("tableData.json")
	var savedData = await response.json();
	//get html table
	var table = document.getElementById("crisisTable");

	//loop throught json file and add values to html table
	for (var i = 0; i < savedData.crisis.length; i++) {
		//get the crisis data
		var crisis = savedData.crisis[i];
		//add a new row to the table
		var row = table.insertRow();
		//loop through the individual crisis entries
		for (var j = 0; j < Object.entries(crisis).length; j++) {
			//add a new cell to the row
			var cell = row.insertCell();
			//add data to the cell while formating it correctly
			cell.innerHTML = JSON.stringify(Object.entries(crisis)[j][1]).replace(/"+/g, "");
		}
		var cell = row.insertCell();
		addCompleteButton(cell);
	}
}

function addCompleteButton(cell) {
	var completeButton = document.createElement("button");
		completeButton.innerHTML = "Complete";
		completeButton.id = "completeButton";
		completeButton.onclick = async function() {
			//delete row
			console.log(this.parentNode.parentNode.rowIndex);
			await saveTable(this.parentNode.parentNode.rowIndex, "remove");
			this.parentNode.parentNode.remove();
		}
		cell.appendChild(completeButton);
}


//save new data to json file
async function saveTable(rowNum, action) {
	
	//fetch and store table data
	const response = await fetch("tableData.json")
	var savedData = await response.json();
	//get html table
	var table = document.getElementById("crisisTable");
	
	//create base for new crisis
	if (action == "add") {
		var newCrisisData = "{";
		//loop through new crisis and record data
		for (var i = 0; i < table.rows[rowNum].cells.length - 1; i++) {
			//get name of collumn
			var collName = table.rows[0].cells[i].innerHTML;
			//get data in respective row and collumn
			var data = table.rows[rowNum].cells[i].innerHTML;
			//add to base new crisis
			newCrisisData = newCrisisData.concat(JSON.stringify(collName), ":", JSON.stringify(data), ",");
		}
		//further format data
		newCrisisData = newCrisisData.slice(0, newCrisisData.length - 1) + "}";
		//parse saved data into an object then push to json data
		savedData.crisis.push(JSON.parse(newCrisisData));
	}
	//delete data from json file
	else if (action == "remove") {
		savedData.crisis.splice(rowNum - 1, 1);
	}
	console.log(savedData);
	//stringify data back to json format
	const jsonString = JSON.stringify(savedData);
	await fetch("./tableData.json", {
		method: "PUT",
		body: jsonString,
		headers: {"Content-type": "application/json; charset=UTF-8"}
	})
}

//function to format date and time
function formatDate(value) {
	//make sure all numbers are two digits
	return ("0" + (value)).slice(-2);
}

//function to add a new crisis to the table

async function newCrisis(CrisisForm) {
	//get value from text box
	var country = CrisisForm.CountryInput.value;
	//get city from text box
	var city = CrisisForm.CityInput.value;
	//clear text box
	CrisisForm.CountryInput.value = "";
	//clear text box
	CrisisForm.CityInput.value = "";
	//get table from html
	var table = document.getElementById("crisisTable");
	//add a new row
	var row = table.insertRow();

	//add new cells to the rows
	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);
	var cell3 = row.insertCell(2);
	var cell4 = row.insertCell(3);
	var cell5 = row.insertCell(4);

	//create date object
	const time = new Date();

	//fill first cell with time
	cell1.innerHTML = time.getHours().toString().concat(":", formatDate(time.getMinutes()), ":", formatDate(time.getSeconds()));
	//fill second cell with date
	cell2.innerHTML = time.getDate().toString().concat("/", formatDate((time.getMonth() + 1)), "/", time.getFullYear());
	//fill third cell with entered city
	cell3.innerHTML = city;
	//fill third cell with entered country
	cell4.innerHTML = country;
	//add delete button to last cell
	addCompleteButton(cell5);
	//call function to save the new data to json file
	await saveTable(table.rows.length - 1, "add");
}

document.addEventListener("DOMContentLoaded", () => {
	const button = document.getElementById("newSubmitButton");
	if (button) {
		button.addEventListener("click", function() { newCrisis(document.getElementById("addCrisisForm")); });
	}
});