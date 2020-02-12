import React, { useState, useEffect } from "react";
import "./App.css";
import SubmitFile from "./submit_file.js";
import Dashboard from "./dashboard.js";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import Amplify from "aws-amplify";
import awsmobile from "./aws-exports";
import {
  RequireNewPassword,
  ConfirmSignIn,
  ForgotPassword,
  TOTPSetup,
  Authenticator,
  VerifyContact,
  Greetings
} from "aws-amplify-react";
import CustomSignIn from "./customSignIn.js";
import Box from "@material-ui/core/Box";

Amplify.configure(awsmobile);

const PrivateRoute = ({
  authState: authState,
  component: Component,
  ...rest
}) => (
  <Route
    {...rest}
    render={props =>
      authState === true ? <Component {...props} /> : <Redirect to="/" />
    }
  />
);

function AuthComponent({ appCallback }) {
  const [authState, SetAuthState] = useState(false);

  const handleStateChange = state => {
    if (state === "signedIn") {
      appCallback(true);
      SetAuthState(true);
      console.log("signed in!");
    } else {
      console.log("you are not signed in!");
    }
  };

  return (
    <Box>
      {authState === true && <Redirect to="/submitFile" />}
      {authState === false && (
        <Authenticator
          authState="signIn"
          onStateChange={handleStateChange}
          hideDefault={true}
          amplifyConfig={awsmobile}
        >
          <CustomSignIn override={"SignIn"} />
          <ConfirmSignIn />
          <ForgotPassword />
          <RequireNewPassword />
          <TOTPSetup />
          <VerifyContact />
        </Authenticator>
      )}
    </Box>
  );
}

export default function App() {
  const [authState, setState] = useState(false);
  const callbackState = authStateData => {
    setState(authStateData);
  };
  return (
    <Router>
      <Switch>
        <PrivateRoute path="/dashboard" authState={authState}>
          <Dashboard />
        </PrivateRoute>
        <PrivateRoute path="/submitFile" authState={authState}>
          <SubmitFile />
        </PrivateRoute>
        <Route path="/">
          <AuthComponent appCallback={callbackState} />
        </Route>
      </Switch>
    </Router>
  );
}
