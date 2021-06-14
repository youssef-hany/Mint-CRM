export const NOTIF_USER_LOGGED_IN = "notif_user_logged_in";
export const NOTIF_USER_LOGGED_OUT = "notif_user_logged_out";
export const NOTIF_CURRENT_OWNERS_CHANGED = "notif_current_owners_changed";
export const NOTIF_MENU_COLLAPSED = "notif_menu_collapsed";
export const APP_NEEDS_UPDATE = "app_need_update";
export const APP_WILL_RESTART = "app_will_restart";
export const APP_WILL_RESTART_LATER = "app_will_restart_later";
export const APP_IS_DOWNLOADING = "app_is_downloading";

var observers = {};
let instance = null;

class NotificationService {
  constructor() {
    if (!instance) {
      instance = this;
    }
    return instance;
  }
  postNotification = (notifName, data) => {
    let obs = observers[notifName];
    if (obs && obs.length) {
      //check if there is observers(components) listening
      for (var x = 0; x < obs.length; x++) {
        var obj = obs[x];
        obj.callback(data);
      }
    }
  };

  removeObserver = (observer, notifName) => {
    var obs = observers[notifName];
    if (obs) {
      for (var x = 0; x < obs.length; x++) {
        if (observer === obs[x].observer) {
          obs.splice(x, 1);
          observer[notifName] = obs;
          break;
        }
      }
    }
  };

  addObserver = (notifName, observer, callback) => {
    let obs = observers[notifName];
    if (!obs) {
      observers[notifName] = [];
    }
    let obj = { observer: observer, callback: callback };

    observers[notifName].push(obj);
  };
}
export default NotificationService;
