let db = require("../../../db/models");

async function func(req, res, mobile = "") {
	let errors = req.flash("errors");
	let deals = await req.customer.getDeals({
		where: {
			$and: {
				"$DealsUsed.expiresAt$": {
					$gt: new Date()
				},

				"$DealsUsed.used$": {
					$eq: false
				}

			}
		},
		include: [{ model: db.User }]
	});
	res.render(`u/${mobile}discounts`, { errors, deals });
}

module.exports = func;