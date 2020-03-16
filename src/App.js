import React, { useState } from "react";
import "./App.css";
import SubmitFile from "./submit_file.js";
import Dashboard from "./dashboard.js";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from "./private_route.js";
import Amplify from "aws-amplify";
import awsmobile from "./aws-exports";
import AuthComponent from "./authComponent";
import { ThemeProvider} from "@material-ui/core/styles";
import theme from "./theme";
import CssBaseline from "@material-ui/core/CssBaseline";

Amplify.configure(awsmobile);

export default function App() {
  const [authState, setState] = useState(false);
  console.log("main: " + authState);
  const callbackState = authStateData => {
    setState(authStateData);
  };
  return (
    <ThemeProvider theme={theme}>
    <Router>
      <Switch>
        <PrivateRoute path="/dashboard" authState={authState}>
            <CssBaseline />
            <Dashboard />
        </PrivateRoute>
        <PrivateRoute path="/submitFile" authState={authState}>
            <CssBaseline />
            <SubmitFile />
        </PrivateRoute>
        <Route path="/">
          <AuthComponent appCallback={callbackState} />
        </Route>
      </Switch>
    </Router>
    </ThemeProvider>
  );
}
