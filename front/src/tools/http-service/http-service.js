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
}

export default HttpService;
