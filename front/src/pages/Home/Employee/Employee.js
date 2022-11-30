import dateFormat from "dateformat";
import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { AddPeriodModal, DocumentsModal, SubmitEmployeeModal } from "../../../components/Modals/Modals";
import { addPeriodToEmployee, updateEmployee } from "../../../tools/functions";
import HttpService from "../../../tools/http-service/http-service";
import { BackArrowSVGIcon, EditSVGIcon, LoaderSpinner, PlusSVGIcon } from "../../../tools/utils/icons";
import "./Employee.css";

let httpService = new HttpService();

export default function Employee(props) {
	const history = useHistory();
	const employeeId = props?.location?.pathname?.split("/employee/")[1];
	const [employee, setEmployee] = useState({
		name: "",
		phone: "",
		details: "",
		image: "",
		periods: [],
		isInHouse: null,
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

	const GetEmployee = useCallback(
		(id) => {
			httpService.GetEmployee({ id }).then((data) => {
				if (data) {
					setEmployee({ ...employee, ...data?.employee });
				}
			});
		},
		[employee]
	);

	useEffect(() => {
		if (!employee?.id) {
			GetEmployee(employeeId);
		}
		return () => {
			if (props?.location?.state && !employee?.id) {
				setEmployee(props?.location?.state);
			}
		};
	}, [employee?.id, employeeId, GetEmployee, setEmployee, props?.location?.state]);

	const chooseAssets = (e, assets) => {
		e.preventDefault();
		e.stopPropagation();
		setModalAssets(assets);
	};

	const AddPeriodToEmployee = (period, e) => {
		e.preventDefault();
		e.stopPropagation();
		setLoading(true);
		const formdata = new FormData();
		for (let fileIndex = 0; fileIndex < period.file.length; fileIndex++) {
			period["file" + fileIndex] = period.file.item(fileIndex);
		}
		for (var key in period) {
			formdata.append(key, period[key]);
		}

		formdata.append("employee", JSON.stringify(employee));

		addPeriodToEmployee(formdata).then((result) => {
			setLoading(false);
			if (result) {
				if (result.success) {
					setAlert({
						success: result.success,
					});
					setTimeout(() => {
						setAlert({ error: "", success: "" });
					}, 6000);
					GetEmployee(employee.id);
				} else {
					setAlert({
						error: result.error,
						load: false,
					});
					setTimeout(() => {
						setAlert({ error: "", success: "" });
					}, 6000);
				}
			} else {
				setAlert({
					error: "[F] No response from database. Check connection...",
					load: false,
				});
				setTimeout(() => {
					setAlert({ error: "", success: "" });
				}, 6000);
			}
		});
	};

	const UpdateEmployee = (employee, e) => {
		e.preventDefault();
		e.stopPropagation();
		setLoading(true);
		const formdata = new FormData();
		for (var key in employee) {
			formdata.append(key, employee[key]);
		}
		updateEmployee(formdata).then((result) => {
			if (result) {
				setLoading(false);
				if (result.success) {
					setAlert({
						success: result.success,
					});
					setTimeout(() => {
						setAlert({ error: "", success: "" });
					}, 6000);
					GetEmployee(employee.id);
				} else {
					setAlert({
						error: result.error,
						load: false,
					});
					setTimeout(() => {
						setAlert({ error: "", success: "" });
					}, 6000);
				}
			} else {
				setAlert({
					error: "[F] No response from database. Check connection...",
					load: false,
				});
				setTimeout(() => {
					setAlert({ error: "", success: "" });
				}, 6000);
			}
		});
	};
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
				<div className="col-6">
					<div className="w-50 text-right ml-auto rounded">
						{employee.image && (
							<img
								src={process.env.PUBLIC_URL + "/uploads" + employee.image?.split("/uploads")[1]?.toLowerCase()}
								className="img-fluid rounded text-right align-right"
								alt={employee.name + "'s Picture (Needs Upload)"}
							></img>
						)}
						<h4 className="mx-2 my-1 text-left">{employee?.name}</h4>
						<h5 className="mx-2 my-1 text-left">{employee?.phone}</h5>
					</div>
				</div>
			</div>
			<SubmitEmployeeModal
				setEmployee={setEmployee}
				employee={employee}
				submitFunction={UpdateEmployee}
				modalTitle={"Update Employee"}
				isUpdate={true}
			/>
			<DocumentsModal modalAssets={modalAssets} setModalAssets={setModalAssets} employee={employee} />
			{AddPeriodModal({ AddPeriodToEmployee, period, setPeriod })}
			<div className="mt-5">
				<div className="d-flex mx-3 justify-content-center my-auto">
					<span className="my-auto mx-2" role="button" data-toggle="modal" data-target="#addPeriodModal">
						<PlusSVGIcon title="Add Period" width={25} />
					</span>
					<span className="my-auto mx-2" role="button" data-toggle="modal" data-target="#employeeModal">
						<EditSVGIcon title={"Edit Employee"} width={25} />
					</span>
				</div>
				<table className="table table-dark mt-3 ">
					<thead>
						<tr className="text-center">
							{employee && employee?.periods && employee?.periods?.length
								? Object.keys(employee.periods[0]).map((key, idx) => {
										if (
											key === "updated_at" ||
											key === "created_at" ||
											key === "employee_id" ||
											key === "employment_period_id"
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
						</tr>
					</thead>
					<tbody>
						{employee && employee?.periods && employee?.periods?.length
							? employee.periods.map((tablePeriod, idx) => {
									if (tablePeriod) {
										return (
											<tr key={idx} className="text-center">
												<td>{tablePeriod.id}</td>
												<td>{tablePeriod.period_details}</td>
												<td>{tablePeriod.status}</td>
												<td>{tablePeriod.isInHouse ? "Yes" : "No"}</td>
												<td>{tablePeriod.position}</td>
												<td>{dateFormat(tablePeriod.from.split("T")[0], "dd-mm-yyyy")}</td>
												<td>{dateFormat(tablePeriod.to.split("T")[0], "dd-mm-yyyy")}</td>
												<td>
													{modalAssets &&
													modalAssets.length &&
													JSON.stringify(modalAssets) === JSON.stringify(tablePeriod.assets) ? (
														<a
															onClick={(e) => e.preventDefault()}
															href="#assetsModal"
															className="btn btn-info"
															role="button"
															data-toggle="modal"
															data-target="#assetsModal"
														>
															View Documents
														</a>
													) : (
														<a
															onClick={(e) => chooseAssets(e, tablePeriod.assets)}
															href="#assetsModal"
															role="button"
															className="badge badge-info"
														>
															{tablePeriod.assets.length}
														</a>
													)}
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
			</div>
		</div>
	);
}
