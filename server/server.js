const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const compression = require("compression");
const fileUpload = require("express-fileupload");
const serialNumber = require("serial-number");
const db = require("./tools/database");
// console.log(dateMod.format(today, 'YYYY-MM-DD HH:MM:ss'))
//5CD8052Z56 myPc
//CZC719784L ServerPC IVH
//console.log(`PC Serial Number: [${SERIAL}]`);

serialNumber((err, SERIAL) => {
	if (SERIAL === "5CD8052Z56") {
		process.env.NODE_ENV = "production";

		const LPORT = 3005;
		console.log(`PC Serial Number: [${SERIAL}]`);
		const app = express();

		//disabling encryption/decryption and using compression for faster performance
		app.set("etag", false);
		app.set("x-powered-by", false);
		app.use(compression()); //uses gzip compression
		//parsing JSON and cross origin request to avoid error when from LAN ip
		app.use(bodyParser.json());
		app.use(express.json({ limit: "20mb" }));
		app.use(express.urlencoded({ extended: true, limit: "20mb" }));
		app.use(cors());
		app.use(fileUpload());

		const shared = require("./routes/shared");
		app.use(shared);

		try {
			app.listen(LPORT, () => {
				console.log(`Server running on port ${LPORT}`);
			});
		} catch (error) {
			console.log(`Error in Listen: ${error}`);
			console.log(`Closing now...`);

			setTimeout(() => {}, 5000);
		}

		process.on("SIGINT", function () {
			console.log("Stopping Server...");
			//closes db connection and exits process safely on SIGINT (CTRL+C)
			db.destroy(function (err) {
				process.exit(err ? 1 : 0);
			});
		});
	} else {
		//MUST CONSOLE LOG TO GET SERIAL FIRST, HARD CODE IT AT THE TOP IF STATEMENT, THEN USE THE SERVER
		console.log(`PC with serial[${SERIAL}] has not been subscribed`);
		console.log(`Closing now...`);

		setTimeout(() => {}, 5000);
	}
});
