const { onUpdateTrigger } = require("../../knexfile");

exports.up = function (knex, Promise) {
	return knex.schema.hasTable("employment_periods").then((exists) => {
		console.log(`Table employment_periods is ${exists ? "already" : "not yet"} created in database`);
		if (!exists) {
			return knex.schema
				.createTable("employment_periods", (table) => {
					table.increments("id").primary();
					table.integer("employee_id").unsigned().references("employees.id").notNullable();
					table.text("period_details");
					table.varchar("status");
					table.boolean("isInHouse");
					table.varchar("position").notNullable();
					table.varchar("from");
					table.varchar("to");
					table.timestamps(true, true);
				})
				.then(() => {
					console.log("Created employment_periods table.");
				});
		}
	});
};

exports.down = function (knex, Promise) {
	return knex.schema.dropTable("employment_periods");
};
