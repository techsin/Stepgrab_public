const merc = require("mercator-projection");
const tile_size = 256;
const zoom_level = 11;

const scale = Math.pow(2, zoom_level);


//latlng to tile
function latlngToTile(lat, lng) {
	let worldCoords = merc.fromLatLngToPoint({ lat, lng });
	let tile = tileCoords(worldCoords);
	return tile;
}

function tileToLatLng(x, y) {
	var ne = merc.fromPointToLatLng({
		x: ((+x + 1) * tile_size / scale), // xmax
		y: (+y * tile_size / scale) //ymin
	});
	var sw = merc.fromPointToLatLng({
		x: (+x * tile_size / scale), //xmin
		y: ((+y + 1) * tile_size / scale)  //ymax
	});

	return { ne, sw }
}


// function pixelCoords(worldCoords) {
// 	return [
// 		Math.floor(worldCoords.x * scale),
// 		Math.floor(worldCoords.y * scale)
// 	];
// }

function tileCoords(worldCoords) {
	return [
		Math.floor(worldCoords.x * scale / tile_size),
		Math.floor(worldCoords.y * scale / tile_size)
	];
}

// latlngToTile(40.6, -73.94999999999999)
// tileToLatLng(603, 770)

module.exports = {
	latlngToTile,
	tileToLatLng
}



// function project(lat, lng) {
// 	var siny = Math.sin(lat * Math.PI / 180);
// 	siny = Math.min(Math.max(siny, -0.9999), 0.9999);

// 	return [
// 		tile_size * (0.5 + lng / 360),
// 		tile_size * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI))
// 	];
// }

// Point is world coordinate, which mercator coordinate

// https://jsfiddle.net/uzhbg8bb/13/
// https://jsfiddle.net/fb3j4hxu/25/
// https://github.com/zacbarton/node-mercator-projection/blob/master/index.js
// http://www.maptiler.org/google-maps-coordinates-tile-bounds-projection/
// https://www.npmjs.com/package/mercator-projection
// https://www.designedbyaturtle.co.uk/2015/converting-google-maps-tile-coordinates-to-boundary-box-coords/
// http://alistapart.com/article/takecontrolofyourmaps 
// https://gis.stackexchange.com/questions/234930/how-to-dynamically-load-google-maps-markers-around-center-coordinates?newreg=f1fd1fec067844dc87f9d5ea3004f270
// https://gist.github.com/mpontus/a6a3c69154715f2932349f0746ff81f2