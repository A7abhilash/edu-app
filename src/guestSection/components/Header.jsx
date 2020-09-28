import React from "react";

function Header({ handleSignInButton }) {
  return (
    <div className="container mt-2 mt-md-5">
      <div className="row justify-content-between align-self-start">
        <div className="col-md-4 my-1">
          <h1 className="display-3 heading">
            Edu <span>App</span>
          </h1>
          <p className="about">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
            nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat
            volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation
            ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo
            consequat.
          </p>
          <button
            className="btn  btn-outline-primary"
            type="submit"
            onClick={handleSignInButton}
          >
            Login<i className="fab fa-google ml-1" id="google"></i>
          </button>
        </div>

        <div className="col-md-4 my-1 mobile">
          <h2>Download Our Application</h2>
          <p>
            Keep your goals in the track and access it whenever you need by
            downloading our App.
            <img
              src="https://tse4.mm.bing.net/th?id=OIP.mSVvaenISCqLjWB-II2_MgHaHa&pid=Api&P=0&w=300&h=300"
              style={{ width: "100%", height: "300px" }}
              alt="Mobile"
              className="img-fluid application"
            />
          </p>
          <button className="btn btn-outline-info">
            Download <i className="fas fa-download"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Header;
