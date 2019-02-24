let discounts = require("./shared/discounts");

async function func(req, res) {
	discounts(req, res);
}

module.exports = func;