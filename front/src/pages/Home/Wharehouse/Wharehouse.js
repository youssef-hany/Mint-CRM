import dateFormat from "dateformat";
import React, { useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import { SubmitWharehouseItemModal } from "../../../components/Modals/Modals";
import "./Wharehouse.css";

export default function Wharehouse({
	allWharehouse: wharehouseItems,
	GetAllWharehouse,
	addWharehouseTransactionItem,
	allCustomers,
}) {
	const history = useHistory();
	const allWharehouse = useMemo(
		() => (wharehouseItems && wharehouseItems.length > 0 ? wharehouseItems : null),
		[wharehouseItems]
	);
	const [wharehouseList, setWharehouseList] = useState(null);
	const [isFiltering, setIsFiltering] = useState(false);
	const [wharehouse, setWharehouse] = useState({
		quantity_taken: "",
		customer_id: "",
		comment: "",
	});
	useEffect(() => {
		if (!wharehouseList && !allWharehouse) {
			GetAllWharehouse().then(() => {
				setWharehouseList(allWharehouse);
			});
		} else if (allWharehouse.length && !isFiltering) {
			setWharehouseList(allWharehouse);
		}
	}, [wharehouseList, allWharehouse, GetAllWharehouse, isFiltering]);

	const filterWharehouse = (e) => {
		const { value } = e.currentTarget;
		const filteredWharehouse = allWharehouse.filter((employeeItem) => {
			if (value.length > 2) {
				setIsFiltering(true);
				if (employeeItem.name.indexOf(value) > -1) {
					return employeeItem;
				}
				return false;
			} else {
				return employeeItem;
			}
		});
		setWharehouseList(filteredWharehouse);
	};
	const onWharehouseInputChange = (newWharehouse) => {
		setWharehouse(newWharehouse);
	};
	return (
		<div className="mt-5">
			<SubmitWharehouseItemModal
				setWharehouse={onWharehouseInputChange}
				wharehouseItem={wharehouse}
				submitFunction={addWharehouseTransactionItem}
				modalTitle={"New Item"}
				allCustomers={allCustomers}
			/>
			<div className="d-flex justify-content-end">
				{wharehouseList && wharehouseList.length > 0 ? (
					<input
						id="inputName"
						placeholder="Search for an item"
						name="customerName"
						type="text"
						className="form-control mx-auto m-2 inputField"
						onChange={filterWharehouse}
					></input>
				) : null}

				{/* <div className="mx-auto my-auto">
					<span type="button" data-toggle="modal" data-target="#employeeModal">
						<PlusSVGIcon title="Add Employee" width={30} />
					</span>
				</div> */}
			</div>
			{wharehouseList && wharehouseList.length > 0 ? (
				<table className="table table-dark mt-3 ">
					<thead>
						<tr>
							<th scope="col">Name</th>
							{wharehouseList && wharehouseList.length > 0
								? Object.keys(wharehouseList[0]).map((key, idx) => {
										if (
											key === "updated_at" ||
											key === "quantity" ||
											key === "wharehouse_id" ||
											key === "date" ||
											key === "amount" ||
											key === "history" ||
											key === "total" ||
											key === "id" ||
											key === "name"
										) {
											return null;
										} else {
											return (
												<th key={idx} scope="col">
													{key === "id" ? "#" : key}
												</th>
											);
										}
								  })
								: null}
							<th scope="col">history</th>
							<th scope="col"></th>
						</tr>
					</thead>
					<tbody>
						{wharehouseList && wharehouseList.length
							? wharehouseList.map((item, idx) => {
									const needResupply = parseInt(item.available_quantity) <= parseInt(item.alert_at);
									if (item) {
										return (
											<tr
												role="button"
												key={idx}
												className={needResupply ? "btn-warning" : "btn-dark"}
												onClick={() => {
													history.push({
														pathname: `/wharehouse/${item.id}/history`,
														state: item,
													});
												}}
											>
												<td>{item.name}</td>
												<td>{item.available_quantity}</td>
												<td>{item.alert_at}</td>
												<td>{dateFormat(item.created_at.split("T")[0], "dd-mm-yyyy")}</td>
												<td>{item.history.length}</td>
												<td>
													<a
														onClick={(e) => {
															e.preventDefault();
															e.stopPropagation();
															setWharehouse((prevWharehouse) => ({ ...prevWharehouse, ...item }));
														}}
														href="#wharehouseTransactionModal"
														className="btn btn-info"
														role="button"
														data-toggle="modal"
														data-target="#wharehouseTransactionModal"
													>
														Add Transactions
													</a>
												</td>
											</tr>
										);
									} else {
										return null;
									}
							  })
							: null}
					</tbody>
				</table>
			) : (
				<p className="text-center mt-5">No Tracked Items Yet.</p>
			)}
		</div>
	);
}
