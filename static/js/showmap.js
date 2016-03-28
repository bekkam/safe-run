"use strict";

var directionsDisplay;
var directionsService;
var map;
var totalDistance;
var newRoute;
var waypoints;
var poly;

function updateMap() {


  var startLat = $('#start-lat-field').data('startlat');
  var startLong = $('#start-long-field').data('startlong');

  var endLat = $('#end-lat-field').data('endlat');
  var endLong = $('#end-long-field').data('endlong');

   directionsService = new google.maps.DirectionsService();

   $("#right-panel").empty();
   map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: {lat: startLat, lng: startLong}, 
        styles: MAPSTYLES
    });

   directionsDisplay = new google.maps.DirectionsRenderer({
        draggable: true,
        map:map,
        panel: document.getElementById('right-panel')
    });

    directionsDisplay.addListener('directions_changed', function() {
        calculateTotalDistanceInKilometers(directionsDisplay.getDirections());
        // everytime the directions change (including user dragging), update the polyline
        setPolyline(directionsDisplay.getDirections());
        setCustomDirections(directionsDisplay.getDirections());
        // getWaypoints(directionsDisplay.getDirections());
        // drawCustomPolyline(directionsDisplay.getDirections());
    });
    

    displayRoute({lat: startLat, lng: startLong }, {lat: endLat, lng: endLong }, directionsService, directionsDisplay)

}


function displayRoute(origin, destination, service, display){

    service.route({
      origin: origin,
      destination: destination,
      travelMode: google.maps.TravelMode.WALKING,
      avoidTolls: true
    }, function(response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        // debugging: log the response object
        console.log(response.routes[0]);
        directionsDisplay.setDirections(response);  
        calculateTotalDistanceInKilometers(response);
      } else {
        alert('Could not display directions due to: ' + status);
      }
    });
}

//UTILITY METHOD TO CALC ROUTE DISTANCE IN KM
function calculateTotalDistanceInKilometers(response) { 

  // get route data needed for db: total distance:
  totalDistance = 0;
  var currentRoute = response.routes[0];
  // for every leg of route, get the leg's distance, and add it to totalDistance
  for (var i = 0; i < currentRoute.legs.length; i++) {
    totalDistance += currentRoute.legs[i].distance.value;
  }
  //because distance.value contains value expressed in meters, convert meters to kilometers
  totalDistance = totalDistance/1000;
  //set the value of the total-distance field in the form

  $("#total-distance-field1").val(totalDistance);
  $("#total-distance-field2").val(totalDistance);

}


// ############ new code to test polyline creation & retrieval
function setPolyline(response) {
  poly = response.routes[0]["overview_polyline"];
  // console.log("setPolyline function:");
  // console.log(poly);

  $("#overview-polyline-field1").val(poly);
  $("#overview-polyline-field2").val(poly);

}


// ############ new code to refactor saving custom directions####

function setCustomDirections(response) {

  console.log("response.routes[0].legs is ");
  console.log(response.routes[0].legs);

  // Save the route legs
  var directionsRouteLegs = response.routes[0].legs;
  console.log(directionsRouteLegs);
  console.log("directionsRouteLegs[0] is ");
  console.log(directionsRouteLegs[0]);

  // Save start and end addresses attributes of the leg
  var endAddress = directionsRouteLegs[0].end_address;
  var startAddress = directionsRouteLegs[0].start_address;

  // Create stepInstructionsArray and stepDistanceArray, to store the
  // instructions attribute and distance for each step of the route leg
  var stepInstructionsArray = [];
  var stepDistanceArray = [];

  var j;
  for (j = 0; j < directionsRouteLegs[0].steps.length; j++) {
    stepInstructionsArray.push(directionsRouteLegs[0].steps[j].instructions);
    stepDistanceArray.push(directionsRouteLegs[0].steps[j].distance.text);
  }
  console.log(stepDistanceArray);

  $("#directions-text-field1").val(stepInstructionsArray);
  $("#directions-distance-field1").val(stepDistanceArray);

}

//  ##############################################


// Utility method to confirm accuracy of polyline encoding/decoding 
// function getWaypoints(response) {
//   var overviewPath = response.routes[0]["overview_path"];
//   console.log(overviewPath);
//   var waypoints = JSON.stringify(overviewPath);
//   // console.log(JSON.stringify(overviewPath));
//   console.log("waypoints are:");
//   console.log(waypoints);
//   // var latLongString = waypoints.substring(1, (waypoints.length - 1));  
//   // console.log(latLongString);
//   // console.log(latLongString.split("}"))
//   // console.log(typeof(waypoints));
//   // drawCustomPolyline2(waypoints);

// }

// function drawCustomPolyline(response) {
//     alert("drawCustomPolyline function called");
//     var polyline = new google.maps.Polyline({
//         path: [],
//         strokeColor: '#FF0000',
//         strokeWeight: 3
//     });
//     var bounds = new google.maps.LatLngBounds();

//     var i = 0;
//     var j = 0;
//     var k = 0;
//     var legs = response.routes[0].legs;
//     for (i=0;i<legs.length;i++) {
//           var steps = legs[i].steps;
//           for (j=0;j<steps.length;j++) {
//               var nextSegment = steps[j].path;
//               console.log(nextSegment);
//               for (k=0;k<nextSegment.length;k++) {
//                   polyline.getPath().push(nextSegment[k]);
//                   console.log(nextSegment[k]);
//                   bounds.extend(nextSegment[k]);
//               }
//           }
//     }
//     // console.log("custom polyline is:");
//     // console.log(polyline);
//     polyline.setMap(map);
//     map.fitBounds(bounds);

//     // console.log(JSON.stringify(polyline));
//     // polylineJson = JSON.stringify(polyline);
//     // console.log("polylineJson is ");
//     // console.log(polylineJson);
// }

// function drawCustomPolyline2() {
//   alert("drawCustomPolylineTWO in showmap function called");

//   function drawPolyline() {
//       var polyline = new google.maps.Polyline({
//           path: [],
//           strokeColor: '#FF0000',
//           strokeWeight: 3
//       });

//   }

// }
