const db = require("../../db/models");
const User = db.User;
const VerifyToken = db.VerifyToken;
const crypto = require("crypto");
const Emailer = require("./email");
const bcrypt = require("bcryptjs");


async function sendLink(req, user) {
	try {
		if (!user) {
			user = await User.findOne({ where: { email: req.user.email } });
		}
	} catch (error) {
		console.log(error);
	}

	if (user === null) {
		return;
	}

	const token = crypto.randomBytes(30).toString("hex");
	const userId = user.id;
	try {
		await VerifyToken.destroy({ where: { userId } });
		await VerifyToken.create({ token, userId });
	} catch (error) {
        // let errors = error.errors.map(err => err.message);
		// req.flash("errors", errors);
		// res.redirect("/forgot");
	}
	Emailer.sendVerificationLink(user, token);
}


async function handleToken(req, res) {
	const token_provided = req.params.token;
	const userId = req.params.userId;
    let error = false;
    let tokenInDB = await VerifyToken.findOne({ where: { userId } });
	let user;
    if (tokenInDB == null) {
        error = true;
    } else {
        let match = bcrypt.compareSync(token_provided, tokenInDB.token);
        if (match) {
			user = await User.findOne({where: {id: userId}});
			if (user) {
                req.session.userId = user.id;
                req.user.verified = true;
                await req.user.save();
				res.redirect("/dashboard/");
			} else {
				error = true;
			}
        } else {
            error = true
        }
        tokenInDB.destroy();
    }
    
    if (error) {
        req.flash("errors", "Verification Link has expired or did not exist");
        res.redirect("/dashboard/unverified");
    }
}


module.exports = {
	sendLink,
	handleToken
};
