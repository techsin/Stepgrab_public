const db = require("../../../db/models");
async function func(req, res, mobile = "") {
	let errors = req.flash("errors");
	let deals = await req.customer.getDeals({
		where: {
			$or: {
				"$DealsUsed.expiresAt$": {
					$lt: new Date()
				},
				"$DealsUsed.used$": {
					$eq: true
				},
			}
		},
		include: [{ model: db.User, attributes: ["id", "company", "street", "state", "country", "zipcode", "city"] }]
	});
	res.render(`u/${mobile}history`, { errors, deals });
}

module.exports = func;