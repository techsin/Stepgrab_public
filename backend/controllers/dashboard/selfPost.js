const validator = require("validator");

async function func(req, res) {
	let errors = [];
	try {
		await req.user.update({
			firstName: validator.escape(req.body.firstName),
			lastName: validator.escape(req.body.lastName),
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