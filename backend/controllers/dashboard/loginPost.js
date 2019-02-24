const Auth = require("../services/auth");

async function func(req, res) {
    Auth.loginInput(req)
        .then(function () {
            res.redirect("/dashboard");
        })
        .catch(function (err) {
            req.flash("errors", [err]);
            req.flash("email", req.body.email);
            res.redirect("/dashboard/login");
        });
}

module.exports = func;
