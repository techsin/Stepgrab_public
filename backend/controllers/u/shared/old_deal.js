let db = require("../../../db/models");

async function func(req, res, mobile = "") {

	let MAP_KEY = process.env.GOOGLEMAP_KEY,
		errors = req.flash("error"),
		deal,
		backURL = "/u/history";
	// backURL = req.header("Referer") || "/u/history";

	try {
		deal = (await req.customer.getDeals({
			where: { id: req.params.id },
			include: [{ model: db.User }]
		}))[0];
	} catch (error) {
		req.flash("error", error);
		res.redirect(backURL);
	}

	if (!deal) {
		res.redirect(backURL);
	} else {
		let user = deal.User;
		res.render(`u/${mobile}old_deal_view`, { user, deal, errors, MAP_KEY, backURL });
	}

}

module.exports = func;