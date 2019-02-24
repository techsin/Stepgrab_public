const customValidator = require("../services/validator");
const Emailer = require("../services/email");



async function func(req, res) {
	try {
		customValidator.changePassword(req.body);
		await req.user.update({ password: req.body.password })
		await Emailer.notifyPasswordChange(req.user);
		req.flash("notifications", { type: "success", message: "Password Changed" });
		res.redirect("/dashboard");

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
		res.redirect("/dashboard/change_password");
	}
}

module.exports = func;