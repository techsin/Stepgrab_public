const express = require("express");
const router = express.Router();



router.use(require("./../services/txtVerification").redirectIfNotLoggedIn("/u/login"))

router.get("/deals", require("./deals.js"));
router.get("/center", require("./customerCenter.js"));

module.exports = router;