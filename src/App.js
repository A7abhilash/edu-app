import React, { useEffect, useState } from "react";
import "./App.css";
import AuthSectionApp from "./authSection/AuthSectionApp";
import GuestSection from "./guestSection/GuestSection";
import { userSignIn, userSignOut } from "./hooks/useAuth";
import { getLoggedInUserInfo } from "./hooks/useUserDB";

const firebase = require("firebase");

function App() {
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState({
    isAuthenticated: false,
    LOGGEDINUSER: {},
  });

  const signIn = async (event) => {
    event.preventDefault();
    await userSignIn();
  };

  const signOut = async (event) => {
    event.preventDefault();
    await userSignOut();
  };

  useEffect(() => {
    if (window.navigator.onLine) {
      setLoading(true);
      try {
        firebase.auth().onAuthStateChanged(async (user) => {
          if (user) {
            let currentUser = await getLoggedInUserInfo(user.uid);
            setState({
              isAuthenticated: true,
              LOGGEDINUSER: currentUser,
            });
            setLoading(false);
          } else {
            setState({
              isAuthenticated: false,
              LOGGEDINUSER: {},
            });
            setLoading(false);
          }
        });
      } catch (error) {
        console.log(error);
        alert(error.message);
      }
    }
  }, []);

  return loading ? (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-warning" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  ) : state.isAuthenticated ? (
    <AuthSectionApp
      handleSignOutButton={signOut}
      LOGGEDINUSER={state.LOGGEDINUSER}
    />
  ) : (
    <GuestSection handleSignInButton={signIn} />
  );
}

export default App;
