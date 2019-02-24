async function func(req, res) {
    let errors = req.flash("errors");
    res.render("u/login", {errors});
}

module.exports = func;