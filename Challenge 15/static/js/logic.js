var map = L.map('map').setView([20, 0], 2);  // Centered at lat=20, lon=0, zoom level 2

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
}).addTo(map);

// URL for the earthquake JSON data
const earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Fetch the data from the URL
fetch(earthquakeUrl)
    .then(response => response.json())  // Convert the response to JSON
    .then(data => {
        // Extract the relevant data from the JSON
        data.features.forEach(earthquake => {
            let coordinates = earthquake.geometry.coordinates;
            let lon = coordinates[0];
            let lat = coordinates[1];
            let depth = coordinates[2];
            let mag = earthquake.properties.mag;
            let place = earthquake.properties.place;

            // Create a circle marker for each earthquake
            var marker = L.circleMarker([lat, lon], {
                radius: getRadius(mag),
                fillColor: getColor(depth),
                color: '#000',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            }).addTo(map);

            // Add a popup to each marker
            marker.bindPopup(`<b>Location:</b> ${place}<br><b>Magnitude:</b> ${mag}<br><b>Depth:</b> ${depth} km`);
        });
    })
    .catch(error => {
        console.error('Error fetching the earthquake data:', error);
    });

// Function to determine marker color based on depth
    function getColor(depth) {
    return depth > 20 ? '#800026' :
           depth > 10 ? '#BD0026' :
           depth > 5  ? '#E31A1C' :
           depth > 1  ? '#FC4E2A' :
                        '#FFEDA0';
}

// Function to determine marker size based on magnitude
    function getRadius(mag) {
    return mag * 3;  // Adjust this scaling factor as needed
}

// Create a new Leaflet control for the legend
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        depths = [0, 1, 5, 10, 20];  // Depth intervals

    // Title for the legend
    div.innerHTML += '<strong>Depth (km)</strong><br>';

    // Loop through the depth intervals and generate a label with a colored square
    for (var i = 0; i < depths.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(depths[i] + 1) + '; width: 20px; height: 20px; display: inline-block;"></i> ' +
            depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km<br>' : '+ km');
    }

    return div;
};

// Add the legend to the map
legend.addTo(map);
