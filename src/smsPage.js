import React from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { ConfirmSignIn } from "aws-amplify-react";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./theme.js";
import Container from "@material-ui/core/Container";
import useStyles from "./useStyles";

export default class SMSSignIn extends ConfirmSignIn {
  constructor(props) {
    super(props);
    this._validAuthStates = ["confirmSignIn"];
  }

  showComponent() {
    return (
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.login}>
            <Typography
              component="h1"
              variant="h5"
              align="center"
              color="primary"
            >
              Sign in to Atreides
            </Typography>
            <div className={classes.muiform}>
              <form className={classes.muiform} noValidate>
                <TextField
                  style={{ backgroundColor: "white" }}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  name="username"
                  autoComplete="Email Address"
                  onChange={this.handleInputChange}
                />
                <TextField
                  style={{ backgroundColor: "white" }}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={this.handleInputChange}
                />{" "}
                <br></br>
                <br></br>
                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.muisubmit}
                  onClick={() => super.signIn()}
                >
                  Sign In
                </Button>
                <br></br>
                <br></br>
                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  color="dark"
                  className={classes.muisubmit}
                  onClick={() => super.changeState("forgotPassword")}
                >
                  Forgot Password?
                </Button>
              </form>
            </div>
          </div>
        </Container>
      </ThemeProvider>
    );
  }
}