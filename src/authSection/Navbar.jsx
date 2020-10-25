import React from "react";
import { Link } from "react-router-dom";

function Navbar({ handleSignOutButton }) {
  return (
    <nav className="nav navbar-expand-md navbar-dark bg-dark border-bottom border-warning align-items-center">
      <Link
        to="/dashboard"
        className="nav-brand d-flex align-items-start p-2"
        id="app-name"
      >
        <i className="fas fa-graduation-cap fa-md" id="logo"></i>Edu{" "}
        <span>App</span>
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav ml-auto mr-md-2">
          <li className="nav-item">
            <Link to="/questions" className="nav-link py-1">
              Public QnA
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/articles" className="nav-link py-1">
              Public Articles
            </Link>
          </li>
          <li className="nav-item">
            <button
              onClick={handleSignOutButton}
              className="btn btn-md btn-outline-danger py-1 ml-3 mb-2 mb-md-0"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
