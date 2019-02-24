const nodeMailer = require("nodemailer");
const Templates = require("./emailTemplates");
let domain;

if (process.env.NODE_ENV == "production") {
	domain = "https://stepgrab.com";
} else {
	domain = "http://localhost:8080"
}

let transporter = nodeMailer.createTransport({
	host: "email-smtp.us-east-1.amazonaws.com",
	port: 465,
	secure: true,
	auth: {
		user: process.env.SES_USER,
		pass: process.env.SES_PASS
	}
});

function sendResetLink(user, token) {
	const link = `${domain}/dashboard/reset/${user.id}/${token}`;
	const from = "\"Customer Support\" <support@stepgrab.com>",
		to = user.email,
		subject = "StepGrab | Reset Password Link",
		message = Templates.resetLink({ firstName: user.firstName, link: link });

	sendMail(from, to, subject, message, function (err, info) {
		if (err) {
			console.log(err, info);
		}
	});
}
function sendVerificationLink(user, token) {
	const link = `${domain}/dashboard/verify/${user.id}/${token}`;
	const from = "\"Customer Support\" <support@stepgrab.com>",
		to = user.email,
		subject = "StepGrab | Email verification",
		message = Templates.verifyLink({ firstName: user.firstName, link: link });
	sendMail(from, to, subject, message, function (err, info) {
		if (err) {
			console.log(err, info);
		}
	});
}

function notifyPasswordChange(user) {
	const from = "\"Customer Support\" <support@stepgrab.com>",
		to = user.email,
		subject = "StepGrab | Your Password has changed",
		message = Templates.notifyPasswordChange({ firstName: user.firstName });

	sendMail(from, to, subject, message, function (err, info) {
		if (err) {
			console.log(err, info);
		}
	});
}

function contactMessage(from, subject, message, cb) {
	let mailOptions = {
		from,
		replyTo: from,
		to: "contact@stepgrab.com",
		subject,
		text: message
	};
	transporter.sendMail(mailOptions, cb);
}

function sendMail(from, to, subject, message, cb) {
	let mailOptions = {
		from: from, // sender address
		to: to, // list of receivers
		subject: subject, // Subject line
		// text: message, // plain text body
		html: message // html body
	};
	transporter.sendMail(mailOptions, cb);
}



module.exports = {
	sendResetLink, notifyPasswordChange, sendVerificationLink, contactMessage
};
