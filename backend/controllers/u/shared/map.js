async function func(req, res, mobile = "") {
	let center = {
		lat: req.customer.latitude,
		lng: req.customer.longitude
	};
	let errors = req.flash("errors")
	console.log(`u/${mobile}map`);
	res.render(`u/${mobile}map`, { center, errors });
}

module.exports = func;