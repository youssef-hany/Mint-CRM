import React, { Component } from "react";
import { Link } from "react-router-dom";
// import { isAuthenticated } from "../../Account/authenticated";
import "./Navbar.css";
import jwt from "jsonwebtoken";
import NotificationService, {
	APP_NEEDS_UPDATE,
	NOTIF_USER_LOGGED_IN,
	NOTIF_USER_LOGGED_OUT,
	APP_WILL_RESTART,
	APP_WILL_RESTART_LATER,
	APP_IS_DOWNLOADING,
} from "../../tools/notification-service";
import DataService from "../../tools/data-service";
import HttpService from "../../tools/http-service/http-service";
import Loader from "react-loader-spinner";

let ns = new NotificationService();
let ds = new DataService();
let httpService = new HttpService();

export default class Navbar extends Component {
	_isMounted = false;

	constructor(props) {
		super(props);
		this.state = {
			token: false,
			userPriv: "",
			collapsed: false,
			Constants: "",
			spinner: (
				<div className="updaterLoader">
					<Loader type="TailSpin" color="#7a7a7a" height={20} width={20} />
				</div>
			),
		};
		this.onUserLoggedIn = this.onUserLoggedIn.bind(this);
		this.onUserLoggedOut = this.onUserLoggedOut.bind(this);
		this.appUpdateCheck = this.appUpdateCheck.bind(this);
		this.appWillRestart = this.appWillRestart.bind(this);
		this.appWillRestartLater = this.appWillRestartLater.bind(this);
		this.appIsDownloading = this.appIsDownloading.bind(this);

		this.testUser = this.testUser.bind(this);
	}
	componentDidMount() {
		this._isMounted = true;
		if (this._isMounted) {
			ns.addObserver(NOTIF_USER_LOGGED_IN, this, this.onUserLoggedIn);
			ns.addObserver(NOTIF_USER_LOGGED_OUT, this, this.onUserLoggedOut);
			ns.addObserver(APP_NEEDS_UPDATE, this, this.appUpdateCheck);
			ns.addObserver(APP_WILL_RESTART, this, this.appWillRestart);
			ns.addObserver(APP_WILL_RESTART_LATER, this, this.appWillRestartLater);
			ns.addObserver(APP_IS_DOWNLOADING, this, this.appIsDownloading);

			this.getConstantsData();
			// if (isAuthenticated(localStorage.usertoken)) {
			// 	this.setState({ token: localStorage.usertoken });
			// } else {
			// 	this.setState({ token: "" });
			// }
		}
	}

	componentWillUnmount() {
		if (this._isMounted) {
			ns.removeObserver(this, NOTIF_USER_LOGGED_IN);
			ns.removeObserver(this, NOTIF_USER_LOGGED_OUT);
			ns.removeObserver(this, APP_NEEDS_UPDATE);
			ns.removeObserver(this, APP_WILL_RESTART);
			ns.removeObserver(this, APP_WILL_RESTART_LATER);
			ns.removeObserver(this, APP_IS_DOWNLOADING);
		}
		this._isMounted = false;
	}
	onUserLoggedIn(newUser) {
		this.setState({ token: newUser });
	}
	onUserLoggedOut(newUser) {
		this.setState({ token: newUser });
	}
	appUpdateCheck(newState) {
		this.setState({ needUpdate: newState });
	}
	appWillRestart(newState) {
		this.setState({ willRestart: newState });
	}
	appWillRestartLater(newState) {
		this.setState({ willRestartLater: newState });
	}
	appIsDownloading(newState) {
		this.setState({ isDownloading: newState });
	}

	listenForUpdateErrors = () => {
		window.ipcRenderer.on("message", function (event, obj) {
			if (obj.state === "error") {
				this.setState(
					{
						error: obj.text,
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
	testUser = () => {
		try {
			const decoded = jwt.verify(localStorage.usertoken, "secret");
			if (decoded) {
				return decoded.privT;
			}
		} catch (err) {
			return this.attemptRenewal(localStorage.usertoken);
		}
	};
	attemptRenewal = (token) => {
		if (token) {
			localStorage.removeItem("usertoken");
			this.props.history.push("/login");
		}
	};
	getConstantsData = () => {
		var promise = new Promise((resolve, reject) => {
			// httpService
			// 	.getConstants()
			// 	.then((data) => {
			// 		if (data.success) {
			// 			this.setState({
			// 				Constants: data.constants,
			// 			});
			// 			if (data.constants.length) {
			// 				resolve(data.constants);
			// 			}
			// 		}
			// 	})
			// 	.catch((err) => {
			// 		if (err && this._isMounted) {
			// 			this.setState({
			// 				load: true,
			// 			});
			// 			reject(err);
			// 		}
			// 	});
		});
		return promise;
	};

	cleanUI = (e) => {
		if (e && e.currentTarget) {
			const { name } = e.currentTarget;
			if (name === "toggle") {
				if (this.state.collapsed) {
					this.setState({ collapsed: false });
				} else {
					this.setState({ collapsed: true });
				}
				ds.menuPressed(this.state.collapsed);
			}
		}
	};

	render() {
		const { Constants } = this.state;
		const { needUpdate } = this.state;
		const { willRestart } = this.state;
		const { willRestartLater } = this.state;
		const { isDownloading } = this.state;

		return (
			<>
				<div className="Nav-bar">
					<nav className="navbar navbar-expand-lg navbar-dark bg-dark myNav">
						<button
							name="toggler"
							className="navbar-toggler toggler"
							type="button"
							onClick={(e) => this.cleanUI(e)}
							data-toggle="collapse"
							data-target="#navbarTogglerDemo01"
							aria-controls="navbarTogglerDemo01"
							aria-expanded="false"
							aria-label="Toggle navigation"
						>
							<span className="navbar-toggler-icon"></span>
						</button>
						<div className="container-fluid row w-100 ">
							<ul className="container-fluid navbar-nav mr-auto mt-2 mt-lg-0 col-xs-12 HospitalName">
								<li className="nav-item text-center justify-content-center">
									<Link
										to="/"
										className={
											Constants
												? "navbar-brand btn btn-outline-secondary hospitalName"
												: "navbar-brand btn btn-outline-secondary"
										}
									>
										<p className={Constants ? "hospitalName" : ""}>Mint</p>
									</Link>
								</li>
							</ul>

							<div className="collapse navbar-collapse" id="navbarTogglerDemo01">
								{needUpdate ? (
									<div className="m-2 my-lg-0">
										<ul className="navbar-nav mr-auto mt-2 mt-lg-0">
											<li
												onClick={() => this.cleanUI()}
												className="nav-item"
												data-toggle="collapse"
												data-target="#navbarTogglerDemo01"
											>
												<abbr
													title={
														willRestartLater
															? "Update set to Later"
															: `Update in progress ${
																	this.props.updatePercentage ? this.props.updatePercentage + "%" : ""
															  }`
													}
												>
													<button
														type="button"
														className={
															willRestartLater
																? "btn btn-outline-warning updateButton"
																: "btn btn-outline-success updateButton"
														}
														data-toggle="modal"
														data-target="#updateModal"
													>
														<i className="fa fa-refresh" aria-hidden="true"></i>
													</button>

													{needUpdate && isDownloading ? <div>{this.state.spinner}</div> : <div></div>}
												</abbr>
											</li>
										</ul>
									</div>
								) : (
									""
								)}

								{/* <div className="my-2 my-lg-0">
									<ul className="navbar-nav mr-auto mt-2 mt-lg-0">
										<li
											onClick={() => this.cleanUI()}
											className="nav-item"
											data-toggle="collapse"
											data-target="#navbarTogglerDemo01"
										>
											{true ? (
												<Link to="/profile" className="login ml-auto">
													<button className="Btn ">
														<i className="far fa-user p-1 accountIcon" />
														<div>Dashboard</div>
													</button>
												</Link>
											) : (
												<React.Fragment>
													<Link to="/login" className="navbar-brand login btn btn-outline-secondary">
														Login
													</Link>
												</React.Fragment>
											)}
										</li>
									</ul>
								</div> */}
							</div>
						</div>
					</nav>
				</div>

				{willRestart ? (
					<div className="container text-center alert alert-warning fade show mt-5 mx-auto">
						The application has finished updating and will restart in a few minutes. To avoid data loss, please finish
						your current session...
					</div>
				) : (
					""
				)}
			</>
		);
	}
}
