const db = require("../../db/models");
const User = db.User;
const PhoneNumber = db.PhoneNumber;
const Auth = require("../services/auth");
const VerifyUser = require("../services/verifyUser");
const validator = require("validator");

async function func(req, res) {
	let errors, user;
	try {
		user = await User.create({
			firstName: validator.escape(req.body.firstName),
			lastName: validator.escape(req.body.lastName),
			email: req.body.email,
			password: req.body.password,

			company: validator.escape(req.body.company),
			description: validator.escape(req.body.description),
			category: validator.escape(req.body.category),
			// shouldReset: req.body.shouldReset,
			// resetAfterDays: req.body.resetAfterDays,

			street: validator.escape(req.body.street),
			city: validator.escape(req.body.city),
			state: validator.escape(req.body.state),
			zipcode: req.body.zipcode,
			country: validator.escape(req.body.country),

			PhoneNumbers: [{
				number: req.body.phone
			}]

		}, {
			include: [PhoneNumber]
		})
		
	} catch (error) {
		if (error instanceof Error) {
			if (error.errors) {
				errors = error.errors.map(err => err.message);
			} else {
				errors = [error.message]
			}
		} else {
			errors = [error];
		}
	}

	if (user && !errors) {
		VerifyUser.sendLink(req, user);
		Auth.login(req, user, () => {
			res.redirect("/dashboard");
		});
	} else {
		errors = errors || [];
		res.locals.errors = errors;
		res.locals.body = req.body;
		res.render("dashboard/register");
	}
}

module.exports = func;