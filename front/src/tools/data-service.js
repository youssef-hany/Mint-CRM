import NotificationService, {
	APP_NEEDS_UPDATE,
	NOTIF_USER_LOGGED_IN,
	NOTIF_USER_LOGGED_OUT,
	NOTIF_CURRENT_OWNERS_CHANGED,
	NOTIF_MENU_COLLAPSED,
	APP_WILL_RESTART,
	APP_WILL_RESTART_LATER,
	APP_IS_DOWNLOADING,
} from "./notification-service";
// import { isAuthenticated } from "../Account/authenticated";
import jwt from "jsonwebtoken";
export const IP_ADDRESS = process.env.REACT_APP_IP_ADDRESS;
export const PORT = process.env.REACT_APP_PORT;

let ns = new NotificationService();

let instance = null;
var user = [];
var currentOwners = [];
let menuCollapsed = false;
let needUpdate = false;
let willRestart = false;
let willRestartLater = false;
let isDownloading = false;
class DataService {
	constructor() {
		if (!instance) {
			instance = this;
		}
		return instance;
	}
	menuPressed = (collapse) => {
		if (collapse) {
			menuCollapsed = false;
		} else {
			menuCollapsed = true;
		}
		ns.postNotification(NOTIF_MENU_COLLAPSED, menuCollapsed);
	};
	checkUpdate = (updateState) => {
		if (updateState) {
			needUpdate = true;
		}
		ns.postNotification(APP_NEEDS_UPDATE, needUpdate);
	};
	isDownloading = (state) => {
		isDownloading = state;
		ns.postNotification(APP_IS_DOWNLOADING, isDownloading);
	};
	willRestart = (state) => {
		if (state) {
			willRestart = true;
		}
		ns.postNotification(APP_WILL_RESTART, willRestart);
	};

	willRestartLater = (state) => {
		willRestartLater = state;
		ns.postNotification(APP_WILL_RESTART_LATER, willRestartLater);
	};

	addCurrentOwner = (owner) => {
		if (owner) {
			for (var x = 0; x < currentOwners.length; x++) {
				if (currentOwners[x].id === owner.id) {
					return { error: "Owner Already Subscribed" };
				} else {
					currentOwners.push(owner);
					ns.postNotification(NOTIF_CURRENT_OWNERS_CHANGED, owner);
				}
			}
		} else {
			console.log("No Owner Provided");
		}
	};
	removeCurrentOwner = (owner) => {
		if (owner) {
			for (var x = 0; x < currentOwners.length; x++) {
				if (currentOwners[x].id === owner.id) {
					currentOwners.splice(owner, 1);
					ns.postNotification(NOTIF_CURRENT_OWNERS_CHANGED, owner);
				} else {
					console.log("Owner not found!");
				}
			}
		} else {
			console.log("No Owner Provided");
		}
	};
	isUserLoggedIn = (token, keygen) => {
		var bool = true;
		if (token) {
			try {
				const decoded = jwt.verify(token, "secret");
				if (bool && decoded) {
					if (!user.length) {
						user.keygen = keygen;
						user.push(decoded);
					}

					if (decoded.email) {
						ns.postNotification(NOTIF_USER_LOGGED_IN, decoded);
						return token;
					}
				} else {
					return false;
				}
			} catch (err) {
				if (err) {
					console.log("Cannot decode user");
					return false;
				}
			}
		} else {
			return false;
		}
		return false;
	};
	isUserLoggedOut = (token) => {
		var bool = true;
		if (token) {
			user = [];
			ns.postNotification(NOTIF_USER_LOGGED_OUT, user);
			localStorage.removeItem("usertoken");
			try {
				const decoded = jwt.verify(token, "secret");
				if (bool && decoded) {
					// user = []

					if (decoded.email) {
						// ns.postNotification(NOTIF_USER_LOGGED_OUT, user)
						// localStorage.removeItem("usertoken")
						return true;
					}
				} else {
					return true;
				}
			} catch (err) {
				if (err) {
					return true;
				}
			}
		} else {
			return true;
		}
		return true;
	};
}
export default DataService;
