var coordString = "hello";
var coordInt;
var coordArray;
var pointArray = [];
var userCoordArray = [0, 0];
var locationInfo;
var coordString;
var fileInput = document.getElementById('fileInput');


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
	/*
	if (file.type.match(textType)) {
		var reader = new FileReader();

		reader.onload = function(e) {
			coordString = reader.result;
			console.log(coordString);
			coordArray = coordString.split('\n');
					
			pointArray[0] = [coordArray[0], coordArray[1]];
			console.log(pointArray[0]);
			fileDisplayArea.innerHTML = "The coordinates you have entered are {"+ coordString + "}";	
		}
		reader.readAsText(file);	
	} 
	else {
		fileDisplayArea.innerText = "File not supported!";
	}
	*/
}

function processFiles(files){
	var file = files[0];
	var textType = /text.*/;
	
	if (file.type.match(textType)) {
		var reader = new FileReader();
		reader.onload = function(e){
			coordString = reader.result;
			fileDisplayArea.innerHTML = "The coordinates you have entered are (" + coordString + ")";
		};
		reader.readAsText(file);
	}
	else{
		document.getElementById('fileDisplayArea').innerHTML = "File not supported! Please submit a text file. ";
	}
}

function initMap() {
        var map = new google.maps.Map(document.getElementById('mapBoxCurrent'), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 6
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
			document.getElementById("userCoords").innerHTML = "Your current coordinates are {" + userCoordArray[0] + ", " + userCoordArray[1] + "}";
			
			/*  */
				var xhttp = new XMLHttpRequest();
				xhttp.onreadystatechange = function() {
					if(this.readyState == 4 && this.status == 200) {
						locationInfo = JSON.parse(this.responseText);						
						document.getElementById("userAddress").innerHTML = "Your current address is " + locationInfo.results[0].formatted_address;
						console.log(locationInfo.results[0].formatted_address);
					}
				}
				xhttp.open("GET", "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + userCoordArray[0] + "," + userCoordArray[1] + "&key=AIzaSyDtXyfwXbAM54r33e6JMEaTxRYTcgWtsdw", true);
	
				xhttp.send();

			/*  */
			
            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            map.setCenter(pos);
          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }
      }

      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
      }
	  
function startWorker() {
    if(typeof(Worker) !== "undefined") {
        if(typeof(distCalc) == "undefined") {
            distCalc = new Worker("haversine.js");
        }
        distCalc.postMessage({"args": [0, 0, userCoordArray[0], userCoordArray[1]]});
		distCalc.onmessage = function(event) {
            document.getElementById("result").innerHTML = event.data;
        };
		
    } else {
        document.getElementById("result").innerHTML = "Sorry! No Web Worker support.";
    }
}

function stopWorker() { 
    distCalc.terminate();
    distCalc = undefined;
}
