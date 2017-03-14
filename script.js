var coordString;
var coordArray;
var userCoordArray = [0, 0];
var locationInfo;
var dropBox;

window.onload= function() {
	dropBox = document.getElementById("dropBox");
	dropBox.ondragenter = ignoreDrag;
	dropBox.ondragover = ignoreDrag;
	dropBox.ondrop = drop;
}

function ignoreDrag(e) { 
	e.stopPropagation();
	e.preventDefault();
}

function drop(e){
	e.stopPropagation();
	e.preventDefault();
	
	var data = e.dataTransfer;
	var files = data.files;

	processFiles(files);
}

function processFiles(files){
	var file = files[0];
	var textType = /text.*/;
	
	document.getElementById('locations').innerHTML = " ";
	document.getElementById('distances').innerHTML = " ";
	
	if (file.type.match(textType)) {
		var reader = new FileReader();
		reader.onload = function(e){
			coordString = reader.result;
			startWorker();
		};
		reader.readAsText(file);
	}
	else{
		document.getElementById('locations').innerHTML = "File not supported! Please submit a text file. ";
	}
}

function initMap() {
	var map = new google.maps.Map(document.getElementById('mapBoxCurrent'), {
		center: {lat: -34.397, lng: 150.644},
		zoom: 12
	});
	var infoWindow = new google.maps.InfoWindow({map: map});

	// Try HTML5 geolocation.
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
		var pos = {
			lat: position.coords.latitude,
			lng: position.coords.longitude
        };
			
		userCoordArray[0] = pos.lat;
		userCoordArray[1] = pos.lng;
		document.getElementById("userCoords").innerHTML = "{" + parseFloat(userCoordArray[0]).toFixed(4) + ", " + userCoordArray[1].toFixed(4) + "}";
		
		getUserAddress(userCoordArray[0], userCoordArray[1]);;

		infoWindow.setPosition(pos);
		infoWindow.setContent('Location found.');
		map.setCenter(pos);
		}, function() {
			handleLocationError(true, infoWindow, map.getCenter());
        });
	} 
	else {
		// Browser doesn't support Geolocation
		handleLocationError(false, infoWindow, map.getCenter());
	}
}
	  
function setUserCoords(){
	userCoordArray[0] = parseInt(document.getElementById("lat").value);
	userCoordArray[1] = parseInt(document.getElementById("lon").value);
	document.getElementById("userCoords").innerHTML = "{" + userCoordArray[0] + ", " + userCoordArray[1] + "}";

	var map = new google.maps.Map(document.getElementById('mapBoxCurrent'), {
         center: {lat: -34.397, lng: 150.644},
         zoom: 12
    });
					
	var infoWindow = new google.maps.InfoWindow({map: map});
	var pos = {
        lat: userCoordArray[0],
        lng: userCoordArray[1]
    };
									
	getUserAddress(userCoordArray[0], userCoordArray[1]);
	
    infoWindow.setPosition(pos);
    infoWindow.setContent('Location found.');
    map.setCenter(pos);
}

function getUserAddress(x, y){
	var xhttp = new XMLHttpRequest();
	var streetAddress;
	xhttp.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200) {
			locationInfo = JSON.parse(this.responseText);			
			if(typeof locationInfo.results[0]=='undefined'){				
				document.getElementById("userAddress").innerHTML = "The address of the coordinates you entered is undefined.";
			}
			streetAddress = locationInfo.results[0].formatted_address;
			document.getElementById("userAddress").innerHTML = streetAddress;
		}
	}
	xhttp.open("GET", "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + x + "," + y + "&key=AIzaSyDtXyfwXbAM54r33e6JMEaTxRYTcgWtsdw", true);
	xhttp.send();
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
	infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
		'Error: The Geolocation service failed.' :
		'Error: Your browser doesn\'t support geolocation.');
}

function startWorker() {
	var linebreak;
    if(typeof(Worker) !== "undefined") {
        if(typeof(distCalc) == "undefined") {
            distCalc = new Worker("haversine.js");
        }
        distCalc.postMessage({"args": [coordString, userCoordArray[0], userCoordArray[1]]});
		distCalc.onmessage = function(event) {	
			getFileAddress(parseFloat(event.data.args[1]), parseFloat(event.data.args[2]), 0);
			document.getElementById("distances").innerHTML += " is " + Math.floor(event.data.args[0]) + "Km away";
			linebreak = document.createElement("br");
			document.getElementById("distances").appendChild(linebreak);
        };
		
    } else {
        document.getElementById("distances").innerHTML = "Sorry! No Web Worker support.";
    }
}

function stopWorker() { 
    distCalc.terminate();
    distCalc = undefined;
}

function getFileAddress(x, y){
	var xhttp = new XMLHttpRequest();
	var streetAddress;
	var linebreak;
	
	xhttp.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200) {
			locationInfo = JSON.parse(this.responseText);			
			if(typeof locationInfo.results[0]=='undefined'){				
				document.getElementById("locations").innerHTML += "{" + x.toFixed(4) + ", " + y.toFixed(4) + "} Undefined Address.";
				linebreak = document.createElement("br");
				document.getElementById("locations").appendChild(linebreak);
			}
			console.log(locationInfo.results[0].formatted_address);
			streetAddress = locationInfo.results[0].formatted_address;
			document.getElementById("locations").innerHTML += "{" + x.toFixed(4) + ", " + y.toFixed(4) + "} " + streetAddress;
			linebreak = document.createElement("br");
			document.getElementById("locations").appendChild(linebreak);
		}
	}
	xhttp.open("GET", "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + x + "," + y + "&key=AIzaSyDtXyfwXbAM54r33e6JMEaTxRYTcgWtsdw", true);
	xhttp.send();
}