const { onUpdateTrigger } = require("../../knexfile");

exports.up = function (knex, Promise) {
	return knex.schema.hasTable("customers").then((exists) => {
		console.log(`Table customers is ${exists ? "already" : "not yet"} created in database`);
		if (!exists) {
			return knex.schema
				.createTable("customers", (table) => {
					table.increments("id");
					table.text("name").notNullable();
					table.text("phone").notNullable();
					table.timestamps(true, true);
				})
				.then(() => {
					console.log("Created customers table.");
					knex.raw(onUpdateTrigger("customers")).then(() => {
						console.log("Created its update trigger");
					});
				});
		}
	});
};

exports.down = function (knex, Promise) {
	return knex.schema.dropTable("customers");
};
