const { onUpdateTrigger } = require("../../knexfile");

exports.up = function (knex, Promise) {
	return knex.schema.hasTable("orders").then((exists) => {
		console.log(`Table orders is ${exists ? "already" : "not yet"} created in database`);
		if (!exists) {
			return knex.schema
				.createTable("orders", (table) => {
					table.uuid("id").primary();
					table.integer("customer_id").notNullable();
					table.varchar("name").notNullable();
					table.varchar("phone").notNullable();
					table.varchar("date").notNullable();
					table.integer("location_id").notNullable();
					table.text("location").notNullable();
					table.integer("size").notNullable();
					table.integer("price").notNullable();
					table.integer("cost");
					table.varchar("start_time").notNullable();
					table.varchar("end_time").notNullable();
					table.integer("workers").notNullable();
					table.timestamps(true, true);
				})
				.then(() => {
					console.log("Created orders table.");
				});
		}
	});
};

exports.down = function (knex, Promise) {
	return knex.schema.dropTable("orders");
};
