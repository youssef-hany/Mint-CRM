const { onUpdateTrigger } = require("../../knexfile");

exports.up = function (knex, Promise) {
	return knex.schema.hasTable("costs").then((exists) => {
		console.log(`Table costs is ${exists ? "already" : "not yet"} created in database`);
		if (!exists) {
			return knex.schema
				.createTable("costs", (table) => {
					table.increments("id");
					table.text("name").notNullable();
					table.text("date").notNullable();
					table.integer("quantity").notNullable();
					table.integer("cost").notNullable();
					table.timestamps(true, true);
				})
				.then(() => {
					console.log("Created costs table.");
					knex.raw(onUpdateTrigger("costs")).then(() => {
						console.log("Created its update trigger");
					});
				});
		}
	});
};

exports.down = function (knex, Promise) {
	return knex.schema.dropTable("costs");
};
