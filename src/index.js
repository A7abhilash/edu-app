import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

const firebase = require("firebase");
// Your web app's Firebase configuration
const firebaseConfig = {};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
