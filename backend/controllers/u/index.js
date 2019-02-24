const express = require("express");
const router = express.Router();

router.get("/login", require("./login_get"));
router.post("/login", require("./login_post"));

router.get("/verify", require("./verify_get"));
router.post("/verify", require("./verify_post"));

router.get("/register", require("./register_get"));
router.post("/register", require("./register_post"));

//only authenticated routes below
router.use(require("./../services/txtVerification").redirectIfNotLoggedIn("/u/login"))

//mobile routes
router.use("/", require("./mobile"));

router.get("/", require("./get"));
router.get("/logout", require("./logout_get"));
router.get("/discounts", require("./discounts_get"));
router.get("/profile", require("./profile_get"));
router.get("/history", require("./history_get"));
router.get("/history/:id", require("./old_deal_get"));
router.get("/share", require("./share_get"));
router.post("/discounts/:id", require("./accquireDeal_post"));
router.get("/discounts/:id", require("./deal_get"));

module.exports = router;