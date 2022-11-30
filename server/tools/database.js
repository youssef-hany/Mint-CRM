const knex = require("knex");
const dotenv = require("dotenv");
dotenv.config();
let db;
if (process.env.NODE_ENV === "production") {
	db = knex({
		client: "mysql",
		connection: {
			host: process.env.DB_HOST,
			port: process.env.DB_PORT,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME,
		},
	});
} else {
	db = knex({
		client: "mysql",
		connection: {
			host: process.env.DB_HOST,
			port: process.env.DB_PORT,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME,
		},
	});
}

module.exports = db;
