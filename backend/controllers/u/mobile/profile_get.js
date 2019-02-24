let profile = require("../shared/profile");

async function func(req, res) {
	profile(req, res, "mobile/");
}

module.exports = func;