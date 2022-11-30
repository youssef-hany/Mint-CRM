import React from "react";
import TimePicker from "react-time-picker";
import DatePicker from "react-datepicker";

export default function NewOrders(props) {
	var size = "";
	if (props.inputLocation) {
		props.customerLocations.map((location, index) => {
			if (props.inputLocation === location.location) {
				size = location.size;
			}
		});
	}

	return (
		<div>
			<form className="container mt-5" onSubmit={props.AddOrder}>
				<div>
					<label htmlFor="inputName">Name</label>
					<div className="mx-auto m-2 inputField ">
						{props.orderCustomer && props.orderCustomer.id ? <p className="m-2">{props.orderCustomer?.id}</p> : null}
						<input
							id="inputName"
							list="customers"
							placeholder="Name"
							name="name"
							type="text"
							className="form-control "
							value={props.name}
							onChange={props.onChange}
						></input>
						<datalist id="customers" name="customers" className="">
							{props.allCustomers.map((customer, index) => {
								return <option key={index} value={customer.name}></option>;
							})}
						</datalist>
					</div>

					<label htmlFor="inputPhone">Phone</label>
					<input
						id="inputPhone"
						name="phone"
						type="number"
						className="form-control mx-auto m-2 inputField"
						defaultValue={props.orderCustomer.phone}
						disabled
					></input>

					<label htmlFor="inputDate">Date</label>
					{/* <div className="form-control mx-auto m-2 inputField ">
						<DatePicker
							className="inputDate text-center"
							selected={props.date}
							onChange={(date) => props.onChange(date, "date")}
							showTimeSelect
							dateFormat="dd-MM-yyyy"
							placeholderText="dd-mm-yyyy"
						/>
					</div> */}
					<input
						id="inputDate"
						name="date"
						type="date"
						className="form-control mx-auto m-2 inputField"
						value={props.date}
						onChange={props.onChange}
					></input>
					<div>
						<label htmlFor="inputLoc">Location</label>
						<input
							id="inputLoc"
							name="inputLocation"
							list="location"
							type="text"
							className="form-control mx-auto m-2 inputField"
							value={props.inputLocation}
							onChange={props.onChange}
						></input>
						<p className="Lightgreen">{size ? size + " Meters" : ""} </p>
						<datalist id="location" name="location">
							{props.customerLocations.map((location, index) => {
								if (props.orderCustomer.id === location.customer_id) {
									return <option key={index} value={location.location}></option>;
								}
							})}
						</datalist>
						<label htmlFor="inputSize">Size</label>
						<input
							id="inputSize"
							name="inputSize"
							type="number"
							className="form-control mx-auto m-2 inputField"
							value={props.inputSize}
							onChange={props.onChange}
						></input>
						<label htmlFor="inputPrice">Price</label>
						<input
							id="inputPrice"
							name="inputPrice"
							type="number"
							className="form-control mx-auto m-2 inputField"
							value={props.inputPrice}
							onChange={props.onChange}
						></input>

						<div>
							<label htmlFor="startTime">Start Time</label>
						</div>
						<TimePicker id="startTime" name="startTime" onChange={props.setstartTime} value={props.startTime} />
					</div>
					<div className="mt-2">
						<div>
							<label htmlFor="endTime">End Time</label>
						</div>

						<TimePicker id="endTime" name="endTime" onChange={props.setendTime} value={props.endTime} />
					</div>
					<div className="mt-3">
						<label htmlFor="inputWorkers">Workers</label>
						<input
							id="inputWorkers"
							name="inputWorkers"
							type="number"
							className="form-control mx-auto m-2 inputField inputWorkers"
							value={props.inputWorkers}
							onChange={props.onChange}
						></input>
					</div>

					<button type="submit" className="btn btn-primary m-4">
						submit
					</button>
				</div>
			</form>
		</div>
	);
}
