async function func(req, res) {
	res.locals.errors = req.flash("errors");
	res.locals.email = req.flash("email");
	res.render("dashboard/login");
}

module.exports = func;