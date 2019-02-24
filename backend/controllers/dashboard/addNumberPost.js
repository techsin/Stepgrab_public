async function func(req, res) {
	let errors;
	try {
		await req.user.createPhoneNumber({
			number: req.body.phone
		});
		res.redirect("/dashboard/notifications")
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

		req.flash("errors", errors)
		res.redirect("/dashboard/add_number")
	}

}

module.exports = func;
