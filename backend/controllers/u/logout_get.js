async function func(req, res) {
    req.session.destroy(function(){
        res.redirect("/");
    });
    
}

module.exports = func;