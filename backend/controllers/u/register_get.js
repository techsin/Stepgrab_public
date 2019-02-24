async function func(req, res) {
    let errors = req.flash("errors");
    res.render("u/register", {errors, phone: req.session.phone});
}

module.exports = func;