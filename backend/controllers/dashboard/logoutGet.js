const Auth = require("../services/auth");

async function func(req, res) {
    Auth.logout(req, function () {
        res.redirect("/");
    });
}

module.exports = func;