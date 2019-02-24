const bcrypt = require("bcryptjs");
const User = require("../../db/models").User;

function redirectIfLoggedIn(route) {
	return (req, res, next) => {
		req.user ? res.redirect(route) : next();
	};
}

function redirectIfNotLoggedIn(route) {
	return (req, res, next) => {
		if (req.user) {
			next();
		} else {
			res.header(
				"Cache-Control",
				"no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
			);
			res.header("Expires", "Fri, 31 Dec 1998 12:00:00 GMT");
			res.redirect(route);
		}
	};
}

function logout(req, cb) {
	req.session.destroy(function () {
		cb();
	});
}

function loginInput(req) {
	return new Promise(function (resolve, reject) {
		User.findOne({ where: { email: req.body.email } })
			.then(function (user) {
				try {
					login(req, user, function () {
						resolve();
					});
				} catch (error) {
					reject("User or Password do not match");
				}
			})
			.catch(function () {
				reject("User or Password do not match");
			});
	});
}

function login(req, user, cb) {
	let password = req.body.password;
	let match = bcrypt.compareSync(password, user.password);
	if (match) {
		req.session.regenerate(function (err) {
			if (err) console.log(err);
			req.session.userId = user.id;
			cb();
		});

	} else {
		throw new Error("Password didn't Match");
	}
}

async function authMiddleware(req, res, next) {
	if (req.session.userId) {
		let user;
		try {
			user = await User.findById(req.session.userId);
		} catch (error) {
			console.log(error);
		}

		if (user) {
			req.user = user;
			res.locals.user = user;
		} else {
			req.user = null;
			res.locals.user = null;
		}
		next();
	} else {
		next();
	}
}

function redirectIfNotVerified(route) {
	return (req, res, next) => {
		(req.user.verified) ? next() : res.redirect(route);
	};
}


function redirectIfNotMember(route) {
	return (req, res, next) => {
		(req.user.member) ? next() : res.redirect(route);
	};
}

module.exports = {
	authMiddleware,
	redirectIfLoggedIn,
	redirectIfNotLoggedIn,
	logout,
	login,
	loginInput,
	redirectIfNotVerified,
	redirectIfNotMember
};
