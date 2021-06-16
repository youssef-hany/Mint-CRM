import React, { Component } from "react";

export default class Default extends Component {
	componentDidMount() {
		this.props.history.push("/");
	}
	render() {
		return (
			<div>
				<h3>Invalid Resource, Please refresh page!</h3>
			</div>
		);
	}
}
