const xss = require("xss");

module.exports = function(req, res, next) {
    traverse(req.body);
    next();
};

function traverse(obj) {
    for (let key in obj) {
        let prop = obj[key];
        if (typeof prop == "object" && prop !== null) {
            traverse(prop);
        } else if (typeof prop == "string" || prop instanceof String) {
            obj[key] = xss(prop);
        }
    }
}


