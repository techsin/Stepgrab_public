let map = require("../shared/map");

async function func(req, res) {
	map(req, res, "mobile/");
}

module.exports = func;