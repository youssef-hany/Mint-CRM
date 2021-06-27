import React, { Component } from "react";
import Loader from "react-loader-spinner";
import {
	postOrder,
	postCustomer,
	getCustomerLocations,
	addCustomerLocation,
	uploadPDF,
	removePDF,
	updateCost,
	addNewCost,
} from "../../tools/functions";
import HttpService from "../../tools/http-service/http-service";
import "./Home.css";
import { ScheduleComponent, Inject, Day, Week, WorkWeek, Month, Agenda } from "@syncfusion/ej2-react-schedule";
import { DataManager, WebApiAdaptor } from "@syncfusion/ej2-data";
import Customers from "./Customers/Customers";
import PreviousOrders from "./PreviousOrders/PreviousOrders";
import ManageCosts from "./ManageCosts/ManageCosts";
import NewOrders from "./NewOrders/NewOrders";

let httpService = new HttpService();

export class Home extends Component {
	_isMounted = false;

	constructor(props) {
		super(props);
		this.dataManager = new DataManager({
			url: "http://localhost:3005/getAppointments",
			adaptor: new WebApiAdaptor(),
			crossDomain: true,
		});
		this.state = {
			name: "",
			customerName: "",
			phone: "",
			customerPhone: "",
			date: "",
			pdfFile: "",
			error: "",
			startTime: "",
			endTime: "",
			allCustomers: [],
			allOrders: [],
			customerLocations: [],
			inputLocation: "",
			inputSize: "",
			inputPrice: "",
			tableCost: "",
			orderCustomer: {},
			costName: "",
			costDate: "",
			costQuantity: "",
			costAmount: "",
			appointments: [
				// {
				// 	Id: 3,
				// 	Subject: "",
				// 	StartTime: new Date(2021, 5, 19, 9, 0),
				// 	EndTime: new Date(2021, 5, 20, 10, 0),
				// 	IsAllDay: false,
				// },
				// {
				// 	Id: 4,
				// 	Subject: "",
				// 	StartTime: new Date(2021, 5, 17, 9, 0),
				// 	EndTime: new Date(2021, 5, 17, 10, 0),
				// 	IsAllDay: false,
				// },
			],

			spinner: (
				<div className="Loader">
					<Loader type="TailSpin" color="#7a7a7a" height={60} width={60} />
				</div>
			),
			load: false,
		};

		this.onChange = this.onChange.bind(this);
		this.AddOrder = this.AddOrder.bind(this);
		this.AddCustomer = this.AddCustomer.bind(this);
		this.GetAllCustomers = this.GetAllCustomers.bind(this);
		this.GetAllOrders = this.GetAllOrders.bind(this);
		this.UploadPDF = this.UploadPDF.bind(this);
		this.RemovePDF = this.RemovePDF.bind(this);
		this.handleFile = this.handleFile.bind(this);
		this.GetCosts = this.GetCosts.bind(this);
	}

	componentDidMount() {
		this._isMounted = true;
		if (this._isMounted) {
			this.GetAllOrders();
			this.GetAllCustomers();
			this.GetCosts();
		}
	}
	componentWillUnmount() {
		this._isMounted = false;
	}

	onChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
		if (e.target.name === "name") {
			this.state.allCustomers.map((customer) => {
				if (customer.name.toLowerCase() === e.target.value.toLowerCase()) {
					this.setState({ orderCustomer: customer });
					this.GetCustomerLocations(customer.id);
				}
			});
		}
	};
	setstartTime = (e) => {
		this.setState({ startTime: e });
	};
	setendTime = (e) => {
		this.setState({ endTime: e });
	};

	AddOrder = (e) => {
		this.setState({ load: true });
		let location_id = "";
		if (this.state.inputLocation) {
			this.state.customerLocations.map((location, index) => {
				if (this.state.inputLocation === location.location) {
					location_id = location.id;
				}
			});
		}
		let data = {
			name: this.state.name,
			phone: this.state.orderCustomer.phone,
			date: this.state.date,
			location_id: location_id,
			size: this.state.inputSize,
			price: this.state.inputPrice,
			startTime: this.state.startTime,
			endTime: this.state.endTime,
		};
		if (
			this.state.name &&
			this.state.date &&
			this.state.inputSize &&
			this.state.inputPrice &&
			this.state.startTime &&
			this.state.endTime &&
			!this.state.orderCustomer.phone
		) {
			e.preventDefault();
			this.setState(
				{ load: false, error: "[F] Please Add customer " + this.state.name + " before adding order" },
				() => {
					window.setTimeout(() => {
						this.setState({ error: "", success: "" });
					}, 8000);
				}
			);
			return;
		}
		if (
			!this.state.name ||
			!this.state.orderCustomer.phone ||
			!this.state.date ||
			!location_id ||
			!this.state.inputSize ||
			!this.state.inputPrice ||
			!this.state.startTime ||
			!this.state.endTime
		) {
			e.preventDefault();
			this.setState({ load: false, error: "[F] Please fill out all the fields to submit!" }, () => {
				window.setTimeout(() => {
					this.setState({ error: "", success: "" });
				}, 8000);
			});
			console.log(this.state.orderCustomer.phone);

			return;
		}
		postOrder(data).then((response) => {
			if (response) {
				if (response.success) {
					this.GetAllOrders();
					this.setState(
						{
							success: response.success,
							load: false,
							name: "",
							phone: "",
							date: "",
							orderCustomer: {},
							startTime: "",
							endTime: "",
						},
						() => {
							window.setTimeout(() => {
								this.setState({ error: "", success: "" });
							}, 6000);
						}
					);
				} else {
					if (response.error) {
						e.preventDefault();

						this.setState(
							{
								error: response.error,
								load: false,
							},
							() => {
								window.setTimeout(() => {
									this.setState({ error: "", success: "" });
								}, 8000);
							}
						);
					}
				}
			} else {
				this.setState({
					load: false,
					error: "[F] No response from server database",
				});
				console.log("No Response from server");
			}
		});
	};

	AddCustomer = (e) => {
		e.preventDefault();

		this.setState({ load: true });
		let data = {
			name: this.state.customerName,
			phone: this.state.customerPhone,
		};
		if (!this.state.customerName || !this.state.customerPhone) {
			this.setState({ load: false, error: "[F] Please fill out all the fields to submit!" }, () => {
				window.setTimeout(() => {
					this.setState({ error: "", success: "" });
				}, 8000);
			});
			return;
		}

		postCustomer(data).then((response) => {
			if (response) {
				if (response.success) {
					this.GetAllCustomers();
					this.setState(
						{
							success: response.success,
							load: false,
							customerName: "",
							customerPhone: "",
						},
						() => {
							window.setTimeout(() => {
								this.setState({ error: "", success: "" });
							}, 6000);
						}
					);
				} else {
					if (response.error) {
						this.setState(
							{
								error: response.error,
								load: false,
							},
							() => {
								window.setTimeout(() => {
									this.setState({ error: "", success: "" });
								}, 8000);
							}
						);
					}
				}
			} else {
				this.setState({
					load: false,
					error: "[F] No response from server database",
				});
				console.log("No Response from server");
			}
		});
	};
	AddCustomerLocation = (data) => {
		var promise = new Promise((resolve, reject) => {
			this.setState({ load: true });
			addCustomerLocation(data).then((response) => {
				if (response) {
					if (response.success) {
						this.setState(
							{
								success: response.success,
								load: false,
							},
							() => {
								window.setTimeout(() => {
									this.setState({ error: "", success: "" });
								}, 6000);
							}
						);
						resolve(response.success);
					} else {
						if (response.error) {
							this.setState(
								{
									error: response.error,
									load: false,
								},
								() => {
									window.setTimeout(() => {
										this.setState({ error: "", success: "" });
									}, 8000);
								}
							);
							resolve(response.error);
						}
					}
				} else {
					this.setState({
						load: false,
						error: "[F] No response from server database",
					});
					console.log("No Response from server");
					resolve({ error: "[F] No response from server database" });
				}
			});
		});
		return promise;
	};

	AddNewCost = (e) => {
		this.setState({ load: true });
		e.preventDefault();
		let data = {
			name: this.state.costName,
			date: this.state.costDate,
			quantity: this.state.costQuantity,
			cost: this.state.costAmount,
		};
		var promise = new Promise((resolve, reject) => {
			addNewCost(data).then((response) => {
				if (response) {
					if (response.success) {
						this.GetCosts();
						this.setState(
							{
								success: response.success,
								costName: "",
								costDate: "",
								costQuantity: "",
								costAmount: "",
								load: false,
							},
							() => {
								window.setTimeout(() => {
									this.setState({ error: "", success: "" });
								}, 6000);
							}
						);
						resolve(response.success);
					} else {
						if (response.error) {
							this.setState(
								{
									error: response.error,
									load: false,
								},
								() => {
									window.setTimeout(() => {
										this.setState({ error: "", success: "" });
									}, 8000);
								}
							);
							resolve(response.error);
						}
					}
				} else {
					this.setState({
						load: false,
						error: "[F] No response from server database",
					});
					console.log("No Response from server");
					resolve({ error: "[F] No response from server database" });
				}
			});
		});
		return promise;
	};

	GetCustomerLocations = (customer_id) => {
		var promise = new Promise((resolve, reject) => {
			this.setState({ customerLocations: [] });
			getCustomerLocations(customer_id).then((response) => {
				if (response) {
					if (response.locations) {
						this.setState(
							{
								load: false,
								customerLocations: response.locations,
							},
							() => {
								window.setTimeout(() => {
									this.setState({ error: "", success: "" });
								}, 6000);
							}
						);
						resolve(response.locations);
					} else {
						if (response.error) {
							this.setState(
								{
									error: response.error,
									load: false,
								},
								() => {
									window.setTimeout(() => {
										this.setState({ error: "", success: "" });
									}, 8000);
								}
							);
							resolve(response.error);
						}
					}
				} else {
					this.setState({
						load: false,
						error: "[F] No response from server database",
					});
					console.log("No Response from server");
					resolve({ error: "[F] No response from server database" });
				}
			});
		});
		return promise;
	};
	handleFile = (e) => {
		const { files } = e.currentTarget;
		if (files) {
			this.setState({
				pdfFile: files[0],
			});
		}
	};
	RemovePDF = (data, e) => {
		this.setState({ load: true });
		e.preventDefault();

		removePDF(data).then((res) => {
			if (res) {
				if (res.success) {
					this.setState(
						{
							success: res.success,
							load: false,
						},
						() => {
							window.setTimeout(() => {
								this.setState({ error: "", success: "" });
							}, 6000);
						}
					);
					this.GetCustomerLocations(data.customer_id);
				} else {
					this.setState(
						{
							error: res.error,
							load: false,
						},
						() => {
							window.setTimeout(() => {
								this.setState({ error: "", success: "" });
							}, 6000);
						}
					);
				}
			} else {
				this.setState(
					{
						error: "[F] No response from database. Check connection...",
						load: false,
					},
					() => {
						window.setTimeout(() => {
							this.setState({ error: "", success: "" });
						}, 6000);
					}
				);
			}
		});
	};
	UploadPDF = (data, e) => {
		this.setState({ load: true });
		const formdata = new FormData();
		formdata.append("file", this.state.pdfFile);
		formdata.append("customer_name", data.customerName);
		formdata.append("location_id", data.location_id);
		e.preventDefault();

		uploadPDF(formdata).then((res) => {
			if (res) {
				if (res.success) {
					this.setState(
						{
							success: res.success,
							load: false,
						},
						() => {
							window.setTimeout(() => {
								this.setState({ error: "", success: "" });
							}, 6000);
						}
					);
					this.GetCustomerLocations(data.customer_id);
				} else {
					this.setState(
						{
							error: res.error,
							load: false,
						},
						() => {
							window.setTimeout(() => {
								this.setState({ error: "", success: "" });
							}, 6000);
						}
					);
				}
			} else {
				this.setState(
					{
						error: "[F] No response from database. Check connection...",
						load: false,
					},
					() => {
						window.setTimeout(() => {
							this.setState({ error: "", success: "" });
						}, 6000);
					}
				);
			}
		});
	};
	UpdateCost = (order, e) => {
		this.setState({ load: true });
		let data = {
			order_id: order.id,
			newCost: this.state.tableCost,
		};
		updateCost(data).then((res) => {
			if (res) {
				if (res.success) {
					this.setState(
						{
							success: res.success,
							load: false,
						},
						() => {
							window.setTimeout(() => {
								this.setState({ error: "", success: "" });
							}, 6000);
						}
					);
				} else {
					this.setState(
						{
							error: res.error,
							load: false,
						},
						() => {
							window.setTimeout(() => {
								this.setState({ error: "", success: "" });
							}, 6000);
						}
					);
				}
			} else {
				this.setState(
					{
						error: "[F] No response from database. Check connection...",
						load: false,
					},
					() => {
						window.setTimeout(() => {
							this.setState({ error: "", success: "" });
						}, 6000);
					}
				);
			}
		});
	};
	GetAllCustomers = () => {
		this.setState({ load: true });

		httpService.GetCustomers().then((data) => {
			if (this._isMounted) {
				this.setState({
					allCustomers: data.customers,
					load: false,
				});
			}
		});
	};

	GetAllOrders = () => {
		this.setState({ load: true });

		httpService.GetOrders().then((data) => {
			if (this._isMounted) {
				this.setState({
					allOrders: data.orders,
					load: false,
				});
			}
		});
	};
	GetCosts = () => {
		this.setState({ load: true });
		httpService.GetCosts().then((data) => {
			if (this._isMounted) {
				this.setState({
					allCosts: data.costs,
					load: false,
				});
			}
		});
	};
	render() {
		const { allOrders, allCosts } = this.state;
		return (
			<div>
				<div className="container row mx-auto">
					<div className="mt-2 mx-auto">
						{this.state.error ? (
							<div className="container alertContainer text-center alert alert-danger fade show  ">
								{this.state.error}
							</div>
						) : (
							""
						)}
						{this.state.success ? (
							<div className="container alertContainer text-center alert alert-success fade show ">
								{this.state.success}
							</div>
						) : (
							""
						)}
					</div>
					<div className="mx-auto container mt-3">{this.state.load ? this.state.spinner : <div></div>}</div>

					<div className="col-sm-12 w-100 mt-5">
						<nav className="">
							<div className="nav justify-content-center nav-tabs w-75 nav-fill mx-auto" id="nav-tab" role="tablist">
								<a
									className="nav-item nav-link"
									id="nav-new-customer-tab"
									data-toggle="tab"
									href="#new-customer"
									role="tab"
									aria-controls="nav-new-customer"
									aria-selected="false"
								>
									New Customer
								</a>
								<a
									className="nav-item nav-link active"
									id="nav-new-order-tab"
									data-toggle="tab"
									href="#new-order"
									role="tab"
									aria-controls="nav-new-order"
									aria-selected="true"
								>
									New Order
								</a>
								<a
									className="nav-item nav-link"
									id="nav-previous-orders-tab"
									data-toggle="tab"
									href="#nav-previous-orders"
									role="tab"
									aria-controls="nav-previous-orders"
									aria-selected="false"
								>
									Previous Orders
								</a>
								<a
									className="nav-item nav-link"
									id="nav-schedule-tab"
									data-toggle="tab"
									href="#nav-schedule"
									role="tab"
									aria-controls="nav-schedule"
									aria-selected="false"
								>
									Schedule
								</a>
								<a
									className="nav-item nav-link"
									id="nav-customers-tab"
									data-toggle="tab"
									href="#nav-customers"
									role="tab"
									aria-controls="nav-customers"
									aria-selected="false"
								>
									Customers
								</a>
								<a
									className="nav-item nav-link"
									id="nav-mngcost-tab"
									data-toggle="tab"
									href="#nav-mngcost"
									role="tab"
									aria-controls="nav-mngcost"
									aria-selected="false"
								>
									Manage Costs
								</a>
							</div>
						</nav>
						<div className="tab-content" id="nav-tabContent">
							<div className="tab-pane fade" id="new-customer" role="tabpanel" aria-labelledby="nav-new-customer-tab">
								{/* New Customer */}
								<form className="container mt-5" onSubmit={this.AddCustomer}>
									<div>
										<label htmlFor="inputName">Name</label>
										<input
											id="inputName"
											placeholder="Name"
											name="customerName"
											type="text"
											className="form-control mx-auto m-2 inputField"
											value={this.state.customerName}
											onChange={this.onChange}
										></input>

										<label htmlFor="inputPhone">Phone</label>
										<input
											id="inputPhone"
											placeholder="01115034499"
											name="customerPhone"
											type="number"
											className="form-control mx-auto m-2 inputField"
											value={this.state.customerPhone}
											onChange={this.onChange}
										></input>

										<button type="submit" className="btn btn-primary m-5">
											submit
										</button>
									</div>
								</form>
							</div>

							<div
								className="tab-pane fade show active"
								id="new-order"
								role="tabpanel"
								aria-labelledby="nav-new-order-tab"
							>
								{/* New Orders */}
								<NewOrders
									name={this.state.name}
									date={this.state.date}
									setstartTime={this.setstartTime}
									startTime={this.state.startTime}
									setendTime={this.setendTime}
									endTime={this.state.endTime}
									onChange={this.onChange}
									AddOrder={this.AddOrder}
									GetCustomerLocations={this.GetCustomerLocations}
									customerLocations={this.state.customerLocations}
									inputLocation={this.state.inputLocation}
									inputSize={this.state.inputSize}
									inputPrice={this.state.inputPrice}
									allCustomers={this.state.allCustomers}
									orderCustomer={this.state.orderCustomer}
								/>
							</div>
							<div
								className="tab-pane fade"
								id="nav-previous-orders"
								role="tabpanel"
								aria-labelledby="nav-previous-orders-tab"
							>
								{/* Previous Orders */}
								<PreviousOrders allOrders={allOrders} />
							</div>

							<div className="tab-pane fade" id="nav-schedule" role="tabpanel" aria-labelledby="nav-schedule-tab">
								{/* Schedule */}
								<ScheduleComponent className="mt-3" currentView="Day" eventSettings={{ dataSource: this.dataManager }}>
									<Inject services={[Day, Week, WorkWeek, Month, Agenda]} />
								</ScheduleComponent>
							</div>
							<div className="tab-pane fade" id="nav-customers" role="tabpanel" aria-labelledby="nav-customers-tab">
								{/* Customers */}
								<Customers
									onChange={this.onChange}
									tableCost={this.state.tableCost}
									UpdateCost={this.UpdateCost}
									allCustomers={this.state.allCustomers}
									allOrders={allOrders}
									handleFile={this.handleFile}
									customerLocations={this.state.customerLocations}
									GetCustomerLocations={this.GetCustomerLocations}
									AddCustomerLocation={this.AddCustomerLocation}
									UploadPDF={this.UploadPDF}
									RemovePDF={this.RemovePDF}
								/>
							</div>
							<div className="tab-pane fade" id="nav-mngcost" role="tabpanel" aria-labelledby="nav-mngcost-tab">
								{/* Manage Costs */}
								<ManageCosts
									onChange={this.onChange}
									AddNewCost={this.AddNewCost}
									allCosts={allCosts}
									costName={this.state.costName}
									costDate={this.state.costDate}
									costQuantity={this.state.costQuantity}
									costAmount={this.state.costAmount}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Home;
