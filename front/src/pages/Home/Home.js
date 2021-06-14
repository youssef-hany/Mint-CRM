import React, { Component } from "react";
import Loader from "react-loader-spinner";
import { postOrder } from "../../tools/functions";
import "./Home.css";
export class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
			phone: "",
			error: "",
			spinner: (
				<div className="Loader">
					<Loader type="TailSpin" color="#7a7a7a" height={60} width={60} />
				</div>
			),
			load: false,
		};

		this.onChange = this.onChange.bind(this);
		this.AddOrder = this.AddOrder.bind(this);
	}
	onChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	};
	AddOrder = (e) => {
		e.preventDefault();
		this.setState({ load: true });
		let data = {
			name: this.state.name,
			phone: this.state.phone,
		};
		postOrder(data).then((response) => {
			if (response) {
				if (response.success) {
					this.setState(
						{
							success: response.success,
							load: false,
							name: "",
							phone: "",
						},
						() => {
							window.setTimeout(() => {
								this.setState({ error: "", success: "" });
							}, 6000);
						}
					);
				} else {
					if (response.error) {
						this.setState(
							{
								error: response.error,
								load: false,
							},
							() => {
								window.setTimeout(() => {
									this.setState({ error: "", success: "" });
								}, 8000);
							}
						);
					}
				}
			} else {
				this.setState({
					load: false,
					error: "[F] No response from server database",
				});
				console.log("No Response from server");
			}
		});
	};
	render() {
		return (
			<div>
				<div className="container row mx-auto">
					<div className="col-sm-12 w-100 mt-5">
						{this.state.error ? (
							<div className="container alertContainer text-center alert alert-danger fade show mt-1">
								{this.state.error}
							</div>
						) : (
							""
						)}
						{this.state.success ? (
							<div className="container alertContainer text-center alert alert-success fade show mt-1">
								{this.state.success}
							</div>
						) : (
							""
						)}
						{this.state.load ? this.state.spinner : <div></div>}
						<form className="container mt-5" onSubmit={this.AddOrder}>
							<div className="">
								<label for="inputName">Email address</label>

								<input
									id="inputName"
									placeholder="Name"
									name="name"
									type="text"
									className="form-control w-25 mx-auto m-2"
									value={this.state.name}
									onChange={this.onChange}
								></input>
								<label for="inputPhone">Phone</label>
								<input
									id="inputPhone"
									placeholder="01115034499"
									name="phone"
									type="text"
									className="form-control w-25 mx-auto m-2"
									value={this.state.phone}
									onChange={this.onChange}
								></input>
								<button type="submit" className="btn btn-primary mb-2">
									submit
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		);
	}
}

export default Home;
