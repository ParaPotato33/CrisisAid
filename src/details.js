//runs when the page is loaded
window.onload = async function() {
    //startup function
    pageload();
    //sets page size
    updateSize();
}

//function to load the page
pageload = async function() {
    //get the row number from the url
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    //get the crisis data from the json file
    var crisis = await fetch("tableData.json")
    .then(response => response.json())
    .then(data => data.crisis[urlParams.get('row')]);
    //set the crisis name
    document.getElementById("crisisName").innerHTML = "Crisis Details for " + crisis.City + " in " + crisis.Country;
    //set the crisis location on the map
    var map = document.getElementsByClassName("crisisMap")[0];
    var latitude = "-" + ((map.offsetHeight / 2) - ((crisis.Latitude * map.offsetWidth) / 360) - 50) + "px";
    var longitude = "-" + ((map.offsetWidth / 2) + ((crisis.Longitude * map.offsetWidth) / 360) - 50) + "px";
    map.style.marginTop = latitude;
    map.style.marginLeft = longitude;
    //fetch and store table data
	const response = await fetch("tableData.json")
	var savedData = await response.json();
	//get html table
	var table = document.getElementById("RequestHistory");
    //set the crisis name
	var name = crisis.City;

	//loop throught json file and add values to html table
	for (var i = 0; i < savedData.crisis.length; i++) {
		var correctCity = false;
        //check if the city is the correct one
		if (savedData.crisis[i].City == name) {
			correctCity = true;
		}
		//if the city is correct
        if (correctCity == true){
            //get the crisis data
            var crisis = savedData.crisis[i];
            //add a new row to the table
            var row = table.insertRow();
            //loop through the individual crisis entries
            var timeCell = row.insertCell();
            timeCell.innerHTML = crisis.Time;
            var dateCell = row.insertCell();
            dateCell.innerHTML = crisis.Date;
        }
	}
    extraDetailsForm(crisis);
    
}
//configures details form
async function extraDetailsForm(crisis){
    //fetch and store table data
    var existingDetails = await fetch("crisisDetails.json")
    .then(response => response.json());

    var exisits = false;
    //get length
    var index = existingDetails.details.length;
    //loop through the data
    for (var i = 0; i < existingDetails.details.length; i++) {
        if (existingDetails.details[i].City == crisis.City) {
            index = i;
            exisits = true;
        }
    }
    //if the city does not exist
    if (exisits == false) {
        existingDetails.details.push({City: crisis.City, population: "No Value Entered", RoadCondition: "No Value Entered", KnownDiseases: "No Value Entered", NearbyConflict: "No Value Entered", Priority: "No Value Entered", CommitedResources: "0"});
        var data = JSON.stringify(existingDetails);
        await fetch("crisisDetails.json", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: data,
        })
    }
    
    //get the data
    var population = existingDetails.details[index].population;
    var roadCondidions = existingDetails.details[index].RoadCondition;
    var knownDiseases = existingDetails.details[index].KnownDiseases;
    var nearbyConflict = existingDetails.details[index].NearbyConflict;
    //get the form
    var form = document.getElementById("extraDetailsForm");
    //create the form
    var priorityLabel = document.createElement("label");
    priorityLabel.innerHTML = "Priority: ";
    priorityLabel.style.fontSize = "200%";
    priorityLabel.htmlFor = "lowPriority";

    var priorityInputs = document.createElement("div");
    priorityInputs.id = "priorityInputs";

    var lowPriority = document.createElement("input");
    lowPriority.type = "button";
    lowPriority.id = "lowPriority";
    lowPriority.style.backgroundColor = "yellow";
    lowPriority.value = "Low";
    lowPriority.style.width = "20%";
    lowPriority.onclick = function() {
        selectPriority("low", index);
    }

    var mediumPriority = document.createElement("input");
    mediumPriority.type = "button";
    mediumPriority.id = "mediumPriority";
    mediumPriority.style.backgroundColor = "orange";
    mediumPriority.value = "Medium";
    mediumPriority.style.width = "20%";
    mediumPriority.onclick = function() {
        selectPriority("medium", index);
    }

    var highPriority = document.createElement("input");
    highPriority.type = "button";
    highPriority.id = "highPriority";
    highPriority.style.backgroundColor = "red";
    highPriority.value = "High";
    highPriority.style.width = "20%";
    highPriority.onclick = function() {
        selectPriority("high", index);
    }

    priorityInputs.appendChild(lowPriority);
    priorityInputs.appendChild(mediumPriority);
    priorityInputs.appendChild(highPriority);

    form.appendChild(priorityLabel);
    form.appendChild(priorityInputs);
    form.appendChild(document.createElement("br"));

    newField(form, "Population", population);
    newField(form, "Road Condition", roadCondidions);
    newField(form, "Known Diseases", knownDiseases);
    newField(form, "Nearby Conflict", nearbyConflict);

    var saveButton = document.createElement("button");
    saveButton.type = "button";
    saveButton.innerHTML = "Save";
    saveButton.style.fontSize = "200%";
    //save the data
    saveButton.onclick = async function() {
        var existingDetails = await fetch("crisisDetails.json")
        .then(response => response.json());
        existingDetails.details[index].population = document.getElementById("Population").value;
        existingDetails.details[index].RoadCondition = document.getElementById("Road Condition").value;
        existingDetails.details[index].KnownDiseases = document.getElementById("Known Diseases").value;
        existingDetails.details[index].NearbyConflict = document.getElementById("Nearby Conflict").value;
        var data = JSON.stringify(existingDetails);
        await fetch("crisisDetails.json", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: data,
        })
    }
    //add the save button
    form.appendChild(saveButton);
    //load existing data
    loadData(index);
    //add the resource input box
    document.getElementById("newSubmitButton").addEventListener("click", function() { addResources(index) });
    //add the remove button
    removeButton(index);
}
//function to select the priority
async function selectPriority(priority, index){
    var lowPriority = document.getElementById("lowPriority");
    var mediumPriority = document.getElementById("mediumPriority");
    var highPriority = document.getElementById("highPriority");

    //check which priority is selected
    if (priority == "low") {
        lowPriority.className = "selected";
        mediumPriority.className = "";
        highPriority.className = "";
    } else if (priority == "medium") {
        lowPriority.className = "";
        mediumPriority.className = "selected";
        highPriority.className = "";
    } else if (priority == "high") {
        lowPriority.className = "";
        mediumPriority.className = "";
        highPriority.className = "selected";
    }

    //fetch and store table data
    var existingDetails = await fetch("crisisDetails.json")
    .then(response => response.json());
    existingDetails.details[index].Priority = priority;

    //save the data
    var data = JSON.stringify(existingDetails);
    await fetch("crisisDetails.json", {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: data,
    })
}

//function to add field to the config form
function newField(form, dataName, existingData){
    var Label = document.createElement("label");
    Label.innerHTML = dataName + ": ";
    Label.htmlFor = dataName.toString();

    var Input = document.createElement("input");
    Input.type = "text";
    Input.id = dataName.toString();
    Input.name = dataName.toString();
    Input.placeholder = "Enter New Value";
    Input.readOnly = true;
    Input.value = existingData;

    var Edit = document.createElement("button");
    Edit.type = "button";
    Edit.innerHTML = "Edit";
    Edit.style.fontSize = "200%";
    Edit.onclick = function() {
        Input.readOnly = false;
        Input.value = "";
    }

    form.appendChild(Label);
    form.appendChild(document.createElement("br"));
    form.appendChild(Input);
    form.appendChild(Edit);
    form.appendChild(document.createElement("br"));
    form.appendChild(document.createElement("br"));
}

//function to load the existing data
async function loadData(index){
    var existingDetails = await fetch("crisisDetails.json")
    .then(response => response.json());
    document.getElementById("Population").innerHTML = existingDetails.details[0].population;
    document.getElementById("Road Condition").innerHTML = existingDetails.details[0].RoadCondition;
    document.getElementById("Known Diseases").innerHTML = existingDetails.details[0].KnownDiseases;
    document.getElementById("Nearby Conflict").innerHTML = existingDetails.details[0].NearbyConflict;
    document.getElementById("commitedResources").innerHTML = existingDetails.details[0].CommitedResources + "%";
    selectPriority(existingDetails.details[index].Priority, index);
}

//function to add resources to the commitment
async function addResources(index){
    //get input box
    var form = document.getElementById("resourceInputBox");
    //get already commited resources
    var text = document.getElementById("commitedResources").innerHTML;
    //add the new resources
    document.getElementById("commitedResources").innerHTML = parseInt(form.value) + parseInt(text.substring(0,text.length - 1)) + "%";
    //clear the input box
    form.value = "";
    //fetch and store table data
    var existingDetails = await fetch("crisisDetails.json")
    .then(response => response.json());
    //save the data
    existingDetails.details[index].CommitedResources = document.getElementById("commitedResources").innerHTML.substring(0,document.getElementById("commitedResources").innerHTML.length - 1);
    //check if the resources exceed 100%
    if (existingDetails.details[index].CommitedResources > 100) {
        alert("Resources cannot exceed 100%");
        //reset the resources
        existingDetails.details[index].CommitedResources = 100;
        document.getElementById("commitedResources").innerHTML = "100%";
    }
    //save the data
    var data = JSON.stringify(existingDetails);
    await fetch("crisisDetails.json", {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: data,
    })
    //fetch and store table data
    var crisis = await fetch("tableData.json")
    .then(response => response.json())
    //loop through the data
    for (var i = 0; i < crisis.crisis.length; i++) {
        //check if the city is the correct one
        if (crisis.crisis[i].City == existingDetails.details[index].City) {
            //update the resources
            crisis.crisis[i].Percentage = existingDetails.details[index].CommitedResources + "%";
        }
    }
    //save the data
    var data = JSON.stringify(crisis);
    await fetch("tableData.json", {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: data,
    })
}
//function to add remove button
function removeButton(index){
    //create the button
    var removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.innerHTML = "Remove Crisis";
    removeButton.style.fontSize = "200%";
    //add function to remove the crisis
    removeButton.onclick = async function() {
        //fetch and store table data
        var details = await fetch("crisisDetails.json")
        .then(response => response.json());
        //fetch and store table data
        var crisis = await fetch("tableData.json")
        .then(response => response.json())
        //check if the resources are 100%
        if (details.details[index].CommitedResources == 100){
            //loop through the data
            for (var i = crisis.crisis.length - 1; i >= 0; i--) {
                //check if the city is the correct one
                if (crisis.crisis[i].City == details.details[index].City) {
                    //remove the crisis
                    crisis.crisis.splice(i, 1);
                    //save the data
                    var data = JSON.stringify(crisis);
                    await fetch("tableData.json", {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: data,
                    })
                }
            }
            //reset commited resources
            details.details[index].CommitedResources = 0;
            //reset the priority
            details.details[index].Priority = "No Value Entered";
            //save the data
            await fetch("crisisDetails.json", {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(details),
            })
            //return to the dashboard
            location.href = "/dashboard.html";
        }
        //if the resources are not 100%
        else {
            //alert the user
            alert("Crisis resources must be 100% before it can be removed");
        }
        
    }
    //add the button
    document.getElementById("extraDetailsForm").appendChild(removeButton);
}
//function to update the size of the page
function updateSize() {
    //create scale
    var zoom = (window.innerWidth/1920);
    //set the header scale
    var header = Math.pow(zoom, -0.5);
    //scale the page
    document.getElementsByTagName("body")[0].style.zoom = zoom;
    //scale the nav bar
    document.getElementById("NavBar").style.zoom = header;
}
//add event listener to update the size
window.addEventListener('resize', updateSize);