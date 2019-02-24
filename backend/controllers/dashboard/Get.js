async function func(req, res) {
    res.locals.notifications = req.flash("notifications");
    res.render("dashboard/overview");
}

module.exports = func;