const db = require("../../db/models");
const Customer = db.Customer;
const codeCtrl = require("../services/txtVerification");
const phoneValidator = require("phone");

async function func(req, res) {
    let phone = phoneValidator(req.body.phone)[0];
    if (!phone) {
        req.flash("errors", "Phone number is invalid");
        res.redirect("/u/login");
    } else {
        let customer = await Customer.findOne({ where: { phone } });
        req.session.phone = phone
        if (customer) {
            await codeCtrl.sendCode(phone);
            res.redirect("/u/verify");
        } else {
            res.redirect("/u/register");
        }
    }

}

module.exports = func;