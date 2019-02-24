const express = require("express")
const router = express.Router()

router.get("/register", require("./registerGet"))
router.post("/register", require("./registerPost"))
router.get("/logout", require("./logoutGet"))
router.get("/login", require("./loginGet"))
router.post("/login", require("./loginPost"))
router.get("/forgot", require("./forgotGet"))
router.post("/forgot", require("./forgotPost"))
router.get("/reset/:userId/:token", require("./resetGet"))

//only authenticated routes below
router.use(require("./../services/auth").redirectIfNotLoggedIn("/dashboard/login"))

router.get("/unverified/", require("./unverifiedGet"))
router.post("/verify", require("./verifyPost"))
router.get("/verify/:userId/:token", require("./verifyGet"))

//only verified routes below
router.use(require("./../services/auth").redirectIfNotVerified("/dashboard/unverified"))

router.get("/membership", require("./membershipGet"));
router.post("/membership", require("./membershipPost"));

//only paid members below
router.use(require("./../services/auth").redirectIfNotMember("/dashboard/membership"))


//mobile catch
const MobileDetect = require("mobile-detect");
router.get("/mobile", require("./mobile_get"))
router.get("*", function (req, res, next) {
	let md = new MobileDetect(req.headers["user-agent"]);

	if (!md.mobile() || md.tablet()) {
		next();
	} else {
		res.redirect("/dashboard/mobile")
	}
});

router.get("/", require("./Get"))
router.get("/change_password", require("./changePasswordGet"))
router.post("/change_password", require("./changePasswordPost"))
router.post("/self", require("./selfPost"))
router.post("/bizinfo", require("./bizinfoPost"))
router.get("/discounts", require("./discountsGet"))
router.post("/gradual_discounts", require("./gradualDiscountsPost"))
router.get("/disable_gradual_discounts", require("./disableGradualGet"))
router.get("/disable_custom_discount", require("./disableCustomGet"))
router.get("/analytics", require("./analyticsGet"))
router.get("/notifications", require("./notificationsGet"))
router.get("/settings", require("./settingsGet"))
router.get("/customers", require("./customersGet"))
router.get("/payment", require("./paymentGet"))
router.get("/delete_account", require("./confirmDeleteGet"))
router.post("/delete", require("./deletePost"))
router.get("/add_number", require("./addNumberGet"))
router.post("/phones", require("./phonesPost"))
router.post("/add_number", require("./addNumberPost"))
router.delete("/number/:id", require("./numberDelete"))
router.post("/check-code", require("./check_code_post"))
router.get("/check-code", require("./check_code_get"))


module.exports = router
