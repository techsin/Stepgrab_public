"use strict";

var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
var basename = path.basename(__filename);
var env = process.env.NODE_ENV || "development";
var config = require(path.join(__dirname + "./../config/config.js"))[env];
var db = {};
var sequelizeLogger = require("sequelize-log-syntax-colors");
config.logging = sequelizeLogger;
config.logging = false;

var sequelize;
// console.log("====================================");
// console.log(JSON.stringify(process.env, null, 2));
// console.log("====================================");
if (config.use_env_variable) {
	sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
	sequelize = new Sequelize(config.database, config.username, config.password, config);
}

sequelize.query("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"", { raw: true });

fs
	.readdirSync(__dirname)
	.filter(file => {
		return (file.indexOf(".") !== 0) && (file !== basename) && (file.slice(-3) === ".js");
	})
	.forEach(file => {
		var model = sequelize["import"](path.join(__dirname, file));
		db[model.name] = model;
	});

Object.keys(db).forEach(modelName => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
