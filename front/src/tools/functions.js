import axios from "axios";
import { IP_ADDRESS, PORT } from "../tools/data-service";

const ipaddress = IP_ADDRESS;
const port = PORT;
export const postOrder = (data) => {
	return axios
		.post(`http://${ipaddress}:${port}/postOrder`, {
			data: data,
		})
		.then((response) => {
			return response.data;
		});
};
