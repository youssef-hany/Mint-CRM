const express = require("express");
const db = require("../tools/database");
const functions = require("../tools/functions");
const router = express.Router();
const dateMod = require("date-and-time");
const fs = require("fs");

router.post("/newEmployee", (req, res) => {
	const employeeName = req.body.name;
	const employeePhone = req.body.phone;
	const employmentDetails = req.body.details;
	const employmentStatus = req.body.status;
	const position = req.body.employeePosition;
	const from = req.body.from;
	const to = req.body.to;
	const { profileImage } = req.files;
	delete req.files.profileImage;
	req.files = !req.files?.length ? [req.files] : req.files;
	if (req.files.file === null) {
		res.json({ error: "[S] No file has been chosen..." });
		console.log("no files sent");
	} else {
		const filesLen = Object.keys(req.files[0])?.length;
		if (filesLen) {
			db.select("*")
				.from("employees")
				.where("phone", "=", employeePhone)
				.then((employeesResult) => {
					if (employeesResult && employeesResult.length) {
						res.send({ error: "[S:3] Employee with this phone is already in database!" });
					} else {
						let imagePath = null;
						if (profileImage) {
							imagePath = `${__dirname}../../../front/public/uploads/employees/${
								employeeName + "_" + profileImage.name.split(".")[0] + "." + profileImage.name.split(".")[1]
							}`;
						}
						db("employees")
							.insert({
								name: employeeName.toLowerCase(),
								phone: employeePhone,
								image: imagePath || "",
								details: employmentDetails,
							})
							.returning("*")
							.then((employee) => {
								if (employee && employee.length) {
									if (imagePath) {
										profileImage.mv(imagePath, (err) => {
											if (err) {
												console.log(err);
												success = false;
												return;
											}
										});
									}
									db("employment_periods")
										.insert({
											employee_id: employee[0].id,
											status: employmentStatus,
											period_details: employmentDetails,
											position: position,
											from,
											to,
										})
										.returning("*")
										.then((employeePeriod) => {
											if (employeePeriod && employeePeriod.length) {
												let success = true;
												for (let i = 0; i < filesLen; i++) {
													let fileItem = req.files[0]["file" + i];
													const filePath = `${__dirname}../../../front/public/uploads/employees/${
														employeeName + "_" + fileItem.name.split(".")[0] + "." + fileItem.name.split(".")[1]
													}`;
													db("employment_assets")
														.insert({
															employment_period_id: employeePeriod[0].id,
															file_name: fileItem.name,
															path: filePath,
														})
														.returning("*")
														.then((employeeAsset) => {
															if (employeeAsset && employeeAsset.length) {
																fileItem.mv(filePath, (err) => {
																	if (err) {
																		console.log(err);
																		success = false;
																		return;
																	}
																});
															}
														})
														.catch((err) => {
															console.log(err);
															return;
														});
												}
												if (success) {
													res.send({ success: `[S] Employee has been added successfully!` });
												}
											}
										})
										.catch((err) => {
											res.json({ error: `[S] Error in adding Employment Periods check server!` });
											console.log(err);
										});
								} else {
									res.send({
										error: "[E] This employee was not found in the database!",
									});
								}
							});
					}
				});
		} else {
			res.send({
				error: "[E] Employment documents are missing!",
			});
		}
	}
});

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
						size: isNaN(parseInt(size)) ? 0 : parseInt(size),
					})
					.then((result) => {
						if (result) {
							res.status(200);
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
				res.json({ error: "[SE:1] customers not found" });
			}
		})
		.catch((err) => {
			res.json({ error: "[SE:1] Error in Table, customers" });
			console.log(err);
		});
});

router.post("/addPeriodToEmployee", (req, res) => {
	const employeeId = JSON.parse(req.body.employee).id;
	const employeeName = JSON.parse(req.body.employee).name;
	const employmentPeriodDetails = req.body.period_details;
	const employmentStatus = req.body.status;
	const position = req.body.position;
	const from = req.body.from;
	const to = req.body.from;
	req.files = !req.files?.length ? [req.files] : req.files;
	db.select("*")
		.from("employees")
		.where({
			id: employeeId,
		})
		.returning("*")
		.then(async (employee) => {
			if (employee) {
				const employeeObject = employee[0];
				db.select("*")
					.from("employment_periods")
					.where({
						employee_id: employeeObject.id,
						from,
						to,
					})
					.returning("*")
					.then((employmentPeriod) => {
						if (employmentPeriod && employmentPeriod.length) {
							res.send({ error: "Already has an entry with the same time frame" });
						} else {
							db("employment_periods")
								.insert({
									employee_id: employeeObject.id,
									status: employmentStatus,
									period_details: employmentPeriodDetails,
									position: position,
									from,
									to,
								})
								.returning("*")
								.then((employeePeriod) => {
									if (employeePeriod && employeePeriod.length) {
										if (req.files?.length) {
											let success = true;
											const filesLen = Object.keys(req.files[0])?.length;
											for (let i = 0; i < filesLen; i++) {
												let fileItem = req.files[0]["file" + i];
												const filePath = `${__dirname}../../../front/public/uploads/employees/${
													employeeName + "_" + fileItem.name.split(".")[0] + "." + fileItem.name.split(".")[1]
												}`;
												db("employment_assets")
													.insert({
														employment_period_id: employeePeriod[0].id,
														file_name: fileItem.name,
														path: filePath,
													})
													.returning("*")
													.then((employeeAsset) => {
														if (employeeAsset && employeeAsset.length) {
															fileItem.mv(filePath, (err) => {
																if (err) {
																	console.log(err);
																	success = false;
																	return;
																}
															});
														}
													})
													.catch((err) => {
														console.log(err);
														return;
													});
											}
											if (success) {
												res.send({ success: `[S] Employee has been added successfully!` });
											}
										} else {
											res.send({
												error: "[E] Employment documents are missing!",
											});
										}
									}
								})
								.catch((err) => {
									res.json({ error: `[S] Error in adding Employment Periods check server!` });
									console.log(err);
								});
						}
					});
			} else {
				res.json({ error: "[SE:1] employee not found" });
			}
		})
		.catch((err) => {
			res.json({ error: "[SE:1] Error in Table, employees" });
			console.log(err);
		});
});

router.get("/GetWharehouseItem/:id", (req, res) => {
	const wharehouseId = req.params.id;
	db.select("*")
		.from("wharehouse")
		.leftJoin("costs", "costs.wharehouse_id", "wharehouse.id")
		.where({
			"wharehouse.id": wharehouseId,
		})
		.returning("*")
		.then(async (item) => {
			if (item) {
				let itemObject = item[0];
				itemObject.history = await db
					.select("*")
					.from("wharehouse_transactions")
					.leftJoin("customers", "customers.id", "wharehouse_transactions.customer_id")
					.where({
						wharehouse_item_id: itemObject.id,
					})
					.returning("*");

				return res.send({ success: true, wharehouseItem: itemObject });
			} else {
				return res.send({ error: "[SE:1] wharehouse Item not found" });
			}
		})
		.catch((err) => {
			console.log(err);
			return res.status(404).send({ error: "[SE:1] Error in selecting, wharehouse, check server" });
		});
});

router.get("/getEmployee/:id", (req, res) => {
	const employeeId = req.params.id;
	db.select("*")
		.from("employees")
		.where({
			id: employeeId,
		})
		.orderBy("id", "asc")
		.returning("*")
		.then(async (employee) => {
			if (employee) {
				const employeeObject = employee[0];
				const employmentPeriods = await db
					.select("*")
					.from("employment_periods")
					.where({
						employee_id: employeeObject.id,
					})
					.orderBy("id", "asc")
					.returning("*");
				const periods = employmentPeriods.map((period) => {
					let promise = new Promise((resolve, reject) => {
						db.select("*")
							.from("employment_assets")
							.where({
								employment_period_id: period.id,
							})
							.orderBy("id", "asc")
							.returning("*")
							.then((employmentAssets) => {
								period.assets = employmentAssets;
								resolve(period);
							});
					});
					return promise;
				});
				await Promise.all(periods).then((resolvedPeriods) => {
					employeeObject.periods = resolvedPeriods;
					res.json({ success: true, employee: employeeObject });
				});
			} else {
				res.json({ error: "[SE:1] employees not found" });
			}
		})
		.catch((err) => {
			res.json({ error: "[SE:1] Error in Table, employees" });
			console.log(err);
		});
});

router.get("/getWharehouse", (req, res) => {
	db.select("*")
		.distinct("costs.wharehouse_id", "wharehouse.*")
		.from("wharehouse")
		.join("costs", "wharehouse.id", "costs.wharehouse_id")
		.orderBy("wharehouse.id", "desc")
		.returning("*")
		.then((items) => {
			let whareHouseArray;
			let uniqueIds = [];
			items = items.filter((item) => {
				if (uniqueIds.includes(item.id)) {
					return false;
				} else {
					uniqueIds.push(item.id);
					return true;
				}
			});
			if (items) {
				whareHouseArray = items.map(async (item) => {
					let itemObject = item;
					itemObject.history = await db
						.select("*")
						.from("wharehouse_transactions")
						.leftJoin("customers", "customers.id", "wharehouse_transactions.customer_id")
						.where({
							wharehouse_item_id: item.id,
						})
						.returning("*")
						.catch((err) => {
							res.send({ error: "[SE:1] Error in Table, wharehouse_transactions, check server" });
							console.log(err);
						});
					return itemObject;
				});

				Promise.all(whareHouseArray).then((finalSamples) => {
					res.send({ success: true, wharehouse: finalSamples });
				});
			} else {
				res.send({ error: "[SE:1] wharehouse Item not found" });
			}
		})
		.catch((err) => {
			res.send({ error: "[SE:1] Error in Table, wharehouse, check server" });
			console.log(err);
		});
});

router.get("/getEmployees", (req, res) => {
	db.select("*")
		.from("employees")
		.orderBy("id", "desc")
		.returning("*")
		.then((employees) => {
			let employeesArray;
			if (employees) {
				employeesArray = employees.map(async (employee) => {
					const employeeObject = employee;
					const employmentPeriods = await db
						.select("*")
						.from("employment_periods")
						.where({
							employee_id: employee.id,
						})
						.returning("*");
					const periods = employmentPeriods.map((period) => {
						let promise = new Promise((resolve, reject) => {
							db.select("*")
								.from("employment_assets")
								.where({
									employment_period_id: period.id,
								})
								.returning("*")
								.then((employmentAssets) => {
									period.assets = employmentAssets;
									resolve(period);
								});
						});
						return promise;
					});
					return Promise.all(periods).then((resolvedPeriods) => {
						employeeObject.periods = resolvedPeriods;
						return employeeObject;
					});
				});

				Promise.all(employeesArray).then((finalSamples) => {
					res.json({ success: true, employees: finalSamples });
				});
			} else {
				res.json({ error: "[SE:1] employees not found" });
			}
		})
		.catch((err) => {
			res.json({ error: "[SE:1] Error in Table, employees" });
			console.log(err);
		});
});

router.post("/updateEmployee", (req, res) => {
	const employeeId = req.body.id;
	const currentImage = req.body.image;
	const employeeName = req.body.name;
	const employeePhone = req.body.phone;
	const employmentDetails = req.body.details;
	const employeeStatus = req.body.status;
	const newPosition = req.body.employeePosition;
	const isInHouse = req.body.isInHouse;
	const image = req.files?.profileImage;
	db.select("*")
		.from("employees")
		.where("id", "=", employeeId)
		.then((result) => {
			if (result && result.length) {
				let imagePath = null;
				if (image) {
					imagePath = `${__dirname}../../../front/public/uploads/employees/${
						employeeName + "_" + image.name.split(".")[0] + "." + image.name.split(".")[1]
					}`;
				}
				db("employees")
					.where({
						id: employeeId,
					})
					.update({
						name: employeeName,
						phone: employeePhone,
						details: employmentDetails,
						image: imagePath || currentImage,
					})
					.returning("*")
					.then((result) => {
						if (result && result.length) {
							if (image) {
								image.mv(imagePath, (err) => {
									if (err) {
										console.log(err);
										success = false;
										return;
									}
								});
							}
							db.select("*")
								.from("employment_periods")
								.where({
									employee_id: employeeId,
								})
								.orderBy("id", "asc")
								.then((periodsResults) => {
									if (periodsResults && periodsResults.length) {
										const lastPeriod = periodsResults[periodsResults.length - 1]?.id;
										db("employment_periods")
											.where({
												id: lastPeriod,
											})
											.update({
												status: employeeStatus,
												position: newPosition,
												isInHouse: isInHouse || null,
											})
											.then((periodsResults) => {
												if (periodsResults) {
													res.send({ success: `[S] Employee Updated` });
												} else {
													res.send({ error: `[S] Error in Updating Employee!` });
												}
											})
											.catch((err) => {
												res.json({ error: `[S] Error when Updating Period table data check server!` });
												console.log(err);
											});
									} else {
										res.send({ success: `[S] Only Updated Employee basic data` });
									}
								})
								.catch((err) => {
									res.json({ error: `[S] Error when Selecting Period table data check server!` });
									console.log(err);
								});
						}
					})
					.catch((err) => {
						console.log(err);
						if (err.toString().includes("duplicate key")) {
							res.json({ error: `[S] This Phone number already exists!` });
						} else {
							res.json({ error: `[S] An unexpected error occured while saving an employee. Check the server logs!` });
						}
					});
			} else {
				res.send({
					error: "[E] This employee was not found in the database!",
				});
			}
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
	const location = req.body.data.location;
	const size = req.body.data.size;
	const price = req.body.data.price;
	const startTime = req.body.data.startTime;
	const endTime = req.body.data.endTime;
	const workers = req.body.data.workers;

	db.select("*")
		.from("customers")
		.where("name", "=", name.toLowerCase())
		.then((customer) => {
			if (customer && customer.length) {
				db("orders")
					.insert({
						customer_id: customer[0].id,
						name,
						phone,
						date,
						location_id,
						location,
						size,
						price,
						start_time: startTime,
						end_time: endTime,
						workers,
					})
					.then((result) => {
						if (result) {
							if (result) {
								res.status(200);
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
				Promise.all(
					result.map((order) => {
						let location = "";
						return db //Promise.all takes an iterable and must return from that iterable thus return db
							.select("*")
							.from("locations")
							.where("id", "=", order.location_id)
							.then((result) => {
								if (result && result.length) {
									location = result[0].location;
								}
								let newOrder = {
									Id: order.id,
									Subject: order.name + " | " + order.phone + " | " + location,
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
					})
				).then(() => {
					res.json(newOrders);
				});
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
router.get("/getlocations", (req, res) => {
	db.select("*")
		.from("locations")
		.orderBy("id", "asc")
		.then((result) => {
			if (result) {
				res.json({ success: true, locations: result });
			} else {
				res.json({ error: "[SE:1] locations not found" });
			}
		})
		.catch((err) => {
			res.json({ error: "[SE:1] Error in Table, locations" });
			console.log(err);
		});
});
router.post("/addWharehouseTransactionItem", (req, res) => {
	const { comment, quantity_taken, id, customer_id } = req.body.data;
	db.select("*")
		.from("wharehouse")
		.where({
			id: id,
		})
		.then((wharehouseItem) => {
			if (wharehouseItem && wharehouseItem.length > 0) {
				let remainingAmount = parseInt(wharehouseItem[0].available_quantity) - parseInt(quantity_taken);
				if (remainingAmount >= 0) {
					db("wharehouse")
						.where({
							id: id,
						})
						.update({
							available_quantity: remainingAmount,
						})
						.then((result) => {
							if (result) {
								db("wharehouse_transactions")
									.insert({
										comment,
										quantity_taken,
										wharehouse_item_id: id,
										customer_id,
									})
									.then((result) => {
										if (result) {
											if (result) {
												res.status(200);
												res.send({ success: "New transaction submitted in the wharehouse" });
											} else {
												res.status(404);
												res.send({ error: "[S:1] Could not add Cost!" });
											}
										}
									})
									.catch((err) => {
										console.log(err);
										return res.send({ error: "Error in saving the transactions in the wharehouse, check the server" });
									});
							}
						});
				}
			}
		});
});

router.post("/addNewCost", (req, res) => {
	const wharehouse_item_id = req.body.data.id;
	const name = req.body.data.name;
	const date = req.body.data.date;
	const quantity = req.body.data.quantity;
	const amount = req.body.data.amount;
	const wharehouseItemCheck = req.body.data.wharehouseItemCheck;
	const alert_at = req.body.data.alert_at || null;
	if (wharehouseItemCheck) {
		db.select("*")
			.from("wharehouse")
			.where({
				id: wharehouse_item_id || null,
			})
			.then((result) => {
				new Promise((resolve, reject) => {
					if (result && result.length > 0) {
						db("wharehouse")
							.where({
								id: result[0].id,
							})
							.update({
								available_quantity: parseInt(result[0].available_quantity) + parseInt(quantity),
								alert_at: alert_at || result[0].alert_at,
							})
							.returning("*")
							.then((result) => {
								resolve(result);
							})
							.catch((err) => {
								reject(err);
								console.log(err);
							});
					} else {
						db("wharehouse")
							.insert({
								available_quantity: quantity,
								alert_at,
							})
							.returning("*")
							.then((result) => {
								resolve(result);
							})
							.catch((err) => {
								reject(err);
								console.log(err);
							});
					}
				}).then((result) => {
					if (result && result.length > 0) {
						db("costs")
							.insert({
								name: name,
								date: date,
								quantity: quantity,
								total: amount,
								wharehouse_id: result[0].id || null,
							})
							.then((result) => {
								if (result) {
									if (result) {
										res.status(200);
										res.send({ success: "New Cost " + name + " submitted and is tracked in the wharehouse" });
									} else {
										res.status(404);
										res.send({ error: "[S:1] Could not add Cost!" });
									}
								}
							})
							.catch((err) => {
								res.send({ error: "[S]: Error occured while saving costs, check server" });
								console.log(err);
							});
					}
				});
			});
	} else {
		db("costs")
			.insert({
				name: name,
				date: date,
				quantity: quantity,
				total: amount,
			})
			.then((result) => {
				if (result) {
					if (result) {
						res.status(200);
						res.send({ success: "New Cost " + name + " submitted " });
					} else {
						res.status(404);
						res.send({ error: "[S:1] Could not add Cost!" });
					}
				}
			})
			.catch((err) => {
				res.send({ error: "[S]: Error occured while saving costs, check server" });
				console.log(err);
			});
	}
});
router.get("/getCosts", (req, res) => {
	db.select("*")
		.from("costs")
		.orderBy("id", "desc")
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
