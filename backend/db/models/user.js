const bcrypt = require("bcryptjs");
const googleMapsClient = require("@google/maps").createClient({ key: process.env.GOOGLEMAP_KEY });

module.exports = (sequelize, DataTypes) => {
	var User = sequelize.define(
		"User",
		{
			firstName: {
				type: DataTypes.STRING,
				allowNull: { args: false, msg: "First Name is required" },
				validate: {
					isAlpha: { args: true, msg: "First name can contain only alphabets" },
					notEmpty: { args: true, msg: "First name is required" },
					len: { args: [3, 100], msg: "First name should be minimum 3 letters" }
				}
			},
			lastName: {
				type: DataTypes.STRING,
				allowNull: { args: false, msg: "Last name is required" },
				validate: {
					isAlpha: { args: true, msg: "Last name can contain only alphabets" },
					notEmpty: { args: true, msg: "Last name is required" },
					len: { args: [3, 100], msg: "Last name should be minimum 3 letters" }
				}
			},
			email: {
				type: DataTypes.STRING,
				allowNull: { args: false, msg: "Email is required" },
				unique: {
					args: true,
					msg: "There is already an account with this email address"
				},
				validate: {
					notEmpty: { args: true, msg: "Email is required" },
					isEmail: { args: true, msg: "Email doesn't look valid" }
				}
			},
			password: {
				type: DataTypes.STRING,
				allowNull: { args: false, msg: "Password is required" },
				validate: {
					notEmpty: { args: true, msg: "Password is required" },
					len: {
						args: [8, 100],
						msg: "Password should be minimum 8 characters"
					},
					is: {
						args: /^(?=.*[a-zA-Z])(?=.*[0-9])/i,
						msg: "Password should have both letters and numbers"
					}
				}
			},
			street: {
				type: DataTypes.STRING,
				allowNull: { args: false, msg: "Street address is required" },
				validate: {
					notEmpty: { args: true, msg: "Street address is required" }
				}
			},
			city: {
				type: DataTypes.STRING,
				allowNull: { args: false, msg: "City is required" },
				validate: {
					isAlpha: { args: true, msg: "City can contain only alphabets" },
					notEmpty: { args: true, msg: "City is required" }
				}
			},
			state: {
				type: DataTypes.STRING,
				allowNull: { args: false, msg: "State is required" },
				validate: {
					is: { args: [/^[a-zA-Z\s]*$/], msg: "State can contain only alphabets" },
					notEmpty: { args: true, msg: "State is required" }
				}
			},
			country: {
				type: DataTypes.STRING,
				allowNull: { args: false, msg: "Country is required" },
				validate: {
					isAlpha: { args: true, msg: "Country can contain only alphabets" },
					notEmpty: { args: true, msg: "Country is required" },
					isIn: {
						//FIPS region codes
						args: [["US", "UK", "CA", "CH"]],
						msg: "Selected category doesn't exist"
					}
				}
			},
			zipcode: {
				type: DataTypes.INTEGER,
				validate: { isNumeric: true },
				allowNull: { args: false, msg: "Zipcode is required" }
			},
			category: {
				type: DataTypes.STRING,
				allowNull: { args: false, msg: "Choose a category" },
				validate: {
					isAlpha: { args: true, msg: "Category can contain only alphabets" },
					notEmpty: { args: true, msg: "Category is required" },
					isIn: {
						args: [["food", "clothing", "beauty", "fun", "other"]],
						msg: "Selected category doesn't exist"
					}
				}
			},
			company: {
				type: DataTypes.STRING,
				allowNull: { args: false, msg: "Company Name missing" },
				validate: {
					notEmpty: { args: true, msg: "Company Name is required" }
				}
			},
			description: {
				type: DataTypes.STRING,
				allowNull: { args: false, msg: "Description missing" },
				validate: {
					notEmpty: { args: true, msg: "Description is required" },
					len: {
						args: [5, 2000],
						msg: "Description should be minimum 5 characters"
					}
				}
			},
			latitude: {
				type: DataTypes.DECIMAL,
				validate: { min: -90, max: 90 }
			},
			longitude: {
				type: DataTypes.DECIMAL,
				validate: { min: -180, max: 180 }
			},
			shouldReset: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			resetAfterDays: {
				type: DataTypes.INTEGER,
				defaultValue: 30
			},
			verified: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			member: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			uuid: {
				type: DataTypes.UUID,
				defaultValue: function () {
					return sequelize.literal("uuid_generate_v4()")
				},
				allowNull: false,
				// unique: true
			},
			note: {
				type: DataTypes.STRING
			}

		},
		{
			indexes: [
				{
					unique: true,
					fields: ["email"]
				},
				{
					unique: true,
					fields: ["uuid"]
				}
			],

			getterMethods: {
				// fullName() {
				// 	return `${this.firstName} ${this.lastName}`;
				// }
			}
		}
	);

	User.beforeCreate(user => {
		return new Promise(function (resolve) {
			var hash = bcrypt.hashSync(user.password, 12);
			user.password = hash;
			if (user.changed("street") || user.changed("city") || user.changed("state") || user.changed("zipcode") || user.changed("country")) {
				googleMapsClient.geocode({
					address: `${user.street} ${user.city}, ${user.state} ${user.country} ${user.zipcode}`
				}, function (err, response) {
					if (!err) {
						user.latitude = response.json.results[0].geometry.location.lat;
						user.longitude = response.json.results[0].geometry.location.lng;
						resolve();
					}
				});
			} else {
				resolve();
			}
		});
	});

	User.beforeBulkUpdate(function (atr) {
		return new Promise((res) => {
			if (atr.fields.includes("password")) {
				atr.attributes.password = bcrypt.hashSync(atr.attributes.password, 12);
			} else if (atr.fields.includes("street") || atr.fields.includes("city") || atr.fields.includes("state") || atr.fields.includes("zipcode") || atr.fields.includes("country")) {
				googleMapsClient.geocode({
					address: `${atr.attributes.street} ${atr.attributes.city}, ${atr.attributes.state} ${atr.attributes.country} ${atr.attributes.zipcode}`
				}, function (err, response) {
					if (!err) {
						atr.attributes.latitude = response.json.results[0].geometry.location.lat;
						atr.attributes.longitude = response.json.results[0].geometry.location.lng;
					}
				});
			}
			res();
		});
	});

	User.beforeUpdate(user => {
		return new Promise(function (resolve) {
			if (user.changed("password")) {
				var hash = bcrypt.hashSync(user.password, 12);
				user.password = hash;
			}
			if (user.changed("street") || user.changed("city") || user.changed("state") || user.changed("zipcode") || user.changed("country")) {
				googleMapsClient.geocode({
					address: `${user.street} ${user.city}, ${user.state} ${user.country} ${user.zipcode}`
				}, function (err, response) {
					if (!err) {
						user.latitude = response.json.results[0].geometry.location.lat;
						user.longitude = response.json.results[0].geometry.location.lng;
						resolve();
					}
				});
			} else {
				resolve();
			}
		});
	});

	User.associate = (db) => {
		User.hasMany(db.Deal, { onDelete: "cascade", hooks: true });
		User.hasMany(db.PhoneNumber, { onDelete: "cascade", hooks: true });
		User.hasMany(db.DealsUsed, { onDelete: "cascade", hooks: true });
	};

	return User;
};
