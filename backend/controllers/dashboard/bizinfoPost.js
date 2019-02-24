const validator = require("validator");

async function func(req, res) {
	let errors = [];
	try {
		await req.user.update({
			company: validator.escape(req.body.company),
			description: validator.escape(req.body.description),
			category: validator.escape(req.body.category),
			street: validator.escape(req.body.street),
			city: validator.escape(req.body.city),
			state: validator.escape(req.body.state),
			zipcode: req.body.zipcode,
			country: validator.escape(req.body.country)
		});
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

	if (errors.length == 0) {
		res.redirect("/dashboard/settings");
	} else {
		req.flash("errors", errors);
		res.redirect("/dashboard/settings");
	}
}

module.exports = func;