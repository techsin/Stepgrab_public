const db = require("../../db/models");
const DealsUsed = db.DealsUsed;
const MobileDetect = require("mobile-detect");

async function func(req, res) {
	let md = new MobileDetect(req.headers["user-agent"]);

	try {
		let code = req.body.code;
		let user = req.user;

		if (!user) {
			throw new Error("You need to login first");
		}

		if (!code || code.length < 6) {
			throw new Error("Code seems invalid");
		}

		let usedDeal = await DealsUsed.findOne({
			where: { code, UserId: user.id }
		});

		if (!usedDeal) {
			throw new Error("There is no such discount");
		}

		if (usedDeal.used) {
			throw new Error("Already Used!")
		}

		if (usedDeal.expiresAt <= new Date()) {
			throw new Error("Discount Expired!")
		}

		let deal = await usedDeal.getDeal();

		if (!deal) {
			throw new Error("There is no such discount");
		}

		usedDeal.used = true;
		await usedDeal.save();

		if (!md.mobile() || md.tablet()) {
			req.flash("success", JSON.stringify(deal));
			res.redirect("/dashboard/check-code");
		} else {
			res.render("dashboard/mobile_redeemed", { deal });
		}

	} catch (error) {
		let errors;

		if (error instanceof Error) {
			if (error.errors) {
				errors = error.errors.map(err => err.message);
			} else {
				errors = [error.message]
			}
		} else {
			errors = [error];
		}

		req.flash("errors", errors);

		if (!md.mobile() || md.tablet()) {
			res.redirect("/dashboard/check-code");
		} else {
			res.redirect("/dashboard/mobile");
		}
	}
}

module.exports = func;