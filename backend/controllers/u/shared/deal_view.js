let db = require("../../../db/models");

async function func(req, res, mobile = "") {


	let MAP_KEY = process.env.GOOGLEMAP_KEY;

	let success = req.flash("success"),
		errors = req.flash("error"),
		deal,
		backURL = "/u/discounts";

	try {
		deal = (await req.customer.getDeals({
			where: { id: req.params.id },
			include: [{ model: db.User }]
		}))[0];
	} catch (error) {
		req.flash("error", error);
		res.redirect("/u/");
	}

	if (!deal) {
		res.redirect("/u/discounts");
	} else {
		if (deal.DealsUsed.used || deal.DealsUsed.expiresAt <= new Date()) {
			res.redirect(`/u/history/${deal.id}`)
		} else {
			let user = deal.User;
			res.render(`u/${mobile}deal`, { user, success, deal, errors, MAP_KEY, backURL });
		}
	}

}

module.exports = func;