const express = require("express");
const fs = require("fs");
const path = require("path");
const Auth = require("./services/auth");
// const axios = require("axios");
// const get_ip = require("ipware")().get_ip;

const router = express.Router();
const basename = path.basename(module.filename);

const MobileDetect = require("mobile-detect");

router.get("/", async (req, res) => {

	let md = new MobileDetect(req.headers["user-agent"]);
	if (md.mobile()) {
		//if authenticated on mobile then redirect to map
		if (req.customer) {
			res.redirect("/u/")
		} else {
			res.render("u/mobile/home");
			return;
		}
	}
	// let reqIp = get_ip(req).clientIp;
	// if (reqIp.includes("127.0.0.1")) {
	//   reqIp = "68.198.16.225";
	// }
	// let location = await axios.get("http://freegeoip.net/json/" + reqIp);
	//implement city guessing form ip later
	res.locals.errors = req.flash("errors");
	res.locals.notifications = req.flash("notifications");
	const location = "New York, NY";
	res.render("home", { location });
});

router.get("/business", Auth.redirectIfLoggedIn("/dashboard"), (req, res) => {
	res.render("businessLandingPage");
});

router.use("/dashboard", require("./dashboard"));
router.use("/u", require("./u"));
router.use("/b", require("./b"));
router.use("/api", require("./api"));

fs
	.readdirSync(__dirname)
	.filter(
		file =>
			file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
	)
	.forEach(file => {
		const fileName = file.substr(0, file.length - 3);
		router.use(`/${fileName}`, require(`./${fileName}`));
	});

module.exports = router;
