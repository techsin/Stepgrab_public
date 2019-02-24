async function func(req, res) {
    res.locals.errors = req.flash("errors");
    res.render("dashboard/change_password");
}

module.exports = func;