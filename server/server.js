const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const compression = require("compression");
const fileUpload = require("express-fileupload");
const db = require("./tools/database");
// console.log(dateMod.format(today, 'YYYY-MM-DD HH:MM:ss'))
//5CD8052Z56 myPc
//CND7339RQ3 RadwanPc
//5Z30TZ1 accountant's pc
//CZC719784L ServerPC IVH

const LPORT = 3005;
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
