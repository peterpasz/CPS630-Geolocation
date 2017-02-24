var coordA = 0;
var coordB = 0;
var coordC = 0;
var coordD = 0;



/*
setTimeout("getDistance()", 500);
	self.addEventListener("message", function(event) {
		coordA = event.data.args[0];
		coordB = event.data.args[1];	
		coordC = event.data.args[2];
		coordD = event.data.args[3];	
	}, false);
*/

onmessage = function(event){
	coordA = event.data.args[0];
	coordB = event.data.args[1];	
	coordC = event.data.args[2];
	coordD = event.data.args[3];	
	getDistance();
}


function getDistance() {

	console.log(coordA);
	console.log(coordB);
	console.log(coordC);
	console.log(coordD);
	
    postMessage(haversine(coordA,coordB,coordC,coordD));
    
}

function haversine() {
       var radians = Array.prototype.map.call(arguments, function(deg) { return deg/180.0 * Math.PI; });
       var lat1 = radians[0], lon1 = radians[1], lat2 = radians[2], lon2 = radians[3];
       var R = 6372.8; // km
       var dLat = lat2 - lat1;
       var dLon = lon2 - lon1;
       var a = Math.sin(dLat / 2) * Math.sin(dLat /2) + Math.sin(dLon / 2) * Math.sin(dLon /2) * Math.cos(lat1) * Math.cos(lat2);
       var c = 2 * Math.asin(Math.sqrt(a));
       return R * c;
}
