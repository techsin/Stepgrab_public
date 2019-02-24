// "use strict";

// module.exports = {
// 	// up: (queryInterface, Sequelize) => {
// 	// 	queryInterface.addColumn("Users", "uuid", {
// 	// 		type: Sequelize.UUID,
// 	// 		defaultValue: Sequelize.UUIDV4,
// 	// 		allowNull: false,
// 	// 		unique: true
// 	// 	})
// 	// },
// 	up: function (queryInterface, Sequelize) {
// 		return queryInterface.sequelize.query("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";").then(function () {
// 			return queryInterface.addColumn(
// 				"Users",
// 				"uuid",
// 				{
// 					type: Sequelize.UUID,
// 					defaultValue: Sequelize.literal("uuid_generate_v4()"),
// 					allowNull: false,
// 					unique: true
// 				}
// 			);
// 		});
// 	},
// 	down: (queryInterface, Sequelize) => {
// 		queryInterface.removeColumn("Users", "uuid");
// 	}
// };
