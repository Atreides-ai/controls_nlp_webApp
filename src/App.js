import React, { useState } from "react";
import "./App.css";
import SubmitFile from "./submit_file.js";
import Dashboard from "./dashboard.js";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from "./private_route.js";
import Amplify from "aws-amplify";
import awsmobile from "./aws-exports";
import AuthComponent from "./authComponent";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./theme.js";
import CssBaseline from "@material-ui/core/CssBaseline";
import { authContext } from "./authContext.js";

Amplify.configure(awsmobile);

export default function App() {
  const [authState, setState] = useState(false);
  console.log("main: " + authState);
  const callbackState = authStateData => {
    setState(authStateData);
  };
  return (
    <Router>
      <Switch>
        <PrivateRoute path="/dashboard" authState={authState}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <authContext.Provider value={authState}>
              <Dashboard />
            </authContext.Provider>
          </ThemeProvider>
        </PrivateRoute>
        <PrivateRoute path="/submitFile" authState={authState}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <authContext.Provider value={authState}>
              <SubmitFile />
            </authContext.Provider>
          </ThemeProvider>
        </PrivateRoute>
        <Route path="/">
          <AuthComponent appCallback={callbackState} />
        </Route>
      </Switch>
    </Router>
  );
}
