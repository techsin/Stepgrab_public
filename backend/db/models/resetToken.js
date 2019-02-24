const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
	var ResetToken = sequelize.define(
		"ResetToken",
		{
			token: {
				type: DataTypes.STRING,
				allowNull: false
			},
            userId: {
                type: DataTypes.INTEGER,
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

	ResetToken.beforeCreate(t => {
		return new Promise(function(resolve) {
			t.token = bcrypt.hashSync(t.token, 6);
			resolve();
		});
	});

	return ResetToken;
};
