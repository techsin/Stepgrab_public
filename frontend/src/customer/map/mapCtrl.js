import L from "../../../../public/js/leaflet";
import loadTile from "./loadTile";
import state from "./state";
import { buildList, addToDOM } from "./listCtrl";
import { filter } from "./filters";
import getCenter from "./center";

let map;
const tile_size = 256;
const zoom_level = 11;
const scale = Math.pow(2, zoom_level);


async function init() {
	map = L.map("mapDiv");
	L.tileLayer("https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
		maxZoom: 18,
		subdomains: ["mt0", "mt1", "mt2", "mt3"]
	}).addTo(map);

	if (!coordsInURL()) {
		await getCenter(map);
	}

	let center = state.center;
	map.setView(center, 13);
	map.options.minZoom = 13;
	map.on("moveend", moveendHandler);

	await getTiles(center.lat, center.lng);
}

async function moveendHandler() {
	let center = map.getCenter();
	await getTiles(center.lat, center.lng);
	udpateUrl(center);
}

function coordsInURL() {
	let u = new URL(location.href);
	let params = u.searchParams;
	let lng = params.get("lng");
	let lat = params.get("lat");
	if (Number(lat) && Number(lng)) {
		state.center = {};
		state.center.lat = lat;
		state.center.lng = lng;
		return true;
	} else {
		return false;
	}
}

function udpateUrl({ lat, lng }) {
	let params = { lat, lng };
	let str = Object.keys(params).map((key) => {
		return encodeURIComponent(key) + "=" + encodeURIComponent(params[key])
	}).join("&");
	history.replaceState(null, null, location.pathname + "?" + str);
}
async function getTiles(lat, lng) {
	let tile = latlngToTile(lat, lng);
	let deltaX = [-1, 0, 1];
	let deltaY = [-1, 0, 1];
	for (let dx of deltaX) {
		for (let dy of deltaY) {
			await loadTile({ x: tile.x + dx, y: tile.y + dy });
			updateMarkers();
		}
	}
}

function updateMarkers() {
	let bounds = map.getBounds();

	state.deals.forEach(function (deal) {
		let include = filter(deal);
		if (!deal.marker) {
			deal.marker = createMarker(deal);
		}

		if (include) {
			if (!map.hasLayer(deal.marker)) {
				deal.marker.addTo(map);
			}
		} else {
			map.removeLayer(deal.marker);
		}

		if (include && map.hasLayer(deal.marker) && bounds.contains(deal.marker.getLatLng())) {
			buildList(deal);
		}
	});

	addToDOM();
}





function createMarker(deal) {
	let marker = L.marker([deal.latitude, deal.longitude], {
		icon: new L.DivIcon({
			className: "markerIcon",
			html: "<img class=\"marker\" src=\"/img/marker.svg\"/>"
		})
	}).on("click", function () {
		createPopup(marker, deal);
		move(marker);
	});
	return marker;
}

function latlngToTile(lat, lng) {
	return tileCoords(worldCoords(lat, lng));
}

function worldCoords(lat, lng) {
	var siny = Math.sin(lat * Math.PI / 180);
	siny = Math.min(Math.max(siny, -0.9999), 0.9999);
	return {
		x: tile_size * (0.5 + lng / 360),
		y: tile_size * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI))
	};
}

function tileCoords({ x, y }) {
	return {
		x: Math.floor(x * scale / tile_size),
		y: Math.floor(y * scale / tile_size)
	};
}

function oneTemp(deal) {
	console.log(deal);
	return (`<div class='popup' style='width:110px'>
    <h1>${deal.title.toUpperCase()}</h1>
    <hr/>
    <p>${deal.description}</p>
    <a href='/b/${deal.User.uuid}' target='_blank'> View Details </a>
</div>`)
}

// function groupTemp(deals) {
// 	let html = deals.map(oneTemp).join('<br/>');
// 	return (`<div class="grouPopups">
//         ${html}
//     </div>`)
// }

function createPopup(marker, deal) {
	let px = map.project(marker.getLatLng());
	px.y -= 30;

	L.popup()
		.setLatLng(map.unproject(px))
		.setContent(oneTemp(deal))
		.openOn(map);
}

function move(marker) {
	map.panTo(marker.getLatLng());
}

export default {
	updateMarkers,
	move,
	createPopup,
	init
}