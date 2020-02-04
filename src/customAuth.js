import React from "react";
import {
  Authenticator,
  SignIn,
  ConfirmSignIn,
  ForgotPassword,
  RequireNewPassword,
  TOTPSetup
} from "aws-amplify-react";

export default function CustomAuth() {
  return (
    <Authenticator
      onStateChange={authState => {
        if (authState == "signedIn") {
          window.location.reload();
        }
      }}
    >
      <SignIn />,
      <ConfirmSignIn />,
      <ForgotPassword />,
      <RequireNewPassword />,
      <TOTPSetup />
    </Authenticator>
  );
}
