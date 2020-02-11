import React, { Component } from "react";
import "./App.css";
import SubmitFile from "./submit_file";
import Dashboard from "./dashboard";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Amplify from "aws-amplify";
import awsmobile from "./aws-exports";
import AuthComponent from "./AuthComponent";

Amplify.configure(awsmobile);

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      authState === true ? <Component {...props} /> : <Redirect to="/" />
    }
  />
);

export default function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" render={AuthComponent} />
        <PrivateRoute exact path="/dashboard" render={Dashboard} />}
        <PrivateRoute exact path="/submitFile" render={SubmitFile} />}
      </Switch>
    </Router>
  );
}
