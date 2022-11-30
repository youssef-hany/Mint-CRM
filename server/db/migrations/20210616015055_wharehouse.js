const { onUpdateTrigger } = require("../../knexfile");

exports.up = function (knex, Promise) {
	return knex.schema.hasTable("wharehouse").then((exists) => {
		console.log(`Table wharehouse is ${exists ? "already" : "not yet"} created in database`);
		if (!exists) {
			return knex.schema
				.createTable("wharehouse", (table) => {
					table.uuid("id").primary();
					table.integer("available_quantity").notNullable();
					table.integer("alert_at").notNullable();
					table.timestamps(true, true);
				})
				.then(() => {
					console.log("Created wharehouse table.");
				});
		}
	});
};

exports.down = function (knex, Promise) {
	return knex.schema.dropTable("wharehouse");
};
