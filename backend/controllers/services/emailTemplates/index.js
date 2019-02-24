var pug = require("pug");
var fs = require("fs");
var path = require("path");
let templates = {};
const basename = path.basename(module.filename);

fs
.readdirSync(__dirname)
.filter(file => (file.indexOf(".") !== 0) && (file !== basename) && (file.slice(-4) === ".pug"))
.forEach(file => {
  const content = fs.readFileSync(path.join(__dirname, file), "utf8")
  const fn = pug.compile(content, {});
  const filename = file.substr(0, file.length - 4);
  templates[filename] = fn;
});

module.exports = templates;