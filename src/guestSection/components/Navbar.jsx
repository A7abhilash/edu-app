import React from "react";

function Navbar({ handleSignInButton }) {
  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark border-bottom border-warning">
      <a className="navbar-brand" id="app-name" href="#">
        <i className="fas fa-chalkboard-teacher" id="logo"></i> Edu
        <span>App</span>
      </a>
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
          <li className="nav-item py-1">
            <a className="nav-link" href="#">
              Home
            </a>
          </li>
          <li className="nav-item py-1">
            <a className="nav-link" href="#">
              About
            </a>
          </li>
          <li className="nav-item py-1">
            <a className="nav-link" href="#">
              Contact
            </a>
          </li>
          <li className="nav-item py-1">
            <button
              onClick={handleSignInButton}
              className="nav-link btn btn-sm btn-outline-primary"
              href="#"
            >
              Login<i className="fab fa-google ml-1" id="google"></i>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
