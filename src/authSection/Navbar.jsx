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
        <i className="fas fa-graduation-cap" id="logo"></i>Edu <span>App</span>
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="nav ml-auto d-block d-md-flex">
          <Link to="/questions" className="nav-link py-1">
            Public QnA
          </Link>
          <Link to="/articles" className="nav-link py-1">
            Public Articles
          </Link>
          <button
            onClick={handleSignOutButton}
            className="btn btn-md btn-outline-danger py-1 mr-2"
          >
            Logout
          </button>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
