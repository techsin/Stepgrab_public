const express = require("express");
const router = express.Router();
const MobileDetect = require("mobile-detect");

router.use(function (req, res, next) {
	let md = new MobileDetect(req.headers["user-agent"]);
	if (!md.mobile()) {
		next("router")
	} else {
		next();
	}
});


router.get("/", require("./get.js"));
router.get("/discounts", require("./discounts_get"));
router.get("/discounts/:id", require("./deal_get"));
router.get("/profile", require("./profile_get"));
router.get("/history", require("./history_get"));
router.get("/history/:id", require("./history_deal_get"));

module.exports = router;