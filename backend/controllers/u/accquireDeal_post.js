let db = require("../../db/models");
let Deals = db.Deal;

async function func(req, res) {
	let dealId = req.params.id,
		error,
		result,
		maxTries = 5,
		loop = true,
		biz;

	let deal = await Deals.find({
		where: { id: dealId },
		include: [{ model: db.User }]
	});

	if (!deal) throw new Error("No such deal exists!")
	biz = deal.User;

	while (loop) {
		try {
			result = await tryToGetDeal(deal, req.customer);
			break;
		} catch (err) {
			if (maxTries > 0 && err.name == "SequelizeUniqueConstraintError" && err.errors[0].path == "code") {
				maxTries--;
			} else {
				error = err;
				break;
			}

		}
	}

	if (result) {
		req.flash("success", "Epic! You just got yourself a new discount!");
		res.redirect(`/u/discounts/${dealId}`);
	} else {
		let errors = [];

		if (typeof error === "string") {
			errors = [error];
		} else if (error instanceof Error) {
			errors = error.message
		} else {
			errors = error.errors.map(err => err.message);
		}

		req.flash("errors", errors);
		res.redirect(`/b/${biz.uuid}`);
	}

}

async function tryToGetDeal(deal, customer) {
	let biz = deal.User;

	if (qualifiyFor(customer, biz, deal)) {
		let date = new Date();
		date.setDate(date.getDate() + deal.expireAfterDays);
		await customer.addDeal(deal, { through: { expiresAt: date, UserId: biz.id } });
		return true;
	} else {
		throw new Error("Sorry, It appears you don't qualify for this deal");
	}
}

async function qualifiyFor(customer, biz, dealId) {

	let activeDeals,
		usedDeals,
		max;

	activeDeals = await biz.getDeals({
		where: { active: true }
	});

	if (activeDeals.length == 0) {
		throw new Error("Business isn't offering any deals yet");
	}

	activeDeals.sort(function (a, b) {
		return (a.position > b.position) ? 1 : -1;
	});

	usedDeals = await customer.getDeals({
		where: { UserId: biz.id },
	});

	if (biz.shouldReset) {
		usedDeals = usedDeals.filter(function (deal) {
			let updatedAt = deal.DealsUsed.updatedAt,
				futureDate = updatedAt.setDate(updatedAt.getDate() + biz.resetAfterDays);
			return new Date() < futureDate;
		});
	}

	max = usedDeals.reduce(function (prev, current) {
		return (prev.position > current.position) ? prev.position : current.position
	}, -1)

	for (let deal of activeDeals) {
		if (deal.position > max) {
			if (deal.id == dealId) {
				return true;
			}
			break;
		}
	}

	return false;
}


module.exports = func;


