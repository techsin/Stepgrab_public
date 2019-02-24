var crypto = require("crypto");

function random(howMany, chars) {
	chars = chars || "0123456789";
	let rnd = crypto.randomBytes(howMany),
		value = new Array(howMany),
		len = Math.min(256, chars.length),
		d = 256 / len;

	for (var i = 0; i < howMany; i++) {
		value[i] = chars[Math.floor(rnd[i] / d)]
	}

	return value.join("");
}



module.exports = (sequelize, DataTypes) => {
	var DealsUsed = sequelize.define(
		"DealsUsed",
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			expiresAt: DataTypes.DATE,
			code: {
				type: DataTypes.STRING,
				defaultValue: function () {
					return random(7)
				},
				allowNull: false,
				// unique: true
			},
			used: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			}
		},
		{
			indexes: [
				{
					unique: true,
					fields: ["code"]
				}
			],
			validate: {},
			getterMethods: {}
		}
	);

	DealsUsed.associate = (db) => {
		DealsUsed.belongsTo(db.Deal);
		DealsUsed.belongsTo(db.Customer);
		DealsUsed.belongsTo(db.User);
		// DealsUsed.hasOne(db.User, { through: db.Deal })
	};
	return DealsUsed;
};
