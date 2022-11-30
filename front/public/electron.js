const { app, BrowserWindow, Menu, dialog, ipcMain, powerMonitor } = require("electron");
// const { localStorage } = require("electron-browser-storage");
const { autoUpdater } = require("electron-updater");
const path = require("path");
const isDev = require("electron-is-dev");
const fs = require("fs");
var rimraf = require("rimraf");
const log = require("electron-log");

const hdir = "C:/HMS_data";
const hpath = `${hdir}/hospital_name.json`;

let isUpdating = false;
let interval0 = "";
var closing = false;
function createWindow() {
	let startedDownload = false;
	let finishedDownload = false;
	let mins = 2; //2 mins
	let timeInMins = mins * 60 * 1000;
	let waitBeforeInstall = timeInMins;
	autoUpdater.logger = log;
	autoUpdater.logger.transports.file.level = "info";
	log.info("App starting...");
	// Create the browser window.
	const win = new BrowserWindow({
		width: 1500,
		height: 1000,
		webPreferences: {
			nodeIntegration: false,
			enableRemoteModule: true,
			preload: __dirname + "/preload.js",
			// worldSafeExecuteJavaScript: true,
			// contextIsolation: true,
		},
	});

	// const devtools = new BrowserWindow()

	// and load the index.html of the app.
	win.loadURL(isDev ? "http://localhost:3000" : `file://${path.join(__dirname, "../build/index.html")}`);

	const isMac = process.platform === "darwin";

	const template = [
		// { role: 'appMenu' }
		...(isMac
			? [
					{
						label: app.name,
						submenu: [
							{ role: "about" },
							{ type: "separator" },
							{ role: "services" },
							{ type: "separator" },
							{ role: "hide" },
							{ role: "hideothers" },
							{ role: "unhide" },
							{ type: "separator" },
							{ role: "quit" },
						],
					},
			  ]
			: []),
		// { role: 'fileMenu' }
		{
			label: "File",
			submenu: [isMac ? { role: "close" } : { role: "quit" }],
		},
		// { role: 'viewMenu' }
		{
			label: "View",
			submenu: [
				{ role: "reload" },
				{ role: "forceReload" },
				{ role: "toggleDevTools" },
				{ role: "zoomIn" },
				{ role: "zoomOut" },
				{ type: "separator" },
				{ role: "togglefullscreen" },
			],
		},
		// { role: 'windowMenu' }
		{
			label: "Window",
			submenu: [
				{ role: "minimize" },
				{ role: "zoom" },
				...(isMac
					? [{ type: "separator" }, { role: "front" }, { type: "separator" }, { role: "window" }]
					: [{ role: "close" }]),
			],
		},
		{
			role: "Help",
			submenu: [
				{
					label: "Call 01115034499",
					// click: async () => {
					//   const { shell } = require('electron')
					//   await shell.openExternal('https://electronjs.org')
					// }
				},
			],
		},
	];

	const menu = Menu.buildFromTemplate(template);
	Menu.setApplicationMenu(menu);

	const sendStatus = (text, Obj, state) => {
		try {
			if (win) {
				log.info(text);
				let status = {
					text: text,
					state: state,
					object: Obj,
				};
				if (!closing) {
					win.webContents.send("message", status);
				}
			}
		} catch (error) {
			log.info(error);
		}
	};
	//for windows shutdown but is bugged in electron itself check docs.
	win.on("session-end", () => {
		if (interval0) {
			closing = true;
			isUpdating = true;
			clearInterval(interval0);
			interval0 = "";
		}
		let status = {
			text: "Quiting...",
			state: "app-quit",
		};
		win.webContents.send("message", status);
		log.info("windows shutdown");
	});
	// //Process on exit
	process.on("exit", () => {
		if (interval0) {
			closing = true;
			isUpdating = true;
			clearInterval(interval0);
			interval0 = "";
		}
		let status = {
			text: "Quiting...",
			state: "app-quit",
		};

		win.webContents.send("message", status);
		log.info("Process Exit");
	});
	// //Exit on SIGINT
	process.on("SIGINT", () => {
		if (interval0) {
			closing = true;
			isUpdating = true;
			clearInterval(interval0);
			interval0 = "";
		}
		let status = {
			text: "Quiting...",
			state: "app-quit",
		};
		win.webContents.send("message", status);
		log.info("SIGINT");
	});

	// //For linux and macOS
	powerMonitor.on("shutdown", () => {
		if (interval0) {
			closing = true;
			isUpdating = true;
			clearInterval(interval0);
			interval0 = "";
		}
		let status = {
			text: "Quiting...",
			state: "app-quit",
		};
		win.webContents.send("message", status);
		log.info("Linux shutdown");
	});
	app.on("will-quit", () => {
		if (interval0) {
			closing = true;
			isUpdating = true;
			clearInterval(interval0);
			interval0 = "";
		}
		let status = {
			text: "Quiting...",
			state: "app-quit",
		};
		win.webContents.send("message", status);
		log.info("app quit...");
	});

	autoUpdater.on("checking-for-update", () => {
		sendStatus("Checking for update...", null, "checking");
	});
	autoUpdater.on("update-available", (info) => {
		sendStatus("Starting", {}, "app-start");

		isUpdating = true;
		clearInterval(interval0);
		interval0 = "";
		sendStatus("Update Available.", info, "updateAvailable");
	});
	autoUpdater.on("update-not-available", (info) => {
		sendStatus("Starting", {}, "app-start");

		isUpdating = true;
		clearInterval(interval0);
		interval0 = "";
		sendStatus("Update not available.", info, "updateNotAvailable");
	});
	autoUpdater.on("error", (error) => {
		if (interval0) {
			isUpdating = true;
			clearInterval(interval0);
			interval0 = "";
		}
		log.info(error);
		sendStatus(`Error in updater check internet.`, null, "error");
	});
	autoUpdater.on("download-progress", (progressObj) => {
		isUpdating = true;
		clearInterval(interval0);
		interval0 = "";

		startedDownload = true;
		let log_message = "Download speed: " + progressObj.bytesPerSecond;
		log_message = log_message + " - Downloaded " + progressObj.percent + "%";
		log_message = log_message + " (" + progressObj.transferred + "/" + progressObj.total + ")";
		let log_object = {
			speed: progressObj.bytesPerSecond,
			percentage: progressObj.percent,
			transferred: progressObj.transferred,
			total: progressObj.total,
		};
		if (parseInt(log_object.percentage) >= 99) {
			finishedDownload = true;
		}
		sendStatus(log_message, log_object, "downloadInfo");
	});

	//this function checks first if has started download before actually installing
	//which means that the client has downloaded the client previously then
	//reopened the client so it updates automatically on opening the client if the update exists
	autoUpdater.on("update-downloaded", (info) => {
		if (!startedDownload || finishedDownload) {
			isUpdating = true;
			clearInterval(interval0);
			interval0 = "";

			sendStatus("Update downloaded. Will install shortly...", null, "downloadFinish");
			setTimeout(function () {
				autoUpdater.quitAndInstall();
			}, waitBeforeInstall);
		}
	});

	// this function is called by the front end when the download finishes
	ipcMain.on("reply-message", (event, message) => {
		log.info(message);
		if (message === "installNow") {
			autoUpdater.on("update-downloaded", (info) => {
				clearInterval(interval0);
				interval0 = "";

				sendStatus("Update downloaded. Will install shortly...", null, "downloadFinish");
				setTimeout(function () {
					autoUpdater.quitAndInstall();
				}, waitBeforeInstall);
			});
		}
		if (message === "installLater") {
			clearInterval(interval0);
			interval0 = "";

			sendStatus("Update has been set to run later on next program run!", null, "updateLaterSet");
		}
		if (message === "forceInstallNow") {
			clearInterval(interval0);
			interval0 = "";

			autoUpdater.quitAndInstall();
		}
		if (message === "tokenRemovedOnOpen") {
			log.info("Token Removed On Start Safely");
		}
		if (message === "tokenRemoved") {
			clearInterval(interval0);
			interval0 = "";
			log.info("Token removed safely");
			win.close();
			win.destroy();
		}
	});
}

const checkForUpdates = () => {
	if (isUpdating) return;
	autoUpdater.checkForUpdatesAndNotify();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

app.whenReady().then(() => {
	try {
		if (fs.existsSync(hpath)) {
			// Search for file in C:/HMS_data if exists will try to update hospital database name
			const { hName } = require(hpath);
			// sendHospitalName(hName)
			// 	.then(() => {
			// 		app.whenReady().then(createWindow);
			// 		rimraf(hdir, function () {
			// 			// equivilent for rm -rf linux command to delete folder and contents
			// 			console.log("HMS_Data folder deleted after setting Database name");
			// 		});
			// 	})
			// 	.catch((err) => {
			// 		const options = {
			// 			type: "error",
			// 			buttons: ["OK"],
			// 			defaultId: 2,
			// 			title: "Error",
			// 			message: "[F] Failed to connect to database!",
			// 			detail: `Please check that the server is running, if the problem still persists contact the software developer. ${err}`,
			// 			// checkboxLabel: 'Remember my answer',
			// 			// checkboxChecked: true,
			// 		};
			// 		app
			// 			.whenReady()
			// 			.then(createWindow)
			// 			.then(() => {
			// 				dialog
			// 					.showMessageBox(null, options, (response, checkboxChecked) => {
			// 						console.log(response); //from the docs response gives the index of the button clicked
			// 						console.log(checkboxChecked);
			// 					})
			// 					.then(() => {
			// 						clearInterval(interval0);
			// 						interval0 = "";
			// 						app.quit();
			// 					});
			// 			});
			// 	});
		} else {
			// folder C:/HMS_data does not exist so will open window directly
			app.whenReady().then(createWindow);
		}
	} catch (err) {
		console.error(err);
		const options = {
			type: "error",
			buttons: ["OK"],
			defaultId: 2,
			title: "Error",
			message: "[F] Please try to run program as Administrator or login to windows as Administrator",
			detail: `This is a problem probably related to limited file access , if the problem still persists contact the software developer. ${err}`,
			// checkboxLabel: 'Remember my answer',
			// checkboxChecked: true,
		};
		dialog
			.showMessageBox(null, options, (response, checkboxChecked) => {
				console.log(response); //from the docs response gives the index of the button clicked
				console.log(checkboxChecked);
			})
			.then(() => {
				clearInterval(interval0);
				interval0 = "";
				app.quit();
			});
	}
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		if (interval0) {
			clearInterval(interval0);
			interval0 = "";
		}

		app.quit();
	}
});

app.on("activate", () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

app.on("ready", () => {
	process.env.GH_TOKEN = "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";
	log.info("ready now...");
	checkForUpdates();
	interval0 = setInterval(checkForUpdates, 10000);
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
