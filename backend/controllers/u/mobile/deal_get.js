let deal_view = require("../shared/deal_view");

async function func(req, res) {
	deal_view(req, res, "mobile/");
}

module.exports = func;