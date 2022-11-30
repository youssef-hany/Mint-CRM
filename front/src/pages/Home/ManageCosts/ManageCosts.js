import React, { useEffect, useState } from "react";
import dateFormat from "dateformat";
import "./ManageCosts.css";

export default function ManageCosts({
	allCosts,
	AddNewCost,
	allWharehouse,
	wharehouseItemCheck,
	costName,
	alertAmount,
	onChange,
	costDate,
	costQuantity,
	costAmount,
	wharehouseItem,
	setWharehouseItem,
}) {
	const [allWharehouseItems, setAllWharehouseItems] = useState(allWharehouse);
	var totalCost = 0;

	if (allCosts && allCosts.length) {
		allCosts.forEach((cost) => {
			totalCost += cost.total;
		});
	}
	const itemOnChange = (e) => {
		let itemFound = false;
		allWharehouse.forEach((item) => {
			console.log(item, e.currentTarget.value);
			if (parseInt(item.id) === parseInt(e.currentTarget.value)) {
				setWharehouseItem(item);
				e.target.value = item.name;
				itemFound = true;
				onChange(e);
			}
		});
		if (itemFound) {
			onChange(e);
		} else {
			setWharehouseItem({});
			onChange(e);
		}
	};
	useEffect(() => {
		return () => {
			if (!allWharehouseItems.length && allWharehouse.length) {
				setAllWharehouseItems(allWharehouse);
			}
		};
	}, [allWharehouse, allWharehouseItems.length]);

	return (
		<div>
			<div className="mt-3">
				<form className="costForm row" onSubmit={(e) => AddNewCost(e)}>
					<input
						id="inputName"
						list="wharehouseItems"
						placeholder="Cost Name"
						name="costName"
						type="text"
						className="form-control m-2 col text-center"
						value={costName}
						onChange={itemOnChange}
					></input>
					<datalist id="wharehouseItems" name="wharehouseItems">
						{allWharehouseItems.map((item, index) => {
							return (
								<option key={index} value={item.id}>
									{item.name}
								</option>
							);
						})}
					</datalist>
					<input
						name="costDate"
						value={costDate}
						type="date"
						className="form-control m-2 col text-center"
						placeholder="Date"
						onChange={onChange}
					></input>
					<input
						name="costQuantity"
						value={costQuantity}
						type="number"
						className="form-control m-2 col text-center"
						placeholder="Quantity"
						onChange={onChange}
					></input>
					<input
						name="costAmount"
						value={costAmount}
						type="text"
						className="form-control m-2 col text-center"
						placeholder="Amount (EGP)"
						onChange={onChange}
					></input>
					{!wharehouseItem?.name && (
						<div className="col my-auto">
							<>
								<input
									id="wharehouseItemCheck"
									name="wharehouseItemCheck"
									type="checkbox"
									className="m-2 text-center"
									label="is this a wharehouse tracked item?"
									aria-label="Checkbox that indicates that this employee is a wharehouse item to be tracked in the wharehouse tab"
									value={wharehouseItemCheck}
									onChange={onChange}
								></input>
								<label htmlFor="wharehouseItemCheck" className="font-xs">
									<small>Wharehouse Item</small>
								</label>
							</>
						</div>
					)}
					{wharehouseItemCheck && !wharehouseItem?.name && (
						<div className="col">
							<input
								name="alertAmount"
								value={alertAmount}
								type="text"
								className="form-control m-2 col text-center"
								placeholder="Alert Amount"
								onChange={onChange}
							></input>
						</div>
					)}
					<input type="submit" className="btn btn-primary buttonSubmit" value="Submit"></input>
				</form>
			</div>
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
							{totalCost} EGP
						</td>
					</tr>
				</tbody>
			</table>
			<table className="table table-striped table-light mt-3">
				<thead>
					<tr>
						<th scope="col">#</th>
						{allCosts && allCosts.length
							? Object.keys(allCosts[0]).map((key, idx) => {
									if (key === "updated_at" || key === "id") {
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
					{allCosts && allCosts.length
						? allCosts.map((cost, idx) => {
								idx++;
								if (cost) {
									return (
										<tr key={idx}>
											<th scope="row">{idx}</th>
											<td>{cost.name}</td>
											<td>{dateFormat(cost.date, "dd-mm-yyyy")}</td>
											<td>{cost.wharehouse_id}</td>
											<td>{cost.quantity}</td>
											<td>{cost.total} EGP</td>
											<td>{dateFormat(cost.created_at.split("T")[0], "dd-mm-yyyy")}</td>
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
