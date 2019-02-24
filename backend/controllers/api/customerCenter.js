module.exports = async function (req, res) {
	if (!req.customer) {
		res.status(403).send("Sorry! You can't see that.");
		return;
	}
	let obj = {};
	obj.lat = req.customer.latitude;
	obj.lng = req.customer.longitude;
	res.json(obj);
}