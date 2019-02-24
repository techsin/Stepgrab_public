async function func(req, res, mobile = "") {
	let errors = req.flash("errors");
	res.render(`u/${mobile}profile`, { errors });
}

module.exports = func;