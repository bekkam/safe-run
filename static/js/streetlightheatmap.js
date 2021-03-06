"user strict";

var heatmap;
var latLngs = [];

function generateHeatMap(evt) {
    // Make the query string for SODA API
    url = "https://data.sfgov.org/resource/vw6y-z8j6.json?"
          +"category=Streetlights"
          +"&Status=Open"

    // Get data, and lat/long to latLngs array
    $.getJSON(url, function(data) {
        $.each(data, function(i, entry) {
            latLngs.push(new google.maps.LatLng(parseFloat(entry.point.latitude), 
                                                parseFloat(entry.point.longitude)));
        });
        heatmap = new google.maps.visualization.HeatmapLayer({
            data: latLngs,
            map: map
        });
    });
}

function toggleHeatMap(evt){
    if ($("#heatmap").prop("checked")) {
        generateHeatMap();
    } else {
        heatmap.setMap(null);
    }
}

$("#heatmap").on("change", toggleHeatMap);
