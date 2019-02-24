async function func(req, res) {
    res.locals.errors = req.flash("errors");
    res.render("dashboard/addNumber");
}

module.exports = func;