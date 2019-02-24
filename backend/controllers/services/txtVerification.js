const db = require("../../db/models");
const Customer = db.Customer;
const tokenModel = db.TxtVerificationToken;
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const SMS = require("./sms");

async function sendCode(phone) {
    const token = String(parseInt(crypto.randomBytes(4).toString("hex"), 16)).padStart(5, "0").substr(0, 6);

    try {
        await tokenModel.destroy({ where: { phone } });
        await tokenModel.create({ token, phone });
    } catch (error) {
        console.log(error);
        return;
    }

    await SMS.sendVerification(phone, token);
}



async function handleCode(req, res) {
    let token = req.body.token,
        phone = req.session.phone,
        tokenInDB = await tokenModel.findOne({ where: { phone } }),
        error = false;

    if (tokenInDB == null) {
        error = true;
    } else {
        let match = bcrypt.compareSync(token, tokenInDB.token);
        if (match) {
            let customer = await Customer.findOne({ where: { phone: tokenInDB.phone } });
            if (customer) {
                customer.verified = true;
                await customer.save();
                req.session.customerId = customer.id;
                req.session.save(function(){
                    res.redirect("/u/");
                });
            } else {
                error = true;
            }
            tokenInDB.destroy();
        } else {
            req.flash("errors", "Couldn't verify your phone number")
            res.redirect("/u/verify");
        }
    }

    if (error) {
        console.log(error);

        req.flash("errors", "Couldn't verify your phone number");
        res.redirect("/");
    }
}

async function middleware(req, res, next) {
    if (req.session.customerId) {
        let customer;
        try {
            customer = await Customer.findById(req.session.customerId);
            if (customer && customer.verified) {
                req.customer = customer;
                res.locals.customer = customer;
            }
        } catch (error) {
            console.log(error);
        }
    }
    next();
}

function redirectIfLoggedIn(route) {
    return (req, res, next) => {
        req.customer ? res.redirect(route) : next();
    };
}


function redirectIfNotLoggedIn(route) {
    return (req, res, next) => {
        if (!req.customer) {
            res.header(
                "Cache-Control",
                "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
            );
            res.header("Expires", "Fri, 31 Dec 1998 12:00:00 GMT");
            res.redirect(route)
        } else {
            next();
        }

    };
}

//delete expired reset tokens every 15 minutes
setInterval(function () {
    console.log("Deleting expired verification tokens");
    tokenModel.destroy({ where: { expires: { lt: new Date() } } });
}, 900000);


module.exports = {
    sendCode,
    handleCode,
    middleware,
    redirectIfNotLoggedIn,
    redirectIfLoggedIn
};
