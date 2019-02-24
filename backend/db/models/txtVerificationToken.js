const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
	var TxtVerificationToken = sequelize.define(
		"TxtVerificationToken",
		{
			token: {
				type: DataTypes.STRING,
				allowNull: false
			},
            phone: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            expires: {
                type: DataTypes.DATE,
                defaultValue: new Date(Date.now() + (1000 * 60 * 60))
            }
		},
		{
			indexes: [
				{
					unique: true,
					fields: ["token"]
				}
			]
		}
	);

	TxtVerificationToken.beforeCreate(t => {
		return new Promise(function(resolve) {
			t.token = bcrypt.hashSync(t.token, 6);
			resolve();
		});
	});

	return TxtVerificationToken;
};
