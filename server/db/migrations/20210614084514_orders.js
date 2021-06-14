const { onUpdateTrigger } = require("../../knexfile");

exports.up = function (knex, Promise) {
	return knex.schema.hasTable("orders").then((exists) => {
		console.log(`Table orders is ${exists ? "already" : "not yet"} created in database`);
		if (!exists) {
			return knex.schema
				.createTable("orders", (table) => {
					table.increments("id");
					table.text("name").notNullable();
					table.text("phone").notNullable();
					table.timestamps(true, true);
				})
				.then(() => {
					console.log("Created orders table.");
					knex.raw(onUpdateTrigger("orders")).then(() => {
						console.log("Created its update trigger");
					});
				});
		}
	});
};

exports.down = function (knex, Promise) {
	return knex.schema.dropTable("orders");
};
