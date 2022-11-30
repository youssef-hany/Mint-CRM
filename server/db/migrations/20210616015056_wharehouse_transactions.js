const { onUpdateTrigger } = require("../../knexfile");

exports.up = function (knex, Promise) {
	return knex.schema.hasTable("wharehouse_transactions").then((exists) => {
		console.log(`Table wharehouse_transactions is ${exists ? "already" : "not yet"} created in database`);
		if (!exists) {
			return knex.schema
				.createTable("wharehouse_transactions", (table) => {
					table.increments("id").primary();
					table.text("comment");
					table.integer("quantity_taken");
					table.integer("wharehouse_item_id").unsigned().references("wharehouse.id");
					table.integer("customer_id").unsigned().references("customers.id");
					table.timestamps(true, true);
				})
				.then(() => {
					console.log("Created wharehouse_transactions table.");
				});
		}
	});
};

exports.down = function (knex, Promise) {
	return knex.schema.dropTable("wharehouse_tansactions");
};
