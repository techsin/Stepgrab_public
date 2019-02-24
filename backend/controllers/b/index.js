const express = require("express");
const router = express.Router();

router.get("/:uuid", require("./profileGet"));

module.exports = router;