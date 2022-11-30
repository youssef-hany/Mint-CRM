import dateFormat from "dateformat";
import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import HttpService from "../../../tools/http-service/http-service";
import { BackArrowSVGIcon, LoaderSpinner } from "../../../tools/utils/icons";
import "./WharehouseItem.css";

let httpService = new HttpService();

export default function WharehouseItem(props) {
	const history = useHistory();
	const wharehouseId = props?.location?.pathname?.split("/wharehouse/")[1].split("/history")[0];
	const [wharehouse, setWharehouse] = useState({
		history: [],
	});
	const [isLoading, setLoading] = useState(false);
	const [alert, setAlert] = useState({ success: "", error: "" });
	const [period, setPeriod] = useState({
		period_details: "",
		status: "",
		isInHouse: "",
		position: "",
		from: "",
		to: "",
		file: "",
	});
	const [modalAssets, setModalAssets] = useState([]);

	const GetWharehouseItem = useCallback(
		(id) => {
			httpService.GetWharehouseItem({ id }).then((data) => {
				if (data.success) {
					setWharehouse({ ...wharehouse, ...data?.wharehouseItem });
				} else if (data.error) {
					setAlert({ error: data.error });
				}
			});
		},
		[wharehouse]
	);
	useEffect(() => {
		if (!wharehouse?.id && !alert.error) {
			GetWharehouseItem(wharehouseId);
		}
		return () => {
			if (props?.location?.state && !wharehouse?.id) {
				setWharehouse(props?.location?.state);
			}
		};
	}, [wharehouse?.id, wharehouseId, alert.error, GetWharehouseItem, setWharehouse, props?.location?.state]);

	return (
		<div className="mt-5 mx-5 text-left">
			{alert.error ? (
				<div className="container alertContainer text-center alert alert-danger fade show  ">{alert.error}</div>
			) : (
				""
			)}
			{alert.success ? (
				<div className="container alertContainer text-center alert alert-success fade show ">{alert.success}</div>
			) : (
				""
			)}
			<div className="mx-auto container mt-3 text-center">{isLoading ? <LoaderSpinner /> : null}</div>
			<div className="row">
				<div className="col">
					<button className="btn btn-primary my-auto top-0" onClick={() => history.push("/home")}>
						<BackArrowSVGIcon width={12} title="Back" classes="mr-1 mb-1" color="white" />
						Back
					</button>
				</div>
			</div>
			<div className="mt-5">
				<div className="d-flex mx-3 justify-content-center my-auto">
					<h5 className="text-left border rounded-lg p-3">{wharehouse.name}</h5>
				</div>
				{wharehouse && wharehouse?.history && wharehouse?.history?.length > 0 ? null : (
					<p className="text-center mt-4">Item has not been used yet.</p>
				)}
				<table className="table table-dark mt-3 ">
					<thead>
						<tr className="text-center">
							{wharehouse && wharehouse?.history && wharehouse?.history?.length > 0
								? Object.keys(wharehouse?.history[0]).map((key, idx) => {
										if (key === "updated_at" || key === "created_at" || key === "wharehouse_item_id") {
											return null;
										} else {
											return (
												<th key={idx} scope="col">
													{key === "id" ? "#" : key === "name" ? "customer name" : key}
												</th>
											);
										}
								  })
								: null}
						</tr>
					</thead>
					<tbody>
						{wharehouse && wharehouse?.history && wharehouse?.history.length > 0
							? wharehouse?.history.map((historyItem, idx) => {
									console.log(historyItem);
									if (historyItem) {
										return (
											<tr key={idx} className="text-center">
												<td>{historyItem.id}</td>
												<td>{historyItem.comment}</td>
												<td>{historyItem.quantity_taken}</td>
												<td>{historyItem.customer_id}</td>
												<td>{historyItem.name}</td>
												<td>{historyItem.phone}</td>
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
		</div>
	);
}
