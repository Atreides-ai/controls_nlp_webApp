import React from "react";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { SignIn } from "aws-amplify-react";
import Grid from "@material-ui/core/Grid";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./theme.js";
import Container from "@material-ui/core/Container";
import useStyles from "./useStyles.js";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { Link as muiLink } from "@material-ui/core/Link";
import { Link } from "react-router-dom";

const classes = useStyles;

export default class CustomSignIn extends SignIn {
  constructor(props) {
    super(props);
    this._validAuthStates = ["signIn", "signedOut", "signedUp"];
  }

  loginAndShowHome() {
    super.signIn();
  }

  showComponent() {
    return (
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
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
                  onClick={() => this.loginAndShowHome()}
                >
                  Sign In
                </Button>
                <Grid container>
                  <Grid item xs>
                    <muiLink
                      className={classes.link}
                      href="#"
                      variant="body2"
                      onClick={() => super.changeState("forgotPassword")}
                    >
                      Forgot password?
                    </muiLink>
                  </Grid>
                </Grid>
              </form>
            </div>
          </div>
        </Container>
      </ThemeProvider>
    );
  }
}
