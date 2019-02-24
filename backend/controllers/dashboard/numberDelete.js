async function func(req, res) {
	let errors;
	try {
		let numbers = await req.user.getPhoneNumbers({
			where: {
				id: req.params.id
			}
		});
		
		for (let n of numbers) {
			await n.destroy();
		}

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

		req.flash("errors", errors);
	}
	res.send("OK");

}

module.exports = func;
