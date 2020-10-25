import React, { useEffect, useRef, useState } from "react";
import { saveUserProfileSettings } from "../../hooks/useUserDB";
import UserProfile from "../containers/UserProfile";

const firebase = require("firebase");

function MyProfile({ LOGGEDINUSER }) {
  const [userDetails, setUserDetails] = useState({});

  const settings_category_ref = useRef();
  const settings_about_ref = useRef();

  const handleSettingsFormSubmit = async (event) => {
    event.preventDefault();
    let details = {
      category: settings_category_ref.current.value,
      about: settings_about_ref.current.value,
    };
    const response = await saveUserProfileSettings(LOGGEDINUSER.UID, details);
    alert(response.message);
  };

  useEffect(() => {
    
      firebase
        .firestore()
        .collection("users")
        .doc(LOGGEDINUSER.UID)
        .onSnapshot((snapshot) => {
          setUserDetails(snapshot.data());
        });
    
  }, []);

  return (
    <React.Fragment>
      <div className="d-block d-md-flex align-items-start">
        <h2>My Profile</h2>
        <button
          data-toggle="modal"
          data-target="#modal-settings"
          className="btn btn-secondary btn-sm ml-auto mt-1"
        >
          <i className="fas fa-sliders-h"></i> Profile Settings
        </button>
      </div>

      <div className="text-warning pt-2 pt-md-4">
        {userDetails.email && <h5>Email: {userDetails.email}</h5>}
        {userDetails.about && <h5>About: {userDetails.about}</h5>}
        {userDetails.category && <h5>Category: {userDetails.category}</h5>}
      </div>
      {/* Modal for profile settings */}
      <div
        className="modal fade"
        id="modal-settings"
        tabIndex="-1"
        aria-hidden="true"
        data-backdrop="static"
        data-keyboard="false"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-dark text-white">
            <div className="modal-header align-items-center">
              <h4 className="modal-title text-warning" id="staticBackdropLabel">
                Profile Settings
              </h4>
              <button
                type="button"
                className="close text-white"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body text-left">
              <UserProfile user={LOGGEDINUSER} />
              <form onSubmit={handleSettingsFormSubmit}>
                <div className="form-group">
                  <label htmlFor="settings-category">
                    Enter your Category:
                  </label>
                  <input
                    type="text"
                    id="settings-category"
                    ref={settings_category_ref}
                    className="form-control"
                    placeholder="NEET, JEE, UPSC..."
                    defaultValue={LOGGEDINUSER.category}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="settings-about">About:</label>
                  <textarea
                    type="text"
                    id="settings-about"
                    ref={settings_about_ref}
                    className="form-control"
                    placeholder="Ex: I'm a student studying at..."
                    rows="2"
                    defaultValue={LOGGEDINUSER.about}
                  ></textarea>
                </div>
                <div className="form-group pt-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success float-right">
                    <strong>SAVE</strong>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default MyProfile;
