const VerifyUser = require("../services/verifyUser.js");

async function func(req, res) {
	VerifyUser.sendLink(req);
	res.locals.errors = req.flash("errors");
	res.redirect("/dashboard/unverified");
}

module.exports = func;