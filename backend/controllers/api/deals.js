const db = require("../../db/models");
const Deal = db.Deal;
const merc = require("../services/merc");

async function func(req, res) {
	let tileX = req.query.tileX,
		tileY = req.query.tileY;

	if (!Number.isInteger(+tileX) || !Number.isInteger(+tileY)) {
		res.status(400).send("Bad Request");
		return;
	}

	let coords = merc.tileToLatLng(tileX, tileY);

	let [highX, lowX] = (coords.ne.lng > coords.sw.lng) ? [coords.ne.lng, coords.sw.lng] : [coords.sw.lng, coords.ne.lng];
	let [highY, lowY] = (coords.ne.lat > coords.sw.lat) ? [coords.ne.lat, coords.sw.lat] : [coords.sw.lat, coords.ne.lat];

	let allActiveDeals = await Deal.findAll({
		where: { active: true, latitude: { $between: [lowY, highY] }, longitude: { $between: [lowX, highX] } },
		include: [{ model: db.User, attributes: ["company", "uuid"] }]
	});

	let allUsedDeals = (await req.customer.getDeals({
		include: [{ model: db.User }]
	}));

	let filtered = allUsedDeals.filter((deal) => {
		let user = deal.User;
		if (user.shouldReset) {
			let resetDate = deal.DealsUsed.updatedAt;
			resetDate.setDate(resetDate.getDate() + user.resetAfterDays);
			return new Date() < resetDate;
		} else {
			return true;
		}
	});

	let used_maxs = {};

	for (let deal of filtered) {
		let id = deal.UserId;
		used_maxs[id] = used_maxs[id] || -1;
		if (used_maxs[id] < deal.position) {
			used_maxs[id] = deal.position;
		}
	}

	let mins = {};
	for (let deal of allActiveDeals) {
		let id = deal.UserId;

		if ((used_maxs[id] || -1) >= deal.position) {
			continue;
		}

		if (mins[id]) {
			if (mins[id].position > deal.position) {
				mins[id] = deal;
			}
		} else {
			mins[id] = deal;
		}
	}

	res.json(Object.values(mins));
}

module.exports = func;