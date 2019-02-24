var popups = [
	{ latlon: [40.747994, -73.995408], type: "fun", text: "30% off for New Customers" },
	{ latlon: [40.748774, -73.986825], type: "food", text: "$1 Pizza after 3pm" },
	{ latlon: [40.705324, -73.945627], type: "food", text: "$10 off for New Customers" },
	{ latlon: [40.724060, -73.943567], type: "food", text: "$10 all you can eat" },
	{ latlon: [40.747733, -73.922281], type: "food", text: "20% off for New Customers" },
	{ latlon: [40.709228, -73.915758], type: "beauty", text: "35% off for New Customers" },
	{ latlon: [40.686843, -73.987512], type: "fun", text: "$5 off for New Customers" },
	{ latlon: [40.686843, -73.987512], type: "beauty", text: "30% off for New Customers" },
	{ latlon: [40.677470, -73.977496], type: "beauty", text: "1st time free" },
	{ latlon: [40.683979, -73.931491], type: "fun", text: "Buy 1 Get 1 Free" },
	{ latlon: [40.668096, -73.933894], type: "beauty", text: "26% off for New Customers" },
	{ latlon: [40.668096, -73.933894], type: "food", text: "30% off for New Customers" },
	{ latlon: [40.806750, -73.954493], type: "food", text: "10% off for New Customers" },
	{ latlon: [40.802332, -73.943164], type: "other", text: "30% off for New Customers" },
	{ latlon: [40.762297, -73.920161], type: "fun", text: "$7 off for New Customers" },
	{ latlon: [40.717815, -73.999872], type: "fun", text: "2% off for New Customers" },
	{ latlon: [40.719377, -73.957986], type: "food", text: "20% off for New Customers" },
	{ latlon: [40.700639, -73.973779], type: "beauty", text: "15% off for New Customers" },
	{ latlon: [40.718596, -73.988885], type: "beauty", text: "Free Haircut with other services" },
	{ latlon: [40.756836, -73.968286], type: "other", text: "5% off for New Customers" },
	{ latlon: [40.689706, -73.992319], type: "other", text: "10% off for New Customers" },
	{ latlon: [40.764118, -73.977899], type: "product", text: "10% off for New Customers" },
	{ latlon: [40.755016, -73.932521], type: "other", text: "20% off for New Customers" }
];

var map = L.map("map").setView([40.749, -74.0060], 12);
var markers = [];

map.on("zoomend", function () {
	console.log(map.getBounds());
});

L.tileLayer("https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
	maxZoom: 18,
	subdomains: ["mt0", "mt1", "mt2", "mt3"]
}).addTo(map);

let currentFilter = "all";
const filterBox = document.querySelector(".filter");
const filters = document.querySelectorAll(".filter > div");
filterBox.addEventListener("click", (event) => {
	filters.forEach(ele => ele.classList.remove("selected"));
	event.target.classList.add("selected");
	currentFilter = event.target.innerText.toLowerCase();
	renderPoints();
}, false);
renderPoints();

function renderPoints() {
	markers.forEach(m => map.removeLayer(m));
	let filtered;
	if (currentFilter !== "all") {
		filtered = popups.filter(p => p.type == currentFilter);
	} else {
		filtered = popups;
	}
	let icon = L.icon({
		iconUrl: "/img/marker.svg",
		iconSize: [38, 95], // size of the icon
		shadowSize: [50, 64], // size of the shadow
		iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
		shadowAnchor: [4, 62],  // the same for the shadow
		popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
	});

	for (let popup of filtered) {
		var marker = L.marker(popup.latlon, { icon }).addTo(map);
		marker.bindPopup(
			`<div class='popup' style='width:110px'>
				<h3>${popup.type.toUpperCase()}</h3>
				<hr/>
				<p>${popup.text}</p>
				<a href='/u/login'> View Details </a>
			</div>`
		);
		markers.push(marker);
	}
}
