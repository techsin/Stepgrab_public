const db = require("../../db/models");
const User = db.User;
const ResetToken = db.ResetToken;
const crypto = require("crypto");
const Emailer = require("./email");
const bcrypt = require("bcryptjs");

//generate token
//hash token with salt : happens in database automaticall onBeforeCreate
//save record with token, id
//send email with token and user id
//delete record after 1 hour
//on getting token 
// if match log user in and delete record and let user change password
async function sendLink(req) {
	let user;
	try {
		user = await User.findOne({ where: { email: req.body.email } });
	} catch (error) {
		console.log(error);
	}

	if (user === null) {
		return;
	}

	const token = crypto.randomBytes(30).toString("hex");
	const userId = user.id;
	try {
		await ResetToken.destroy({ where: { userId } });
		await ResetToken.create({ token, userId });
	} catch (error) {
        // let errors = error.errors.map(err => err.message);
		// req.flash("errors", errors);
		// res.redirect("/forgot");
	}
	Emailer.sendResetLink(user, token);
}

async function handleToken(req, res) {
	const token_provided = req.params.token;
	const userId = req.params.userId;
    let error = false;
    let tokenInDB = await ResetToken.findOne({ where: { userId } });
	let user;
    if (tokenInDB == null) {
        error = true;
    } else {
        let match = bcrypt.compareSync(token_provided, tokenInDB.token);
        if (match) {
			user = await User.findOne({where: {id: userId}});
			if (user) {
				req.session.userId = user.id;
				res.redirect("/dashboard/change_password");
			} else {
				error = true;
			}
        } else {
            error = true
        }
        tokenInDB.destroy();
    }
    
    if (error) {
        req.flash("errors", "Reset Link has expired or did not exist");
        res.redirect("/dashboard/forgot");
    }
}

//delete expired reset tokens every 15 minutes
setInterval(function() {
	console.log("Deleting expired reset tokens");
	ResetToken.destroy({ where: { expires: { lt: new Date() } } });
}, 900000);

module.exports = {
	sendLink,
	handleToken
};
