module.exports = function (req, res) {
	res.locals.errors = req.flash("errors")
	res.render("dashboard/register")
}