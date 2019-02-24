let db = require("../../db/models");
// let moment = require("moment");
let User = db.User;
let Deal = db.Deal;
let MAP_KEY = process.env.GOOGLEMAP_KEY;


async function func(req, res, next) {
	let uuid = req.params.uuid;
	let user;
	let deals;
	let errors = req.flash("errors");

	try {
		user = await User.findOne({
			where: { uuid },
			include: [{
				model: Deal,
				where: {
					active: true
				},
				required: false
			}]
		});


		deals = user.Deals || [];

		let usedDeals = await req.customer.getDeals({
			where: {
				UserId: user.id,
				// 	"$DealsUsed.updatedAt$": {
				// 		$lte: moment().subtract(user.resetAfterDays, "days").toDate()
				// 	}
			}
		});

		if (user.shouldReset) {
			usedDeals = usedDeals.filter(function (deal) {
				let updatedAt = deal.DealsUsed.updatedAt;
				let futureDate = updatedAt.setDate(updatedAt.getDate() + user.resetAfterDays);
				return new Date() < futureDate;
			});
		}

		const max = usedDeals.reduce(function (prev, current) {
			return (prev.position > current.position) ? prev.position : current.position
		}, -1)

		deals.sort(function (a, b) {
			return (a.position > b.position) ? 1 : -1;
		});

		for (let deal of deals) {
			if (deal.position > max) {
				deal.qualifyFor = true;
				break;
			}
		}

	} catch (error) {
		// console.log(error);
	}

	if (!user) {
		var err = new Error("Not Found");
		err.status = 404;
		next(err);
	} else {
		res.render("b/profile", { user, deals, MAP_KEY, errors });
	}


}

module.exports = func;