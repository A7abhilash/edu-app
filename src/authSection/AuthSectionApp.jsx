import React from "react";
import { Redirect, Route, Switch } from "react-router";
import { HashRouter as Router } from "react-router-dom";
import Navbar from "../authSection/Navbar";
import Dashboard from "./Dashboard";
import PublicQuestions from "./questions/PublicQuestions";
import PublicArticles from "./articles/PublicArticles";
import ProfileVisit from "./users/ProfileVisit";

function AuthSectionApp({ handleSignOutButton, LOGGEDINUSER }) {
  if (!LOGGEDINUSER) return "";

  return (
    <Router>
      <Navbar handleSignOutButton={handleSignOutButton} />
      <Switch>
        <Redirect exact from="/" to="/dashboard" />
        <Route
          exact
          path="/dashboard"
          render={(props) => (
            <Dashboard {...props} LOGGEDINUSER={LOGGEDINUSER} />
          )}
        />
        <Route
          exact
          path="/questions"
          render={() => <PublicQuestions LOGGEDINUSER={LOGGEDINUSER} />}
        />
        <Route
          exact
          path="/articles"
          render={() => <PublicArticles LOGGEDINUSER={LOGGEDINUSER} />}
        />
        <Route
          exact
          path="/users/:id"
          render={(props) => (
            <ProfileVisit {...props} LOGGEDINUSER={LOGGEDINUSER} />
          )}
        />
      </Switch>
    </Router>
  );
}

export default AuthSectionApp;
