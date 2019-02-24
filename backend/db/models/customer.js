module.exports = (sequelize, DataTypes) => {
	var Customer = sequelize.define(
		"Customer",
		{
			name: {
				type: DataTypes.STRING,
				allowNull: { args: false, msg: "Name is required" },
				validate: {
					isAlpha: { args: true, msg: "Name can contain only alphabets" },
					notEmpty: { args: true, msg: "Name is required" },
					len: { args: [3, 40], msg: "Name should be minimum 3 letters" }
				}
			},
			verified: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			phone: {
				type: DataTypes.STRING,
				allowNull: { args: false, msg: "Phone number is required" },
				validate: {
					notEmpty: { args: true, msg: "Phone number is required" },
					len: { args: [4, 14], msg: "Phone number looks incorrect" }
				}
			},
			zipcode: {
				type: DataTypes.INTEGER,
				allowNull: { args: false, msg: "Zipcode is required" }
			},
			city: DataTypes.STRING,
			latitude: {
				type: DataTypes.DECIMAL,
				validate: { min: -90, max: 90 }
			},
			longitude: {
				type: DataTypes.DECIMAL,
				validate: { min: -180, max: 180 }
			}
		},
		{
			indexes: [],
			getterMethods: {}
		}
	);

	Customer.associate = (db) => {
		Customer.belongsToMany(db.Deal, { through: "DealsUsed" });
	};

	return Customer;
};
