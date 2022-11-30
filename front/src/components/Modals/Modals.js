import { useEffect, useState } from "react";

const handleCloseModal = (modalId) => {
	document.getElementById(modalId).classList.remove("show", "d-block");
	document.querySelectorAll(".modal-backdrop").forEach((el) => el.classList.remove("modal-backdrop"));
	document.getElementById(modalId).click();
};

export const SubmitEmployeeModal = ({ setEmployee, submitFunction, employee, modalTitle, isUpdate }) => {
	const [selectedFile, setSelectedFile] = useState(null);
	const [preview, setPreview] = useState(null);
	const imageUrl = employee?.image?.split("/uploads")[1]?.toLowerCase();
	const fullImageUrl = process.env.PUBLIC_URL + "/uploads" + imageUrl;
	useEffect(() => {
		let objectUrl = "";
		// create the preview
		if (selectedFile) {
			var reader = new FileReader();
			objectUrl = reader.readAsDataURL(selectedFile);
			reader.onloadend = function (e) {
				setPreview([reader.result]);
			};
		}

		// free memory when ever this component is unmounted
		return () => URL.revokeObjectURL(objectUrl);
	}, [selectedFile]);

	const onSelectFile = (e) => {
		if (!e.target.files || e.target.files.length === 0) {
			setSelectedFile(null);
			return;
		}
		// I've kept this example simple by using the first image instead of multiple
		setSelectedFile(e.target.files[0]);
	};

	return (
		<div
			className="modal fade"
			id="employeeModal"
			tabindex="-1"
			role="dialog"
			aria-labelledby="employeeModalLabel"
			aria-hidden="true"
		>
			<div className="modal-dialog" role="document">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title" id="employeeModalLabel">
							{modalTitle}
						</h5>
						<button type="button" className="close black" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							submitFunction(employee, e);
						}}
						encType="multipart/form-data"
					>
						<div className="modal-body">
							<div className="row my-3">
								<div className="col">
									<input
										id="profileImage"
										name="profileImage"
										type="file"
										className="form-control"
										onChange={(e) => {
											onSelectFile(e);
											setEmployee({ ...employee, profileImage: e.currentTarget.files[0] });
										}}
									></input>
								</div>
								<div className="col">
									{(preview || imageUrl) && (
										<img src={preview || fullImageUrl} className="img-fluid rounded" alt="name"></img>
									)}
								</div>
							</div>
							<div className="row my-3">
								<div className="col">
									<input
										id="inputName"
										placeholder="Employee name"
										name="employeeName"
										type="text"
										className="form-control"
										value={employee.name}
										onChange={(e) => setEmployee({ ...employee, name: e.currentTarget.value })}
									></input>
								</div>
								<div className="col">
									<input
										id="inputName"
										placeholder="+201115034499"
										name="employeePhone"
										type="text"
										className="form-control"
										value={employee.phone}
										onChange={(e) => setEmployee({ ...employee, phone: e.currentTarget.value })}
									></input>
								</div>
							</div>
							<div className="row my-3">
								<div className="col-12">
									<textarea
										id="inputName"
										placeholder="Details"
										name="employeeDetails"
										type="text"
										className="form-control"
										value={employee.details}
										onChange={(e) => setEmployee({ ...employee, details: e.currentTarget.value })}
									></textarea>
								</div>
							</div>
							<div className="row my-3">
								<div className="col text-center">
									{isUpdate ? (
										<label htmlFor="inputStatus">
											Latest:
											{employee && employee.periods.length > 0
												? employee.periods[employee.periods.length - 1]?.status
												: null}
										</label>
									) : null}
									<input
										id="inputStatus"
										placeholder="Status"
										name="employeeStatus"
										type="text"
										className="form-control"
										value={employee.status}
										onChange={(e) => setEmployee({ ...employee, status: e.currentTarget.value })}
									></input>
								</div>

								<div className="col text-center">
									{isUpdate ? (
										<label htmlFor="inputPosition">
											Latest:
											{employee && employee.periods.length > 0
												? employee.periods[employee.periods.length - 1]?.position
												: null}
										</label>
									) : null}
									<input
										id="inputPosition"
										placeholder="Position"
										name="employeePosition"
										type="text"
										className="form-control"
										value={employee.employeePosition}
										onChange={(e) => setEmployee({ ...employee, employeePosition: e.currentTarget.value })}
									></input>
								</div>
							</div>
							{!isUpdate && (
								<div className="row my-3">
									<div className="col">
										<label htmlFor="employmentFrom">Starts at</label>
										<input
											id="employmentFrom"
											name="employmentFrom"
											type="date"
											className="form-control"
											value={employee.from}
											onChange={(e) => {
												setEmployee({ ...employee, from: e.currentTarget.value });
											}}
										></input>
									</div>
									<div className="col">
										<label htmlFor="employmentFrom">Ends at</label>
										<input
											id="inputDate"
											name="employmentFrom"
											type="date"
											className="form-control"
											value={employee.to}
											onChange={(e) => setEmployee({ ...employee, to: e.currentTarget.value })}
										></input>
									</div>
								</div>
							)}

							<div className="row my-3">
								{!isUpdate && (
									<div className="col">
										<input
											id="file"
											name="file"
											type="file"
											className="form-control"
											multiple
											onChange={(e) => setEmployee({ ...employee, file: e.currentTarget.files })}
										></input>
									</div>
								)}
								<div className="col">
									<input
										id="employeeIsInHouse"
										name="employeeIsInHouse"
										type="checkbox"
										className="mx-2"
										label="is this employee staying in one of the appartments owned by mint?"
										aria-label="Checkbox that indicates that this employee is staying in house"
										onChange={(e) => setEmployee({ ...employee, isInHouse: e.currentTarget.checked })}
									></input>
									<label htmlFor="employeeIsInHouse">Is in house?</label>
								</div>
							</div>
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-secondary" data-dismiss="modal">
								Close
							</button>
							<button type="submit" className="btn btn-primary" onClick={() => handleCloseModal("employeeModal")}>
								{isUpdate ? "Update" : "Add"}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export const AddPeriodModal = ({ AddPeriodToEmployee, period, setPeriod }) => {
	return (
		<div
			className="modal fade"
			id="addPeriodModal"
			tabindex="-1"
			role="dialog"
			aria-labelledby="addPeriodModalLabel"
			aria-hidden="true"
		>
			<div className="modal-dialog" role="document">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title" id="addPeriodModalLabel">
							New Period
						</h5>
						<button type="button" className="close black" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<form onSubmit={(e) => AddPeriodToEmployee(period, e)} encType="multipart/form-data">
						<div className="modal-body">
							<div className="row my-3">
								<div className="col">
									<input
										id="inputName"
										placeholder="Status"
										name="periodStatus"
										type="text"
										className="form-control"
										value={period.status}
										onChange={(e) => setPeriod({ ...period, status: e.currentTarget.value })}
									></input>
								</div>
								<div className="col">
									<input
										id="inputName"
										placeholder="Position"
										name="periodPosition"
										type="text"
										className="form-control"
										value={period.position}
										onChange={(e) => setPeriod({ ...period, position: e.currentTarget.value })}
									></input>
								</div>
							</div>
							<div className="row my-3">
								<div className="col">
									<textarea
										id="inputName"
										placeholder="Details"
										name="period_details"
										type="text"
										className="form-control"
										value={period.period_details}
										onChange={(e) => setPeriod({ ...period, period_details: e.currentTarget.value })}
									></textarea>
								</div>
							</div>
							<div className="row my-3">
								<div className="col">
									<label htmlFor="employmentFrom">Starts at</label>
									<input
										id="employmentFrom"
										name="employmentFrom"
										type="date"
										className="form-control"
										value={period.from}
										onChange={(e) => {
											setPeriod({ ...period, from: e.currentTarget.value });
										}}
									></input>
								</div>
								<div className="col">
									<label htmlFor="employmentFrom">Ends at</label>
									<input
										id="inputDate"
										name="employmentFrom"
										type="date"
										className="form-control"
										value={period.to}
										onChange={(e) => setPeriod({ ...period, to: e.currentTarget.value })}
									></input>
								</div>
							</div>
							<div className="row">
								<div className="col">
									<input
										id="file"
										name="file"
										type="file"
										className="form-control"
										multiple
										onChange={(e) => setPeriod({ ...period, file: e.currentTarget.files })}
									></input>
								</div>
								<div className="col">
									<input
										id="employeeIsInHouse"
										name="employeeIsInHouse"
										type="checkbox"
										className="mx-2"
										label="is this employee staying in one of the appartments owned by mint?"
										aria-label="Checkbox that indicates that this employee is staying in house"
										onChange={(e) => setPeriod({ ...period, isInHouse: e.currentTarget.checked })}
									></input>
									<label htmlFor="employeeIsInHouse">Is in house?</label>
								</div>
							</div>
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-secondary" data-dismiss="modal">
								Close
							</button>
							<button type="submit" className="btn btn-primary" onClick={() => handleCloseModal("addPeriodModal")}>
								Add
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export const DocumentsModal = ({ modalAssets, setModalAssets, employee }) => {
	if (modalAssets.length) {
		return (
			<div
				class="modal fade"
				id="assetsModal"
				tabindex="-1"
				role="dialog"
				aria-labelledby="assetsModalLabel"
				aria-hidden="true"
			>
				<div class="modal-dialog" role="document">
					<div class="modal-content">
						<div class="modal-header">
							<h5 class="modal-title" id="assetsModalLabel">
								{employee?.name}'s Documents
							</h5>
							<button
								type="button"
								class="close black"
								data-dismiss="modal"
								aria-label="Close"
								onClick={() => setModalAssets([])}
							>
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div class="modal-body">
							{modalAssets &&
								modalAssets.length &&
								modalAssets.map(
									(asset) =>
										asset?.path?.split("/uploads")[1] && (
											<img
												src={process.env.PUBLIC_URL + "/uploads" + asset.path?.split("/uploads")[1]?.toLowerCase()}
												className="img-fluid"
												alt={asset.file_name}
											></img>
										)
								)}
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-secondary" data-dismiss="modal" onClick={() => setModalAssets([])}>
								Close
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	} else {
		return null;
	}
};

export const SubmitWharehouseItemModal = ({
	setWharehouse,
	submitFunction,
	wharehouseItem,
	modalTitle,
	allCustomers,
}) => {
	const [chosenCustomer, setChosenCustomer] = useState({});
	const ChooseCustomer = (e) => {
		allCustomers.forEach((customer) => {
			if (e.target.value.toLowerCase() === customer.name.toLowerCase()) {
				setChosenCustomer(customer);
				setWharehouse({ ...wharehouseItem, customer_id: customer.id });
			}
		});
	};

	return (
		<div
			className="modal fade"
			id="wharehouseTransactionModal"
			tabindex="-1"
			role="dialog"
			aria-labelledby="wharehouseTransactionModalLabel"
			aria-hidden="true"
		>
			<div className="modal-dialog" role="document">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title" id="wharehouseTransactionModalLabel">
							{modalTitle}
						</h5>
						<button type="button" className="close black" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							submitFunction(wharehouseItem, e);
						}}
						encType="multipart/form-data"
					>
						<div className="modal-body">
							<div className="row my-3">
								<div className="col">
									<input
										id="inputName"
										placeholder="Amount to be withdrawn"
										name="amount"
										type="text"
										className="form-control"
										value={wharehouseItem.quantity_taken}
										onChange={(e) => setWharehouse({ ...wharehouseItem, quantity_taken: e.currentTarget.value })}
									></input>
								</div>
								<div className="col">
									<input
										id="inputName"
										list="customers"
										placeholder="Choose a customer"
										name="customerName"
										type="text"
										className="form-control"
										defaultValue={chosenCustomer.name}
										onChange={ChooseCustomer}
									></input>
									<datalist id="customers" name="customers" className="">
										{allCustomers.map((customer, index) => {
											return <option key={index} value={customer.name}></option>;
										})}
									</datalist>
								</div>
							</div>
							<div className="row">
								<div className="col">
									<textarea
										id="inputName"
										placeholder="Comment"
										name="comment"
										type="text"
										className="form-control"
										value={wharehouseItem.comment}
										onChange={(e) => setWharehouse({ ...wharehouseItem, comment: e.currentTarget.value })}
									></textarea>
								</div>
							</div>
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-secondary" data-dismiss="modal">
								Close
							</button>
							<button
								type="submit"
								className="btn btn-primary"
								onClick={() => handleCloseModal("wharehouseTransactionModal")}
							>
								Add
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};
