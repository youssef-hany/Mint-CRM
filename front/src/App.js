import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Default from "./pages/Default/Default";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import DataService from "./tools/data-service";
import { useHistory } from "react-router";
let ds = new DataService();

function App() {
	const history = useHistory();

	useEffect(() => {
		localStorage.removeItem("usertoken");
		history.push("/login");
	}, [history]); //put history here because useEffect needs to track all variables it uses in this bracket to avoid dependency problems

	var userAgent = navigator.userAgent.toLowerCase();

	const [updateStatus, setUpdateStatus] = useState("");
	const [finishedDownload, setFinishedDownload] = useState(false);
	const [needUpdate, setNeedUpdate] = useState(false);
	const [downloadValues, setDownloadValues] = useState("");
	const [updateInfo, setUpdateInfo] = useState({
		status: "",
		state: false,
	});
	const [updateState, setUpdateState] = useState(true);

	window.ipcRenderer.on("message", function (event, obj) {
		if (obj) {
			if (obj.text) {
				console.log(`Message from updater: ${obj.text}`);
			}
			switch (obj.state) {
				case "app-start":
					console.log("starting...");
					setUpdateStatus("Starting...");

					break;
				case "checking":
					console.log("now checking");
					setUpdateStatus("Checking for updates...");

					break;
				case "updateAvailable":
					localStorage.removeItem("usertoken");
					history.push("/login");

					ds.checkUpdate(true);
					ds.isDownloading(true);
					setNeedUpdate(true);
					setUpdateInfo(obj);
					setUpdateStatus("Found Updates!");
					console.log(obj);
					console.log("Found update");

					break;
				case "updateNotAvailable":
					localStorage.removeItem("usertoken");
					history.push("/login");

					setUpdateStatus("Up to Date!");
					setNeedUpdate(false);
					console.log(obj);
					console.log("Not available update");

					break;
				case "downloadInfo":
					setDownloadValues(obj.object);
					setUpdateStatus("Downloading...");
					setNeedUpdate(true);
					if (parseInt(obj.object.percentage) >= 99) {
						ds.willRestart(true);
					}

					break;
				case "downloadFinish":
					setUpdateStatus("Download Finished!");
					setNeedUpdate(true);
					setFinishedDownload(true);
					ds.isDownloading(false);
					if (updateState) {
						window.ipcRenderer.send("reply-message", "installNow");
					} else {
						window.ipcRenderer.send("reply-message", "installLater");
					}

					console.log("finished downloading");

					break;
				case "error":
					localStorage.removeItem("usertoken");
					history.push("/login");

					setUpdateStatus("error");
					ds.isDownloading(false);
					console.log("Error Found in Update function in app.js line:83!");

					break;
				case "app-quit":
					localStorage.removeItem("usertoken");
					window.ipcRenderer.send("reply-message", "tokenRemoved");

					break;
				case "updateLaterSet":
					setUpdateStatus("will Install Later...");
					console.log("update set to later!");

					break;

				default:
					break;
			}
		}
	});
	if (userAgent.indexOf(" electron/") > -1) {
		//get user-agent part where it has electron in it as the app name to avoid someone connecting from chrome,postman,etc...
		return (
			<div className="App">
				{needUpdate ? (
					<div
						className="modal fade"
						id="updateModal"
						tabindex="-1"
						role="dialog"
						aria-labelledby="updateModalLabel"
						aria-hidden="true"
					>
						<div className="modal-dialog " role="document">
							<div className="modal-content update-modal">
								<div className="modal-header">
									<h5 className="modal-title" id="updateModalLabel">
										Update Manager
									</h5>
									<button type="button" className="close" data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<div className="modal-body ">
									{/* Update Section */}
									<h2 className="text-muted">{updateInfo && updateInfo.object ? updateInfo.object.version : ""}</h2>
									<label id="download-label" for="download" className="Font-Lighter LightBlue download-label">
										{updateStatus}
									</label>
									<progress id="download" value={downloadValues.transferred} max={downloadValues.total}>
										{downloadValues.percentage}
									</progress>
									<p className="text-center mx-auto">
										{downloadValues.percentage ? Math.ceil(parseInt(downloadValues.percentage)) + "%" : 0}
									</p>
									{downloadValues && parseInt(downloadValues.percentage) >= 99 ? (
										updateState ? (
											<small className="form-text Green">
												The update has been downloaded successfully. Application will restart in a few minutes!
											</small>
										) : (
											<small className="form-text Yellow">
												The update has been downloaded successfully. The application will update on the first restart!
											</small>
										)
									) : needUpdate ? (
										<small className="form-text Yellow">
											Please do not close the application while update is running!
										</small>
									) : (
										""
									)}
									{updateState ? (
										<span class="badge badge-success badge-outlined">Updating on Finish</span>
									) : (
										<span class="badge badge-warning ">Updating Later</span>
									)}
								</div>
								<div className="modal-footer">
									<button
										type="button"
										className={updateState ? "btn btn-success" : "btn btn-outline-success"}
										data-dismiss="modal"
										onClick={() => {
											if (finishedDownload) {
												window.ipcRenderer.send("reply-message", "forceInstallNow");
											} else {
												setUpdateState(true);
												ds.willRestartLater(false);
											}
										}}
									>
										{updateState ? "Install Update" : "Install Now"}
									</button>
									<button
										type="button"
										className="btn btn-warning"
										data-dismiss="modal"
										onClick={() => {
											setUpdateState(false);
											ds.willRestartLater(true);
											ds.willRestart(false);
										}}
									>
										Install Later
									</button>
								</div>
							</div>
						</div>
					</div>
				) : (
					""
				)}
				<Navbar
					updatePercentage={
						Math.ceil(parseInt(downloadValues.percentage)) ? Math.ceil(parseInt(downloadValues.percentage)) : ""
					}
				/>

				<Switch>
					<Route exact path="/" component={Home} />
					<Route component={Default} />
				</Switch>
			</div>
		);
	} else {
		return (
			<div className="text-center">
				<h2>Cannot Proceed. ;)</h2>
				<small className="browserWelcome">
					And you run and you run, to Catch up with the sun but its sinking.
					<br></br>
					Racing around to come up behind you again. The sun is the same in a relative way but you're older.
					<br></br>
					shorter of breath and one day closer to death... <small className=" ml-4 pinkfloydSig">~Pink Floyd</small>
				</small>
				<hr className="w-50"></hr>
				<br></br>
				<small>
					If you are a Hacker please stop trying to hack this system! otherwise if this is a real issue contact admin
					NOW!
				</small>
				<br></br>
				<br></br>
				<small>
					<b>Note: </b>this program only runs within The Required Executable Application!
				</small>
			</div>
		);
	}
}

export default App;
