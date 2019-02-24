async function func(req, res) {
	res.locals.errors = req.flash("errors");
	res.render("dashboard/deleteConfirm");
}

module.exports = func;