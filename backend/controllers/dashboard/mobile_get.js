const MobileDetect = require("mobile-detect");

async function func(req, res) {
	let md = new MobileDetect(req.headers["user-agent"]);

	if (!md.mobile()) {
		res.redirect("/dashboard/")
	} else {
		res.locals.errors = req.flash("errors");
		res.render("dashboard/mobile");
	}
}

module.exports = func;
