const express = require("express");
const db = require("../tools/database");
const functions = require("../tools/functions");
const router = express.Router();
const dateMod = require("date-and-time");
const { orderBy } = require("../tools/database");
const fs = require("fs");

router.post("/newCustomer", (req, res) => {
	const name = req.body.data.name;
	const phone = req.body.data.phone;

	db.select("*")
		.from("customers")
		.where("name", "=", name.toLowerCase())
		.then((result) => {
			if (result && result.length) {
				res.send({ error: "[S:3] Customer already in database!" });
			} else {
				db("customers")
					.insert({
						name: name.toLowerCase(),
						phone: phone,
					})
					.then((result) => {
						if (result) {
							res.status(200);
							console.log("New customer created " + name);
							res.send({ success: "Added a new customer " + name });
						} else {
							res.status(404);
							res.send({ error: "[S:2] Could not add customer!" });
						}
					});
			}
		});
});
router.post("/addCustomerLocation", (req, res) => {
	const customer_id = req.body.data.customer_id;
	const name = req.body.data.name;
	const location = req.body.data.location;
	const size = req.body.data.size;
	db.select("*")
		.from("customers")
		.where("id", "=", parseInt(customer_id))
		.then((result) => {
			if (result && result.length) {
				db("locations")
					.insert({
						customer_id: parseInt(customer_id),
						name: name,
						location: location,
						size: parseInt(size),
					})
					.then((result) => {
						if (result) {
							res.status(200);
							console.log("New location added for " + name);
							res.send({ success: "New location added for " + name });
						} else {
							res.status(404);
							res.send({ error: "[S:5] Could not add location!" });
						}
					});
			} else {
				res.send({ error: "[S:6] Customer not found!" });
			}
		});
});

router.post("/getCustomerLocations", (req, res) => {
	const customer_id = req.body.id;
	db.select("*")
		.from("locations")
		.orderBy("id", "asc")
		.where("customer_id", "=", parseInt(customer_id))
		.then((result) => {
			if (result && result.length) {
				res.status(200);
				res.send({ locations: result });
			}
		})
		.catch((err) => {
			console.log(err);
			res.json({ error: "[SE:8] Error in Table, locations" });
		});
});

router.get("/getCustomers", (req, res) => {
	db.select("*")
		.from("customers")
		.orderBy("id", "asc")
		.then((result) => {
			if (result) {
				res.json({ success: true, customers: result });
			} else {
				res.json({ error: "[SE:1] orders not found" });
			}
		})
		.catch((err) => {
			res.json({ error: "[SE:1] Error in Table, orders" });
			console.log(err);
		});
});

router.post("/updateCost", (req, res) => {
	const { order_id, newCost } = req.body.data;
	db.select("*")
		.from("orders")
		.where("id", "=", order_id)
		.then((result) => {
			if (result && result.length) {
				db("orders")
					.where("id", "=", order_id)
					.update({
						cost: newCost,
					})
					.then((result) => {
						if (result) {
							res.json({ success: `[S] Cost Updated` });
						} else {
							res.json({ error: `[S] Error in Updating Cost!` });
						}
					})
					.catch((err) => {
						res.json({ error: `[S] Error when Updating check server!` });
						console.log(err);
					});
			} else {
				res.send({
					error: "[E] This order was not found in the database!",
				});
			}
		});
});

router.post("/removepdf", (req, res) => {
	const { location_id, path } = req.body.data;

	console.log(location_id);
	db.select("*")
		.from("locations")
		.where("id", "=", location_id)
		.then((result) => {
			if (result && result.length) {
				db("locations")
					.where("id", "=", location_id)
					.update({
						file_name: "",
						path: "",
					})
					.then((result) => {
						fs.unlink(`${path}`, (err) => {
							if (err) {
								res.json({ error: "[S] Error from server", err });
								console.log(err);
							} else {
								if (result) {
									res.json({ success: `[S] PDF deleted!` });
								}
							}
						});
					})
					.catch((err) => {
						res.json({ error: `[S] Error in deleting PDF check server!` });
						console.log(err);
					});
			} else {
				res.send({
					error: "[E] This location was not found in the database!",
				});
			}
		});
});

router.post("/uploadpdf", (req, res) => {
	if (req.files === null) {
		res.json({ error: "[S] No file has been chosen..." });
		console.log("no files sent");
	} else {
		const { customer_name, location_id } = req.body;
		const { name, data } = req.files.file;
		const file = req.files.file;
		db.select("*")
			.from("locations")
			.where("id", "=", location_id)
			.then((result) => {
				if (result && result.length) {
					if (name && data) {
						db("locations")
							.where("id", "=", location_id)
							.update({
								file_name: name,
								path: `${__dirname}../../../front/public/uploads/pdfs/${customer_name + "." + file.name.split(".")[1]}`,
							})
							.then((result) => {
								file.mv(
									`${__dirname}../../../front/public/uploads/pdfs/${customer_name + "." + file.name.split(".")[1]}`,
									(err) => {
										if (err) {
											res.json({ error: "[S] Error from server", err });
											console.log(err);
										} else {
											if (result) {
												res.json({ success: `[S] PDF has been uploaded successfully!` });
											}
										}
									}
								);
							})
							.catch((err) => {
								res.json({ error: `[S] Error in adding PDF check server!` });
								console.log(err);
							});
					}
				} else {
					res.send({
						error: "[E] This location was not found in the database!",
					});
				}
			});
	}
});
router.post("/postOrder", (req, res) => {
	const name = req.body.data.name;
	const phone = req.body.data.phone;
	const date = req.body.data.date;
	const location_id = req.body.data.location_id;
	const size = req.body.data.size;
	const price = req.body.data.price;
	const startTime = req.body.data.startTime;
	const endTime = req.body.data.endTime;

	db.select("*")
		.from("customers")
		.where("name", "=", name.toLowerCase())
		.then((customer) => {
			if (customer && customer.length) {
				db("orders")
					.insert({
						customer_id: customer[0].id,
						name: name,
						phone: phone,
						date: date,
						location_id,
						size: size,
						price: price,
						start_time: startTime,
						end_time: endTime,
					})
					.then((result) => {
						if (result) {
							if (result) {
								res.status(200);
								console.log("New order submitted for " + name);
								res.send({ success: "Added a new order to " + name });
							} else {
								res.status(404);
								res.send({ error: "[S:1] Could not add order!" });
							}
						}
					});
			} else {
				res.send({ error: "[SE:4] Could not find customer with name " + name });
			}
		});
});

router.get("/getAppointments", (req, res) => {
	db.select("*")
		.from("orders")
		.orderBy("id", "asc")
		.then((result) => {
			if (result && result.length) {
				let newOrders = [];
				result.map((order) => {
					let newOrder = {
						Id: order.id,
						Subject: order.name + " | " + order.phone,
						StartTime: new Date(
							order.date.split("-")[0],
							parseInt(order.date.split("-")[1]) - 1,
							order.date.split("-")[2],
							order.start_time.split(":")[0],
							order.start_time.split(":")[1]
						),
						EndTime: new Date(
							order.date.split("-")[0],
							parseInt(order.date.split("-")[1]) - 1,
							order.date.split("-")[2],
							order.end_time.split(":")[0],
							order.end_time.split(":")[1]
						),
						IsAllDay: false,
					};
					newOrders.push(newOrder);
				});
				res.json(newOrders);
			} else {
				res.json({ error: "[SE:1] orders not found" });
			}
		})
		.catch((err) => {
			res.json({ error: "[SE:1] Error in Table, orders" });
			console.log(err);
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

router.post("/addNewCost", (req, res) => {
	const name = req.body.data.name;
	const date = req.body.data.date;
	const quantity = req.body.data.quantity;
	const cost = req.body.data.cost;

	db("costs")
		.insert({
			name: name,
			date: date,
			quantity: quantity,
			cost: cost,
		})
		.then((result) => {
			if (result) {
				if (result) {
					res.status(200);
					console.log("New Cost " + name + " submitted for ");
					res.send({ success: "New Cost " + name + " submitted for " });
				} else {
					res.status(404);
					res.send({ error: "[S:1] Could not add Cost!" });
				}
			}
		});
});
router.get("/getCosts", (req, res) => {
	db.select("*")
		.from("costs")
		.orderBy("id", "asc")
		.then((result) => {
			if (result) {
				res.json({ success: true, costs: result });
			} else {
				res.json({ error: "[SE:1] costs not found" });
			}
		})
		.catch((err) => {
			res.json({ error: "[SE:1] Error in Table, costs" });
			console.log(err);
		});
});

module.exports = router;
