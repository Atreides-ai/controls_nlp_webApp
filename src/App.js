import React from "react";
import "./App.css";
import {
  SignIn,
  RequireNewPassword,
  ConfirmSignIn,
  ForgotPassword,
  TOTPSetup,
  withAuthenticator
} from "aws-amplify-react";
import SubmitFile from "./submit_file";
import Dashboard from "./dashboard";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./theme.js";
import CssBaseline from "@material-ui/core/CssBaseline";
import Amplify from "aws-amplify";
import awsmobile from "./aws-exports";

Amplify.configure(awsmobile);

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/dashboard">
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Dashboard />
          </ThemeProvider>
        </Route>
        <Route path="/">
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <SubmitFile />
          </ThemeProvider>
        </Route>
      </Switch>
    </Router>
  );
}

export default withAuthenticator(App, true, [
  <SignIn />,
  <ConfirmSignIn />,
  <ForgotPassword />,
  <RequireNewPassword />,
  <TOTPSetup />
]);
