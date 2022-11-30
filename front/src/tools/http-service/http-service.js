import "whatwg-fetch";
import { IP_ADDRESS, PORT } from "../data-service";

let instance = null;
const port = PORT;
const ipaddress = IP_ADDRESS;

class HttpService {
	constructor() {
		if (!instance) {
			instance = this;
		}

		return instance;
	}

	GetOrders = () => {
		var promise = new Promise((resolve, reject) => {
			fetch(`http://${ipaddress}:${port}/getorders`)
				.then((response) => {
					resolve(response.json());
				})
				.catch((err) => {
					reject(err);
				});
		});
		return promise;
	};
	GetLocations = () => {
		var promise = new Promise((resolve, reject) => {
			fetch(`http://${ipaddress}:${port}/getlocations`)
				.then((response) => {
					resolve(response.json());
				})
				.catch((err) => {
					reject(err);
				});
		});
		return promise;
	};

	GetCosts = () => {
		var promise = new Promise((resolve, reject) => {
			fetch(`http://${ipaddress}:${port}/getCosts`)
				.then((response) => {
					resolve(response.json());
				})
				.catch((err) => {
					reject(err);
				});
		});
		return promise;
	};

	GetCustomers = () => {
		var promise = new Promise((resolve, reject) => {
			fetch(`http://${ipaddress}:${port}/getCustomers`)
				.then((response) => {
					resolve(response.json());
				})
				.catch((err) => {
					reject(err);
				});
		});
		return promise;
	};

	GetEmployee = ({ id }) => {
		var promise = new Promise((resolve, reject) => {
			fetch(`http://${ipaddress}:${port}/GetEmployee/${id}`)
				.then((response) => {
					resolve(response.json());
				})
				.catch((err) => {
					reject(err);
				});
		});
		return promise;
	};
	GetWharehouseItem = ({ id }) => {
		var promise = new Promise((resolve, reject) => {
			fetch(`http://${ipaddress}:${port}/GetWharehouseItem/${id}`)
				.then((response) => {
					resolve(response.json());
				})
				.catch((err) => {
					reject(err);
				});
		});
		return promise;
	};
	GetWharehouse = () => {
		var promise = new Promise((resolve, reject) => {
			fetch(`http://${ipaddress}:${port}/getWharehouse`)
				.then((response) => {
					resolve(response.json());
				})
				.catch((err) => {
					reject(err);
				});
		});
		return promise;
	};
	GetEmployeePeriods = ({ id }) => {
		var promise = new Promise((resolve, reject) => {
			fetch(`http://${ipaddress}:${port}/GetEmployeePeriods/${id}`)
				.then((response) => {
					resolve(response.json());
				})
				.catch((err) => {
					reject(err);
				});
		});
		return promise;
	};

	GetEmployees = () => {
		var promise = new Promise((resolve, reject) => {
			fetch(`http://${ipaddress}:${port}/GetEmployees`)
				.then((response) => {
					resolve(response.json());
				})
				.catch((err) => {
					reject(err);
				});
		});
		return promise;
	};
}

export default HttpService;
