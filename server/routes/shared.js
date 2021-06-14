const express = require("express");
const db = require("../tools/database");
const functions = require("../tools/functions");
const router = express.Router();
const dateMod = require("date-and-time");
let today = new Date();

router.post("/postOrder", (req, res) => {
	const name = req.body.data.name;
	const phone = req.body.data.phone;

	db("orders")
		.insert({
			name: name,
			phone: phone,
		})
		.then((result) => {
			if (result) {
				if (result) {
					res.status(200);
					console.log("New order submitted for" + name);
					res.send({ success: "Added a new order to " + name });
				} else {
					res.status(404);
					res.send({ error: "[S:1] Could not add order!" });
				}
			}
		});
});

router.get("/getorders", (req, res) => {
	db.select("*")
		.from("orders")
		.orderBy("id", "asc")
		.then((result) => {
			if (result) {
				res.json({ success: true, orders: result });
			} else {
				res.json({ error: "[SE:1] orders not found" });
			}
		})
		.catch((err) => {
			res.json({ error: "[SE:1] Error in Table, orders" });
			console.log(err);
		});
});

module.exports = router;
