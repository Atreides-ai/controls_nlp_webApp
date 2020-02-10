import React from "react";
import "./App.css";
import SubmitFile from "./submit_file";
import Dashboard from "./dashboard";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Amplify from "aws-amplify";
import awsmobile from "./aws-exports";
import AuthComponent from "./AuthComponent";

Amplify.configure(awsmobile);

export default function App() {
  return;
  <AuthComponent>
    <Router>
      <Switch>
        <Route exact path="/dashboard" render={Dashboard} />}
        <Route exact path="/submitFile" render={SubmitFile} />}
      </Switch>
    </Router>
  </AuthComponent>;
}
