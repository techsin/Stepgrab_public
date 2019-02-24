module.exports = {
  "development": {
    "username": "techsin",
    "password": null,
    "database": "stepgrab",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "test": {
    "username": "techsin",
    "password": null,
    "database": "stepgrab",
    "host": "127.0.0.1",
    "dialect": "postgres",
  },
  "production": {
    "username": process.env.RDS_USERNAME,
    "password": process.env.RDS_PASSWORD,
    "database": process.env.RDS_DB_NAME,
    "host": process.env.RDS_HOSTNAME,
    "dialect": "postgres",
    "port": process.env.RDS_PORT,
  }
}
