module.exports = {
	development: {
		client: "pg",
		connection: {
			host: "localhost",
			port: "3004",
			user: "postgres",
			password: "1111",
			database: "mintcrm",
		},
		migrations: {
			directory: __dirname + "/db/migrations",
		},
		seeds: {
			directory: __dirname + "/db/seeds",
		},
	},
	production: {
		client: "pg",
		connection: {
			host: "localhost",
			port: "3004",
			user: "postgres",
			password: "1111",
			database: "mintcrm",
		},
		migrations: {
			directory: __dirname + "/db/migrations",
		},
		seeds: {
			directory: __dirname + "/db/seeds",
		},
	},
	onUpdateTrigger: (table) =>
		`
    CREATE TRIGGER ${table}_updated_at
    BEFORE UPDATE ON ${table}
    FOR EACH ROW
    EXECUTE PROCEDURE on_update_timestamp();
    `,
};
