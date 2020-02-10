import React, { useState }  from "react";
import {
  RequireNewPassword,
  ConfirmSignIn,
  ForgotPassword,
  TOTPSetup,
  Authenticator,
  VerifyContact
} from "aws-amplify-react";
import CustomSignIn from "./customSignIn.js";
import theme from "./theme.js";
import awsmobile from "./aws-exports";
import Box from "@material-ui/core/Box";

export default function AuthComponent() {
  const [authState, setState] = useState(false);
  const handleStateChange = state => {
    if (state === "signedIn") {
      setState(true);
    }
  };
  return (
    //   <Box styles={{backgroundImage="url(someImage)"}}>
    <Authenticator
      authState="signIn"
      onStateChange={handleStateChange}
      theme={theme}
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

    // TODO maybe move conditional render of the routes here?
    
  );
}
