async function func(req, res) {
    let phones = await req.user.getPhoneNumbers();
    res.locals.errors = req.flash("errors");
    res.render("dashboard/notifications", { phones });
}

module.exports = func;