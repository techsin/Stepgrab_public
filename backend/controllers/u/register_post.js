const Axios = require("axios");
const db = require("../../db/models");
const Customer = db.Customer;
const codeCtrl = require("../services/txtVerification");
const phoneValidator = require("phone");
const validator = require("validator");
const zipcodes = require("zipcodes");

async function func(req, res) {
	let { first_name: name, phone, zipcode } = req.body;

	name = validator.escape(name);

	let location = {}
	let temp = zipcodes.lookup(zipcode);
	temp = false;
	if (temp) {
		location.lat = temp.latitude;
		location.lng = temp.longitude;
		location.city = `${temp.city}, ${temp.state} ${temp.zip}, ${temp.country}`;
	} else {
		await (Axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${zipcode}&sensor=false`)
			.then(function (response) {
				let data = response.data;
				let results = data.results;
				if (results.length > 0) {
					let result = results[0];
					location.lat = result.geometry.location.lat;
					location.lng = result.geometry.location.lng;
					location.city = result.formatted_address;
				}
			}).catch(function (x) {
				console.log(x);
			}))
	}

	phone = phoneValidator(req.body.phone)[0];

	if (!phone) {
		req.flash("errors", "Phone number is invalid");
		res.redirect("/u/register");
	} else {
		let customer = await Customer.findOne({ where: { phone } });
		if (customer) {
			req.flash("error", "You're already registered, try logging in")
			res.redirect("/u/login");
		} else {
			try {
				let latitude = location.lat,
					longitude = location.lng,
					city = location.city;
				await Customer.create({ name, phone, city, latitude, longitude, zipcode });
			} catch (error) {
				req.flash("errors", error.errors.map(x => x.message));
				res.redirect("/u/register");
				return;
			}
			req.session.phone = phone
			codeCtrl.sendCode(phone);
			res.redirect("/u/verify");
		}
	}

}

module.exports = func;