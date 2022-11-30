import dateFormat from "dateformat";
import React, { useState } from "react";
import "./Customers.css";
export default function Customers(props) {
	const {
		GetCustomerLocations,
		AddCustomerLocation,
		handleFile,
		UploadPDF,
		RemovePDF,
		customerLocations,
		allOrders,
		allCustomers,
	} = props;
	const [chosenCustomer, setChosenCustomer] = useState("");
	const [location, setLocation] = useState("");
	const [size, setSize] = useState("");
	let locationData = {
		customer_id: chosenCustomer.id,
		name: chosenCustomer.name,
		location,
		size,
	};
	function AddLocation(e) {
		AddCustomerLocation(locationData).then((result) => {
			setLocation("");
			setSize("");
			GetCustomerLocations(chosenCustomer.id);
		});
	}
	function ChooseCustomer(e) {
		allCustomers.forEach((customer) => {
			if (e.target.value.toLowerCase() === customer.name.toLowerCase()) {
				setChosenCustomer(customer);
				GetCustomerLocations(customer.id);
			}
		});
	}
	function preUploadPdf(location, e) {
		let data = {
			customer_id: location.customer_id,
			customerName: location.name,
			location_id: location.id,
		};
		UploadPDF(data, e);
	}
	function preRemovePDF(location, e) {
		let data = {
			customer_id: location.customer_id,
			location_id: location.id,
			path: location.path,
		};
		RemovePDF(data, e);
	}
	let totalPrice = 0;
	let totalCost = 0;

	return (
		<div className="mt-5">
			<input
				id="inputName"
				list="customers"
				placeholder="Choose a customer"
				name="customerName"
				type="text"
				className="form-control mx-auto m-2 inputField"
				defaultValue={chosenCustomer.name}
				onChange={ChooseCustomer}
			></input>
			<datalist id="customers" name="customers" className="">
				{allCustomers.map((customer, index) => {
					return <option key={index} value={customer.name}></option>;
				})}
			</datalist>
			{chosenCustomer.phone ? <p>Phone: {chosenCustomer.phone}</p> : ""}
			{chosenCustomer ? (
				<div className="row mt-5">
					<div className="col-sm-2">
						<div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
							<a
								className="nav-link active"
								id="v-pills-locations-tab"
								data-toggle="pill"
								href="#v-pills-locations"
								role="tab"
								aria-controls="v-pills-locations"
								aria-selected="true"
							>
								Locations
							</a>
							<a
								className="nav-link"
								id="v-pills-prevOrders-tab"
								data-toggle="pill"
								href="#v-pills-prevOrders"
								role="tab"
								aria-controls="v-pills-prevOrders"
								aria-selected="false"
							>
								Previous Orders
							</a>
						</div>
					</div>
					<div className="col-sm-10">
						<div className="tab-content" id="v-pills-tabContent">
							<div
								className="tab-pane fade show active"
								id="v-pills-locations"
								role="tabpanel"
								aria-labelledby="v-pills-locations-tab"
							>
								{customerLocations && customerLocations.length ? (
									<ul className="list-group">
										{customerLocations.map((location, idx) => {
											return (
												<div className="pointerContainer">
													<li
														className="list-group-item d-flex justify-content-between align-items-center w-50 mx-auto "
														key={idx}
														data-toggle="collapse"
														data-target={"#collapseDatasheet" + idx}
														aria-controls="collapseDatasheet"
													>
														<textarea className="form-control w-75" value={location.location} disabled></textarea>

														<span className="badge badge-primary badge-pill">{location.size} M</span>
													</li>
													<div className="collapse w-50 mx-auto" id={"collapseDatasheet" + idx}>
														<div className="card card-body">
															{location.file_name ? (
																<form className="removePdfForm" onSubmit={(e) => preRemovePDF(location, e)}>
																	<div>
																		<a
																			target="_blank"
																			rel="noreferrer noopenner"
																			href={process.env.PUBLIC_URL + "/uploads" + location.path.split("/uploads")[1]}
																		>
																			{location.file_name}
																		</a>
																		<button type="submit" className="btn btn-outline-danger ml-5">
																			<i className="fas fa-minus"></i>
																		</button>
																	</div>
																</form>
															) : (
																<form onSubmit={(e) => preUploadPdf(location, e)} encType="multipart/form-data">
																	<input
																		name="file"
																		onChange={handleFile}
																		type="file"
																		className="form-control file"
																		id="file"
																	></input>
																	<button type="submit" className="btn btn-outline-primary mt-2">
																		<i className="fas fa-plus"></i>
																	</button>
																</form>
															)}
														</div>
													</div>
												</div>
											);
										})}
									</ul>
								) : (
									<ul className="list-group">
										<li className="list-group-item">No locations yet...</li>
									</ul>
								)}

								<button
									className="btn btn-outline-primary m-3"
									type="button"
									data-toggle="collapse"
									data-target="#collapseLocation"
									aria-expanded="false"
									aria-controls="collapseLocation"
								>
									<i className="fas fa-plus"></i> Add Location
								</button>
								<div className="collapse" id="collapseLocation">
									<div className="card card-body mt-3">
										<label htmlFor="inputLocation">Location</label>
										<textarea
											id="inputLocation"
											name="location"
											placeholder="Location"
											type="text"
											className="form-control mx-auto m-2 "
											value={location}
											onChange={(e) => setLocation(e.target.value)}
										></textarea>
										<label htmlFor="inputSize">Size</label>
										<input
											id="inputSize"
											name="size"
											placeholder="Size (meters)"
											type="number"
											className="form-control mx-auto m-2 inputField"
											value={size}
											onChange={(e) => setSize(e.target.value)}
										></input>

										<button
											type="submit"
											className="btn btn-outline-primary m-5 w-25 mx-auto"
											onClick={(e) => AddLocation(e)}
										>
											Add Location
										</button>
									</div>
								</div>
							</div>
							<div
								className="tab-pane fade"
								id="v-pills-prevOrders"
								role="tabpanel"
								aria-labelledby="v-pills-prevOrders-tab"
							>
								<div>
									<p>
										{allOrders && allOrders.length
											? allOrders.map((order) => {
													if (order.customer_id === chosenCustomer.id && order.price) {
														totalPrice += parseInt(order.price);
													}
											  })
											: ""}
										Total Price:{totalPrice} EGP
										{allOrders && allOrders.length
											? allOrders.map((order) => {
													if (order.customer_id === chosenCustomer.id && order.cost) {
														totalCost += parseInt(order.cost);
													}
											  })
											: ""}
										<span className="m-5"></span>Total Fixed Cost:{totalCost} EGP
										<span className="m-5"></span>Profit/Loss: {totalPrice - totalCost} EGP
									</p>

									<table className="table table-dark ">
										<thead>
											<tr>
												<th scope="col">#</th>
												{allOrders && allOrders.length
													? Object.keys(allOrders[0]).map((key) => {
															if (
																key !== "created_at" &&
																key !== "updated_at" &&
																key !== "location_id" &&
																key !== "customer_id"
															) {
																return (
																	<th scope="col" key={key}>
																		{key}
																	</th>
																);
															}
													  })
													: ""}
												<th scope="col">Update</th>
											</tr>
										</thead>
										<tbody>
											{allOrders && allOrders.length
												? allOrders.map((order, idx) => {
														if (order.customer_id === chosenCustomer.id) {
															return (
																<tr>
																	<th scope="row">{idx + 1}</th>
																	<td>{order.id}</td>
																	<td>{order.name}</td>
																	<td>{order.phone}</td>
																	<td>{dateFormat(order.date.split("T")[0], "dd-mm-yyyy")}</td>
																	<textarea
																		className="textAreaLoc mt-2 form-control"
																		disabled
																		value={order.location}
																	></textarea>
																	<td>{order.size}</td>
																	<td>{order.price}</td>
																	<td className="costCol">
																		<input
																			name="tableCost"
																			className="inputCost"
																			defaultValue={order.cost}
																			onChange={props.onChange}
																		></input>
																	</td>
																	<td>{order.start_time}</td>
																	<td>{order.end_time}</td>
																	<td>{order.workers}</td>
																	<td>
																		<button
																			className="btn btn-outline-warning"
																			onClick={(e) => props.UpdateCost(order, e)}
																		>
																			Update
																		</button>
																	</td>
																</tr>
															);
														}
												  })
												: ""}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>
			) : (
				""
			)}
		</div>
	);
}
