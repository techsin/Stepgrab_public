module.exports = async function (req, res) {
	res.locals.errors = req.flash("errors");
	res.render("dashboard/membership");
};