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

	GetOwners = () => {
		var promise = new Promise((resolve, reject) => {
			fetch(`http://${ipaddress}:${port}/allOwners`)
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
