import React, { useState } from "react";
import {
  RequireNewPassword,
  ConfirmSignIn,
  ForgotPassword,
  TOTPSetup,
  Authenticator,
  VerifyContact
} from "aws-amplify-react";
import CustomSignIn from "./customSignIn.js";
import Box from "@material-ui/core/Box";
import { Redirect } from "react-router-dom";
import awsmobile from "./aws-exports";
import useStyles from "./useStyles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

export default function AuthComponent({ appCallback }) {
  const classes = useStyles();
  const [authState, SetAuthState] = useState(false);

  const handleStateChange = state => {
    if (state === "signedIn") {
      appCallback(true);
      SetAuthState(true);
    } else {
    }
  };

  return (
    <Box className={classes.loginImage}>
      {authState === true && <Redirect to="/submitFile" />}
      {authState === false && (
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
          style={{ minHeight: "100vh" }}
        >
          {" "}
          <Grid item xs={3}>
            <Paper elevation={3} className={classes.loginSurface}>
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
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
