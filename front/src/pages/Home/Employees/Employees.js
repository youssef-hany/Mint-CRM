import dateFormat from "dateformat";
import React, { useEffect, useState, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { SubmitEmployeeModal } from "../../../components/Modals/Modals";
import { PlusSVGIcon } from "../../../tools/utils/icons";
import "./Employees.css";

export default function Employees({ allEmployees, GetAllEmployees, AddEmployee, employee, setEmployee }) {
	const history = useHistory();
	const allEmployeesMemo = useMemo(() => (allEmployees && allEmployees.lengh > 0 ? allEmployees : []), [allEmployees]);
	const [employeesList, setEmployeesList] = useState(allEmployees);
	const [isFiltering, setIsFiltering] = useState(false);

	useEffect(() => {
		if (!employeesList.length && !allEmployees.length) {
			GetAllEmployees().then(() => {
				setEmployeesList(allEmployees);
			});
		} else if (allEmployees.length && !isFiltering) {
			setEmployeesList(allEmployees);
		}
	}, [employeesList.length, allEmployees.length, GetAllEmployees, isFiltering]);

	const filterEmployees = (e) => {
		const { value } = e.currentTarget;
		const filteredEmployees = allEmployees.filter((employeeItem) => {
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
		setEmployeesList(filteredEmployees);
	};
	const onEmployeeInputChange = (newEmployee) => {
		setEmployee(newEmployee);
	};
	return (
		<div className="mt-5">
			<SubmitEmployeeModal
				setEmployee={onEmployeeInputChange}
				employee={employee}
				submitFunction={AddEmployee}
				modalTitle={"New Employee"}
			/>
			<div className="d-flex justify-content-end">
				<input
					id="inputName"
					placeholder="Search for an employee"
					name="customerName"
					type="text"
					className="form-control mx-auto m-2 inputField"
					onChange={filterEmployees}
				></input>

				<div className="mx-auto my-auto">
					<span type="button" data-toggle="modal" data-target="#employeeModal">
						<PlusSVGIcon title="Add Employee" width={30} />
					</span>
				</div>
			</div>

			<table className="table table-dark mt-3 ">
				<thead>
					<tr>
						{employeesList && employeesList.length > 0
							? Object.keys(employeesList[0]).map((key, idx) => {
									if (
										key === "updated_at" ||
										key === "employee_id" ||
										key === "employment_period_id" ||
										key === "image"
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
						{employeesList && employeesList.length > 0 && <th scope="col">Latest Position</th>}
					</tr>
				</thead>
				<tbody>
					{employeesList && employeesList.length
						? employeesList.map((tableEmployee, idx) => {
								if (tableEmployee) {
									const lastPosition = tableEmployee.periods[tableEmployee.periods.length - 1]?.position;
									return (
										<tr
											role="button"
											key={idx}
											className="btn-dark"
											onClick={() => {
												history.push({
													pathname: "/employee/" + tableEmployee.id,
													state: tableEmployee,
												});
											}}
										>
											<td>{tableEmployee.id}</td>
											<td>{tableEmployee.name}</td>
											<td>{tableEmployee.phone}</td>
											<td>{tableEmployee.details}</td>
											<td>{dateFormat(tableEmployee.created_at.split("T")[0], "dd-mm-yyyy")}</td>
											<td>{tableEmployee.periods.length}</td>
											<td>{lastPosition}</td>
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
