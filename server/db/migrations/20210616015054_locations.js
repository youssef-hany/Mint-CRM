const { onUpdateTrigger } = require("../../knexfile");

exports.up = function (knex, Promise) {
	return knex.schema.hasTable("locations").then((exists) => {
		console.log(`Table locations is ${exists ? "already" : "not yet"} created in database`);
		if (!exists) {
			return knex.schema
				.createTable("locations", (table) => {
					table.increments("id");
					table.integer("customer_id").notNullable();
					table.text("name").notNullable();
					table.text("location").notNullable();
					table.integer("size").notNullable();
					table.text("file_name");
					table.text("path");
					table.timestamps(true, true);
				})
				.then(() => {
					console.log("Created locations table.");
					knex.raw(onUpdateTrigger("locations")).then(() => {
						console.log("Created its update trigger");
					});
				});
		}
	});
};

exports.down = function (knex, Promise) {
	return knex.schema.dropTable("locations");
};
