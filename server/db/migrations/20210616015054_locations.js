const { onUpdateTrigger } = require("../../knexfile");

exports.up = function (knex, Promise) {
	return knex.schema.hasTable("locations").then((exists) => {
		console.log(`Table locations is ${exists ? "already" : "not yet"} created in database`);
		if (!exists) {
			return knex.schema
				.createTable("locations", (table) => {
					table.increments("id").primary();
					table.integer("customer_id").unsigned().notNullable().references("customers.id");
					table.varchar("name").notNullable();
					table.text("location").notNullable();
					table.integer("size").notNullable();
					table.varchar("file_name");
					table.text("path");
					table.timestamps(true, true);
				})
				.then(() => {
					console.log("Created locations table.");
				});
		}
	});
};

exports.down = function (knex, Promise) {
	return knex.schema.dropTable("locations");
};
