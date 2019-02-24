module.exports = (sequelize, DataTypes) => {
	var Deal = sequelize.define(
		"Deal",
		{
			latitude: {
				type: DataTypes.DECIMAL,
				allowNull: true,
				defaultValue: null,
				validate: { min: -90, max: 90 }
			},
			longitude: {
				type: DataTypes.DECIMAL,
				allowNull: true,
				defaultValue: null,
				validate: { min: -180, max: 180 }
			},
			title: DataTypes.STRING,
			description: DataTypes.STRING,
			amount: { type: DataTypes.DECIMAL, defaultValue: 0 },
			type: DataTypes.STRING,
			category: DataTypes.STRING,
			position: DataTypes.INTEGER,
			active: DataTypes.BOOLEAN,
			expireAfterDays: { type: DataTypes.INTEGER, defaultValue: 7 }
		},
		{
			indexes: [
				{ fields: ["UserId", "position"], unique: true, where: { active: true } }
			],
			validate: {
				bothCoordsOrNone() {
					if ((this.latitude === null) !== (this.longitude === null)) {
						throw new Error(
							"Require either both latitude and longitude or neither"
						);
					}
				}
			},
			getterMethods: {}
		}
	);

	Deal.associate = (db) => {
		Deal.belongsToMany(db.Customer, { through: "DealsUsed" });
		Deal.belongsTo(db.User);
	};
	return Deal;
};
