import React from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { SignIn } from "aws-amplify-react";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./theme.js";
import Container from "@material-ui/core/Container";
import useStyles from "./useStyles.js";

const classes = useStyles;

export default class CustomSignIn extends SignIn {
  constructor(props) {
    super(props);
    this._validAuthStates = ["signIn", "signedOut", "signedUp"];
  }

  showComponent() {
    return (
      <div
        styles={{
          backgroundImage: "url(https://source.unsplash.com/8WFnEehJWso)"
        }}
      >
        <ThemeProvider theme={theme}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.login}>
              <Typography component="h1" variant="h5">
                Sign In
              </Typography>
              <div className={classes.form}>
                <form className={classes.form} noValidate>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Email Address"
                    name="username"
                    autoComplete="Email Address"
                    onChange={this.handleInputChange}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    onChange={this.handleInputChange}
                  />
                  <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={() => super.signIn()}
                  >
                    Sign In
                  </Button>
                  <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    color="dark"
                    className={classes.submit}
                    onClick={() => super.changeState("forgotPassword")}
                  >
                    Forgot Password?
                  </Button>
                </form>
              </div>
            </div>
          </Container>
        </ThemeProvider>
      </div>
    );
  }
}
