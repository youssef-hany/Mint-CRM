import React from "react";
import "./ManageCosts.css";

export default function ManageCosts(props) {
	var totalCost = 0;
	var totalQuanity = 0;

	if (props.allCosts && props.allCosts.length) {
		props.allCosts.forEach((cost) => {
			totalCost += cost.cost;
			totalQuanity += cost.quantity;
		});
	}
	return (
		<div>
			<div className="mt-3">
				<form className="costForm row" onSubmit={(e) => props.AddNewCost(e)}>
					<input
						name="costName"
						value={props.costName}
						type="text"
						className="form-control m-2 col text-center"
						placeholder="Cost Name"
						onChange={props.onChange}
					></input>
					<input
						name="costDate"
						value={props.costDate}
						type="date"
						className="form-control m-2 col text-center"
						placeholder="Date"
						onChange={props.onChange}
					></input>
					<input
						name="costQuantity"
						value={props.costQuantity}
						type="number"
						className="form-control m-2 col text-center"
						placeholder="Quantity"
						onChange={props.onChange}
					></input>
					<input
						name="costAmount"
						value={props.costAmount}
						type="text"
						className="form-control m-2 col text-center"
						placeholder="Amount"
						onChange={props.onChange}
					></input>
					<input type="submit" className="btn btn-primary buttonSubmit" value="Submit"></input>
				</form>
			</div>

			<table className="table table-striped table-light mt-3">
				<thead>
					<tr>
						<th scope="col">#</th>
						{props.allCosts && props.allCosts.length
							? Object.keys(props.allCosts[0]).map((key, idx) => {
									if (key === "updated_at") {
										return null;
									} else {
										return (
											<th key={idx} scope="col">
												{key}
											</th>
										);
									}
							  })
							: null}
					</tr>
				</thead>
				<tbody>
					{props.allCosts && props.allCosts.length
						? props.allCosts.map((cost, idx) => {
								idx++;
								if (cost) {
									return (
										<tr key={idx}>
											<th scope="row">{idx}</th>
											<td>{cost.id}</td>
											<td>{cost.name}</td>
											<td>{cost.date}</td>
											<td>{cost.quantity}</td>
											<td>{cost.cost}</td>
											<td>{cost.created_at.split("T")[0]}</td>
										</tr>
									);
								} else {
									return null;
								}
						  })
						: null}
				</tbody>
			</table>
			<table className="table">
				<thead>
					<tr>
						<th colSpan="2" scope="col">
							Total Cost
						</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td colSpan="2" className="table-active">
							{totalCost}
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}
