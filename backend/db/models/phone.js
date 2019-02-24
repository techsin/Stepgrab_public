const phoneValidator = require("phone");

module.exports = (sequelize, DataTypes) => {
	var PhoneNumber = sequelize.define(
		"PhoneNumber",
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			number: {
				type: DataTypes.STRING,
				allowNull: { args: false, msg: "Phone number is required" },
				validate: {
					notEmpty: { args: true, msg: "Phone number is required" },
					len: { args: [4, 14], msg: "Phone number looks incorrect" },
					isValid(value) {
						if (!phoneValidator(value)[0]) {
							throw new Error("Phone number is invalid");
						}
					}
				}
			},
			dailyCodes: {
				type: DataTypes.BOOLEAN,
				defaultValue: true
			}
		},
		{
			indexes: [],
			validate: {},
			getterMethods: {}
		}
	);
	// phoneValidator(phone.number)[0]
	PhoneNumber.beforeCreate(async (phone) => {
		phone.number = phoneValidator(phone.number)[0];
	});

	PhoneNumber.beforeBulkUpdate(async (atr) => {
		if (atr.fields.includes("number")) {
			atr.attributes.number = phoneValidator(atr.attributes.number)[0];
		}
	});

	PhoneNumber.beforeUpdate(async (phone) => {
		phone.number = phoneValidator(phone.number)[0];
	});


	PhoneNumber.associate = (db) => {
		PhoneNumber.belongsTo(db.User);
	};


	return PhoneNumber;
};
