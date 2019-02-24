module.exports = function (req, res) {
	res.locals.errors = req.flash("errors");
	if (req.user.verified) {
		res.redirect("/dashboard/");
	} else {
		res.render("dashboard/unverified")
	}
}