const { onUpdateTrigger } = require("../../knexfile");

exports.up = function (knex, Promise) {
	return knex.schema.hasTable("employment_assets").then((exists) => {
		console.log(`Table employment_assets is ${exists ? "already" : "not yet"} created in database`);
		if (!exists) {
			return knex.schema
				.createTable("employment_assets", (table) => {
					table.uuid("id").primary();
					table.uuid("employment_period_id").references("employment_periods.id").notNullable();
					table.varchar("file_name");
					table.text("path");
					table.timestamps(true, true);
				})
				.then(() => {
					console.log("Created employment_assets table.");
				});
		}
	});
};

exports.down = function (knex, Promise) {
	return knex.schema.dropTable("employment_assets");
};
