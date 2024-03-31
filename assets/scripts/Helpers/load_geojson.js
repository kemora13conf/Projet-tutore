import config from "../Config.js";
import { map } from "../index.js";

export var markerLayer = L.markerClusterGroup({
  showCoverageOnHover: false,
  maxClusterRadius: 50,
  iconCreateFunction: function (cluster) {
    return L.divIcon({
      html: `<div>
        <span>${cluster.getChildCount()}</span>
      </div>`,
      className: "marker-cluster",
      iconSize: L.point(40, 40),
    });
  },
});
export var originalMarkerLayer = L.layerGroup();
const customIcon = L.icon({
  iconUrl: location.href + "assets/Images/pharmacy-marker.png",
  iconSize: [50, 50],
  iconAnchor: [25, 50],
  popupAnchor: [0, -50], // Anchor point for the icon (optional)
});

export default function load_geojson() {
  fetch(location.href + "rabat_pharmacies_updated.geojson")
    .then((response) => response.json())
    .then((data) => {
      let markers = L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
          return L.marker(latlng, { icon: customIcon });
        },
      });
      markerLayer.addLayer(markers);
      originalMarkerLayer.addLayer(markers);
      map.addLayer(markerLayer);

      addEventsToMarkers();
    })
    .catch((error) => {
      console.error("Error loading GeoJSON:", error);
    });
}

function addEventsToMarkers() {
  markerLayer.eachLayer((marker) => {
    marker.on("click", function (e) {
      let popup = L.popup()
        .setLatLng(e.latlng)
        .setContent(
          `<div>
            <h3>${e.feature?.properties.nom}</h3>
            <p>${e.feature?.properties.adresse}</p>
            <p>${e.feature?.properties.telephone}</p>
          </div>`
        );
    });
  });
}
