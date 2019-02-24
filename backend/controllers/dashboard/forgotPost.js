const ForgotPassword = require("../services/forgotPassword");
const validator = require("validator");

async function func(req, res) {
	let email = req.body.email;
	if (!validator.isEmail(email)) {
		req.flash("errors", "Email is invalid");
		res.redirect("/dashboard/forgot");
	}
	await ForgotPassword.sendLink(req);
	res.render("dashboard/forgot_success");
}

module.exports = func