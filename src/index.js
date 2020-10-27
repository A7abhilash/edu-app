import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

const firebase = require("firebase");
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtu9isDGLdJHR4ZaFIECgrsJaHytICOmk",
  authDomain: "edu-app-2711b.firebaseapp.com",
  databaseURL: "https://edu-app-2711b.firebaseio.com",
  projectId: "edu-app-2711b",
  storageBucket: "edu-app-2711b.appspot.com",
  messagingSenderId: "620327079262",
  appId: "1:620327079262:web:d4316d9aab9a50744513cf",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
