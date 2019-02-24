async function func(req, res) {
	let dict = {}, errors;
	req.body.numbers = req.body.numbers || [];
	req.body.numbers.forEach(x => dict[x.id] = x.dailyCodes);
	let ids = Object.keys(dict);

	try {
		let numbers = await req.user.getPhoneNumbers({
			where: {
				id: {
					$or: ids
				}
			}
		});
		for (let number of numbers) {
			number.dailyCodes = !!dict[number.id];
			await number.save();
		}

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
		res.redirect("/dashboard/notifications")
	}
}

module.exports = func;
