async function func(req, res) {
    let errors = req.flash("errors");
    res.render("u/verify", {errors});
}

module.exports = func;