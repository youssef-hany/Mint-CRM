import "react-app-polyfill/ie9";
import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import "raf/polyfill";
import "core-js/stable";
import "core-js/es/map";
import "core-js/es/set";
import "regenerator-runtime/runtime";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { HashRouter as Router } from "react-router-dom";
const app = (
	<Router>
		<App />
	</Router>
);
ReactDOM.render(app, document.getElementById("root"));
