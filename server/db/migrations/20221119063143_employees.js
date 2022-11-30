const { onUpdateTrigger } = require("../../knexfile");

exports.up = function (knex, Promise) {
	return knex.schema.hasTable("employees").then((exists) => {
		console.log(`Table employees is ${exists ? "already" : "not yet"} created in database`);
		if (!exists) {
			return knex.schema
				.createTable("employees", (table) => {
					table.uuid("id").primary();
					table.varchar("name").notNullable();
					table.varchar("phone").unique().notNullable();
					table.text("image");
					table.text("details");
					table.timestamps(true, true);
				})
				.then(() => {
					console.log("Created employees table.");
				});
		}
	});
};

exports.down = function (knex, Promise) {
	return knex.schema.dropTable("employees");
};
