let old_deal = require("../shared/old_deal");

async function func(req, res) {
	old_deal(req, res, "mobile/");
}

module.exports = func;