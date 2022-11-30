const { onUpdateTrigger } = require("../../knexfile");

exports.up = function (knex, Promise) {
	return knex.schema.hasTable("costs").then((exists) => {
		console.log(`Table costs is ${exists ? "already" : "not yet"} created in database`);
		if (!exists) {
			return knex.schema
				.createTable("costs", (table) => {
					table.increments("id").primary();
					table.varchar("name").notNullable();
					table.varchar("date").notNullable();
					table.integer("wharehouse_id").unsigned().references("wharehouse.id").nullable();
					table.integer("quantity").notNullable();
					table.integer("total").notNullable();
					table.timestamps(true, true);
				})
				.then(() => {
					console.log("Created costs table.");
				});
		}
	});
};

exports.down = function (knex, Promise) {
	return knex.schema.dropTable("costs");
};
