const express = require("express");
const router = express.Router();
const validator = require("validator");
const Emailer = require("./services/email");

router.get("/", (req, res) => {
	res.locals.errors = req.flash("contactErrors");
	res.locals.body = JSON.parse(req.flash("contactBody")[0] || "{}");
	res.render("contact");
});

router.post("/", (req, res) => {
	let email = req.body.email,
		subject = validator.escape(req.body.subject),
		message = validator.escape(req.body.message);
		
	try {
		validate(email, subject, message);
		Emailer.contactMessage(email, subject, message, function(err){
			if (err) {
				throw err;
			} 
			req.flash("notifications", "Your Message has been sent")
			res.redirect("/");
		});

	} catch (error) {
		let errors = [];

		if (typeof error === "string") {
			errors = [error];
		} else if (error instanceof Error) {
			errors = [error.message]
		} else {
			errors = error.errors.map(err => err.message);
		}

		req.flash("contactErrors", errors);
		req.flash("contactBody", JSON.stringify(req.body));
		res.redirect("/contact");
	}


});


module.exports = router;


function validate(email, subject, message) {
	if (!validator.isEmail(email)) {
		throw new Error("Email is invalid");
	}
	if (subject.trim().length == 0) {
		throw new Error("Subject can't be empty");
	}
	if (message.trim().length == 0) {
		throw new Error("Message can't be empty");
	}
	if (subject.trim().length > 200) {
		throw new Error("Subject is too long");
	}
	if (message.trim().length == 8000) {
		throw new Error("Message should be less than 8000 characters");
	}
}