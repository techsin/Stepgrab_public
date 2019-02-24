async function func(req, res) {
    let errors = req.flash("errors");
    res.render("u/share", {errors});
}

module.exports = func;