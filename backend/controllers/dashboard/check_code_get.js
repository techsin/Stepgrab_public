async function func(req, res) {
	let errors = req.flash("errors");
	let deal = req.flash("success")[0];
	let success = false;

	if (deal) {
		success = JSON.parse(deal);
	}

	res.render("dashboard/check_code", { errors, success });
}

module.exports = func;