function changePassword(body) {
	let p1 = body.password || "";
	let p2 = body.retype_password;
	if (p1 !== p2) {
		throw new Error("Passwords don't match!");
	}
}

module.exports = {
	changePassword
};
