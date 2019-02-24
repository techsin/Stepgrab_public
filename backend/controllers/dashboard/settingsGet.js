async function func(req, res) {
    res.locals.body = req.user;
    res.locals.errors = req.flash("errors");
    res.render("dashboard/settings");
}

module.exports = func;