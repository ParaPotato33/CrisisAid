window.onload = async function() {
    pageload();
}
//function to load the page
pageload = async function() {
    //fetch and store table data
    var savedData = await fetch("tableData.json")
    .then(response => response.json())
    //loop through the crisis data
    for (i = 0; i < savedData.crisis.length; i++) {
        //get the map and calculate the position of the marker
        var map = document.getElementsByClassName("map")[0];
        var latitude = ((map.offsetHeight / 2) - ((savedData.crisis[i].Latitude * map.offsetWidth) / 360) - 40) + "px";
        var longitude = ((map.offsetWidth / 2) + ((savedData.crisis[i].Longitude * map.offsetWidth) / 360) - 20) + "px";
        //create a new marker
        var marker = document.createElement("input");
        marker.type = "image";
        marker.className = "marker";
        marker.id = i;
        //set the marker image and onclick function
        marker.src = "https://www.pngall.com/wp-content/uploads/2017/05/Map-Marker-PNG-File.png";
        marker.onclick = function() {
            //function to change the page to the crisis details page
            cisisDetails(this.id);
        }
        //set the position of the marker
        marker.style.top = latitude;
        marker.style.left = longitude;
        //add the marker to the map
        document.getElementsByClassName("completeMap")[0].appendChild(marker);
    }
}
//function to change the page to the crisis details page
function cisisDetails(row) {
    //change the page to the crisis details page
    location.href = "/crisisDetails.html?row=" + row;
}