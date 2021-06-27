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
export const postCustomer = (data) => {
	return axios
		.post(`http://${ipaddress}:${port}/newCustomer`, {
			data: data,
		})
		.then((response) => {
			return response.data;
		});
};
export const getCustomerLocations = (id) => {
	return axios
		.post(`http://${ipaddress}:${port}/getCustomerLocations`, {
			id,
		})
		.then((response) => {
			return response.data;
		});
};
export const addCustomerLocation = (data) => {
	return axios
		.post(`http://${ipaddress}:${port}/addCustomerLocation`, {
			data: data,
		})
		.then((response) => {
			return response.data;
		});
};
export const uploadPDF = (data) => {
	return axios
		.post(`http://${ipaddress}:${port}/uploadpdf`, data, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		})
		.then((response) => {
			return response.data;
		});
};
export const removePDF = (data) => {
	return axios
		.post(`http://${ipaddress}:${port}/removepdf`, {
			data: data,
		})
		.then((response) => {
			return response.data;
		});
};
export const updateCost = (data) => {
	return axios
		.post(`http://${ipaddress}:${port}/updateCost`, {
			data: data,
		})
		.then((response) => {
			return response.data;
		});
};
export const addNewCost = (data) => {
	return axios
		.post(`http://${ipaddress}:${port}/addNewCost`, {
			data: data,
		})
		.then((response) => {
			return response.data;
		});
};
