const codeCtrl = require("../services/txtVerification");
async function func(req, res) {
    // req.body.token = req.body.token.join("");
    codeCtrl.handleCode(req, res);
}

module.exports = func;