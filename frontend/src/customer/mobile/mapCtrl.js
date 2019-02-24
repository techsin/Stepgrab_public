import L from "../../../../public/js/leaflet";
import loadTile from "../map/loadTile";
import state from "../map/state";
import detailCtrl from "./detailCtrl";
import getCenter, { getGEO } from "../map/center";

let map;
const tile_size = 256;
const zoom_level = 11;
const scale = Math.pow(2, zoom_level);





async function init() {
	map = L.map("mapDiv", { zoomControl: false, tapTolerance: 200, doubleClickZoom: false });
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
	map.on("click", function () {
		detailCtrl.hideDetail();
	});

	await getTiles(center.lat, center.lng);

	document.getElementById("locateme-btn").addEventListener("click", function () {
		getGEO(map);
	}, false);

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
		state.center.lat = Number(lat);
		state.center.lng = Number(lng);
	} else {
		return;
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
		// let include = filter(deal);
		let include = (deal);
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
			//
		}
	});

}





function createMarker(deal) {
	let marker = L.marker([deal.latitude, deal.longitude], {
		icon: new L.icon({
			className: "markerIcon",
			iconUrl: "/img/marker.svg",
			iconSize: [75, 75],
		})
	}).on("click", function () {
		showDetails(marker, deal);
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


function showDetails(marker, deal) {
	detailCtrl.show(deal);
}

function move(marker) {
	map.panTo(marker.getLatLng());
}

export default {
	updateMarkers,
	move,
	showDetails,
	init
}