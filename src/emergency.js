//function to sleep
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

//function to format date and time
function formatDate(value) {
	//make sure all numbers are two digits
	return ("0" + (value)).slice(-2);
}

async function newCrisis() {
    //fetch and store table data

    var crisisCountry = await fetch("https://ipinfo.io/json", {
        method: "GET",
        headers: {"Content-type": "application/json; charset=UTF-8"}
    }).then(response => response.json())
    .then(region => region.region);
	//get the current position
	navigator.geolocation.getCurrentPosition(success);
}
//function if position is found
async function success(pos) {
	//get the current coordinates
	var crd = pos.coords;
	//fetch and store table data
	var response = await fetch("tableData.json")
	var savedData = await response.json();
	//get the current time
    const time = new Date();
    //get the country of the user
    var url = 'https://api.bigdatacloud.net/data/reverse-geocode-client?latitude='.concat(crd.latitude, '&longitude=', crd.longitude, '&localityLanguage=en');
	var response = await fetch(url);
	var crisisCountry = await response.json();
	//format the time and date
	var crisisTime = time.getHours().toString().concat(":", formatDate(time.getMinutes()), ":", formatDate(time.getSeconds()));
    var crisisDate = time.getDate().toString().concat("/", formatDate((time.getMonth() + 1)), "/", time.getFullYear());
	//create the crisis data
	var crisisData = {Time: crisisTime, Date: crisisDate, City: crisisCountry.city, Country: crisisCountry.countryCode, Percentage: "0%", Requests: 1, Latitude: crd.latitude, Longitude: crd.longitude};
    savedData.crisis.push(crisisData);

    //stringify data back to json format
	const jsonString = JSON.stringify(savedData);
	await fetch("./tableData.json", {
		method: "PUT",
		body: jsonString,
		headers: {"Content-type": "application/json; charset=UTF-8"}
	})
}
//function to add a new crisis to the table
document.addEventListener("DOMContentLoaded", () => {
	const button = document.getElementById("emergencyButton");
	if (button) {
		button.addEventListener("click", function() { newCrisis(document.getElementById("addCrisisForm")); });
	}
});