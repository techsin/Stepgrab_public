module.exports = (sequelize, DataTypes) => {
	var EmailQueue = sequelize.define(
		"EmailQueue",
		{
			to: DataTypes.STRING,
            from: DataTypes.STRING,
            subject: DataTypes.STRING,
            body: DataTypes.STRING,
            sendBy: DataTypes.DATE
		}
	);

	return EmailQueue;
};
