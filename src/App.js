import React, { Component, useState } from "react";
import "./App.css";
import SubmitFile from "./submit_file";
import Dashboard from "./dashboard";
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
  VerifyContact
} from "aws-amplify-react";
import CustomSignIn from "./customSignIn.js";

Amplify.configure(awsmobile);

const PrivateRoute = ({authState, component: Component,  ...rest }) => (
  <Route
    {...rest}
    render={props =>
      authState === true ? <Component {...props} /> : <Redirect to="/" />
    }
  />
);

function AuthComponent({ appCallback }) {
  const [authState, setState] = useState(false);
  const handleStateChange = state => {
    if (state === "signedIn") {
      setState(true);
      appCallback(authState);
    }
  };
  return (
    //   <Box styles={{backgroundImage="url(someImage)"}}>
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
    //    </Box>
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
        <Route exact path="/">
          <AuthComponent appCallback={() => callbackState()} />
        </Route>
        <PrivateRoute
          exact
          path="/dashboard"
          render={Dashboard}
          authState={authState}
        />
        }
        <PrivateRoute
          exact
          path="/submitFile"
          render={SubmitFile}
          authState={authState}
        />
        }
      </Switch>
    </Router>
  );
}
