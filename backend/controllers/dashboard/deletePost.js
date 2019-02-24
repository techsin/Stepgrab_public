async function func(req, res) {
	res.locals.errors = req.flash("errors");
	await req.user.destroy();
	req.session.destroy(function(){
		res.redirect("/");
	});
}

module.exports = func;