import React from "react";
import dateFormat from "dateformat";

export default function PreviousOrders(props) {
	let totalPrice = 0;
	let totalCost = 0;
	return (
		<div>
			<p className="btn btn-outline-primary mt-5">
				{props.allOrders.map((order) => {
					totalPrice += order.price;
					totalCost += order.cost;
				})}
				Total Price: {totalPrice} EGP
			</p>
			<p className="btn btn-outline-danger mt-5 ml-3">Total Fixed Cost: {totalCost} EGP</p>
			<div>
				<p className={totalPrice - totalCost >= 0 ? "btn btn-outline-success mt-2" : "btn btn-outline-danger mt-2"}>
					Profit/Loss: {totalPrice - totalCost} EGP
				</p>
			</div>
			<table className="table table-dark mt-3 ">
				<thead>
					<tr>
						{props.allOrders && props.allOrders.length
							? Object.keys(props.allOrders[0]).map((key, idx) => {
									if (key === "updated_at" || key === "customer_id" || key === "location_id") {
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
					{props.allOrders && props.allOrders.length
						? props.allOrders.map((order, idx) => {
								if (order) {
									return (
										<tr key={idx}>
											<td>{order.id}</td>
											<td>{order.name}</td>
											<td>{order.phone}</td>
											<td>{dateFormat(order.date.split("T")[0], "dd-mm-yyyy")}</td>
											<td>
												<textarea className="textAreaLoc form-control" disabled value={order.location}></textarea>
											</td>
											<td>{order.size}</td>
											<td>{order.price}</td>
											<td>{order.cost}</td>
											<td>{order.start_time}</td>
											<td>{order.end_time}</td>
											<td>{order.workers}</td>
											<td>{dateFormat(order.created_at.split("T")[0], "dd-mm-yyyy")}</td>
										</tr>
									);
								} else {
									return null;
								}
						  })
						: null}
				</tbody>
			</table>
		</div>
	);
}
