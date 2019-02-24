let history = require("./shared/history");

async function func(req, res) {
	history(req, res);
}

module.exports = func;