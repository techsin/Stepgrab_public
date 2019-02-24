import state from "./state";

export default async function getCenter(map) {
	let center = { lng: -74.1679458347929, lat: 40.804170046506684 };
	getGEO(map);
	try {
		const response = await fetch(
			"/api/center",
			{ credentials: "same-origin" }
		);

		const json = await response.json();
		if (json.lat && json.lng) {
			center = json;
		}
		return (state.center = center);
	} catch (error) {
		console.log(error);
	}
}


export function getGEO(map) {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function (position) {
			let center = { lat: position.coords.latitude, lng: position.coords.longitude };
			state.center = center;
			map.panTo(center);
		}, function (err) { console.log("error", err) }, { maximumAge: 60000, timeout: 6000, enableHighAccuracy: true });
	}
}

