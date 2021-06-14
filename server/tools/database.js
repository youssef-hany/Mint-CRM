const knex = require("knex");

const db = knex({
	client: "pg",
	connection: {
		host: "localhost",
		port: "3004",
		user: "postgres",
		password: "1111",
		database: "mintcrm",
	},
});

module.exports = db;
