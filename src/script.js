//Run on page load
//Loads saved table data
window.onload = async function() {
	pageLoad();
	updateSize();
};
pageLoad = async function() {
	//fetch and store table data
	const response = await fetch("tableData.json")
	var savedData = await response.json();
	//get html table
	var table = document.getElementById("crisisTable");

	var names = new Array();

	//loop throught json file and add values to html table
	for (var i = 0; i < savedData.crisis.length; i++) {
		var repeats = false;
		for (var k = 0; k < names.length; k++) {
			if (names[k] == savedData.crisis[i].City) {
				table.rows[k + 1].cells[4].innerHTML = parseInt(table.rows[k + 1].cells[4].innerHTML) + 1;
				repeats = true;
			}
		}
		
		if (repeats == false) {
			//get the crisis data
			var crisis = savedData.crisis[i];
			//add a new row to the table
			var row = table.insertRow();
			//loop through the individual crisis entries
			for (var j = 1; j < Object.entries(crisis).length - 3; j++) {
				//add a new cell to the row
				var cell = row.insertCell();
				//add data to the cell while formating it correctly
				cell.innerHTML = JSON.stringify(Object.entries(crisis)[j][1]).replace(/"+/g, "");
			}
			var cell = row.insertCell();
			cell.innerHTML = 1;
			var cell = row.insertCell();
			addDetailsButton(cell, i);
			names.push(savedData.crisis[i].City);
		}
	}
}

function addDetailsButton(cell, i) {
	var completeButton = document.createElement("button");
		completeButton.innerHTML = "Details";
		completeButton.id = "detailsButton";
		completeButton.onclick = async function() {
			location.href = "/crisisDetails.html?row="	+ i;
			//delete row
			console.log(this.parentNode.parentNode.rowIndex);
		}
		cell.appendChild(completeButton);
}


//save new data to json file
async function saveTable(newTime, rowNum, action) {
	
	//fetch and store table data
	const response = await fetch("tableData.json")
	var savedData = await response.json();
	//get html table
	var table = document.getElementById("crisisTable");
	
	//create base for new crisis
	if (action == "add") {
		var newCrisisData = "{\"Time\":\"" + newTime + "\",";
		//loop through new crisis and record data
		for (var i = 0; i < table.rows[rowNum].cells.length - 1; i++) {
			//get name of collumn
			var collName = table.rows[0].cells[i].innerHTML;
			//get data in respective row and collumn
			var data = table.rows[rowNum].cells[i].innerHTML;
			//add to base new crisis
			newCrisisData = newCrisisData.concat(JSON.stringify(collName), ":", JSON.stringify(data), ",");
		}
		var url = "https://nominatim.openstreetmap.org/search?q=" +  table.rows[rowNum].cells[2].innerHTML + "&format=json";
		var data = await fetch(url)
		.then(response => response.json())
		newCrisisData = newCrisisData.concat(JSON.stringify("Latitude"), ":", JSON.stringify(data[0].lat), ",", JSON.stringify("Longitude"), ":", JSON.stringify(data[0].lon), ",");
		//further format data
		newCrisisData = newCrisisData.slice(0, newCrisisData.length - 1) + "}";
		//parse saved data into an object then push to json data
		savedData.crisis.push(JSON.parse(newCrisisData));
	}
	//delete data from json file
	else if (action == "remove") {
		savedData.crisis.splice(rowNum - 1, 1);
	}
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
	//var cell1 = row.insertCell(0);
	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);
	var cell3 = row.insertCell(2);
	var cell4 = row.insertCell(3);
	var cell5 = row.insertCell(4);
	var cell6 = row.insertCell(5);

	//create date object
	const time = new Date();

	//fill first cell with time
	newTime = time.getHours().toString().concat(":", formatDate(time.getMinutes()), ":", formatDate(time.getSeconds()));
	//fill second cell with date
	cell1.innerHTML = time.getDate().toString().concat("/", formatDate((time.getMonth() + 1)), "/", time.getFullYear());
	//fill third cell with entered city
	cell2.innerHTML = city;
	//fill third cell with entered country
	cell3.innerHTML = country;
	//add percentage
	var data = await fetch("crisisDetails.json")
	.then(response => response.json())
	for (var i = 0; i < data.details.length; i++) {
		if (data.details[i].City == city) {
			var percentage = data.details[i].CommitedResources;
		}
	}
	cell4.innerHTML = percentage + "%";
	//add requests
	cell5.innerHTML = 1;
	//add delete button to last cell
	addDetailsButton(cell6);
	//call function to save the new data to json file
	await saveTable(newTime, table.rows.length - 1, "add");
	window.location.reload();
}

function updateSize() {
    var scale = (window.innerWidth/1920) * 2;
    var right = (35 * scale) + "px";
    var zoom = (window.innerWidth/1920);
    var header = Math.pow(zoom, -0.5);
    document.getElementsByTagName("body")[0].style.zoom = zoom;
    document.getElementById("NavBar").style.zoom = header;
}

window.addEventListener('resize', updateSize);

document.addEventListener("DOMContentLoaded", () => {
	const button = document.getElementById("newSubmitButton");
	if (button) {
		button.addEventListener("click", function() { newCrisis(document.getElementById("addCrisisForm")); });
	}
});