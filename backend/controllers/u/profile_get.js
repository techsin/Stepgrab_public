async function func(req, res) {
    let errors = req.flash("errors");
    res.render("u/profile", {errors});
}

module.exports = func;