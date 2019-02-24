// Set your secret key: remember to change this to your live secret key in production
// See your keys here: https://dashboard.stripe.com/account/apikeys
var stripe = require("stripe")(process.env.STRIPE_KEY);

module.exports = async function (req, res) {
	const token = req.body.stripeToken; // Using Express

	stripe.charges.create({
		amount: 5000,
		currency: "usd",
		description: "Early Adopter 1 Year",
		source: token,
		statement_descriptor: "Stepgrab: 1 year",
	}, function (err, charge) {
		if (!err && charge.status === "succeeded") {
			req.user.member = true;
			req.user.save().then(function () {
				res.redirect("/dashboard");
			});
		} else {
			req.flash("errors", err.message);
			res.redirect("/dashboard/membership");
		}
	});
};
