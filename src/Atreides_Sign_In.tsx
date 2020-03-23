import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import useStyles from './useStyles';
import { useTheme, Theme } from '@material-ui/core/styles';
import { Auth } from 'aws-amplify';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Snackbar from '@material-ui/core/Snackbar';
import MySnackbarContentWrapper from './mySnackbarContentWrapper';

export default function AtreidesSignIn(props: {
    signInStatus: (stage: string) => void;
    user: (user: any) => void;
}): JSX.Element {
    const theme = useTheme<Theme>();
    const classes = useStyles(theme);

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [ForgotPasswordBool, ToggleForgotPassword] = useState(false);
    const [error, setError] = useState<boolean>(false);

    const setEmailInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setEmail(event.target.value);
    };

    const setPasswordInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setPassword(event.target.value);
    };

    const ForgotPassword = (): void => {
        ToggleForgotPassword(true);
    };

    const submitPasswordReset = (): void => {
        Auth.forgotPassword(email).then(() => props.signInStatus('ForgotPassword'));
    };

    const handleChallenge = (user: any): void => {
        try {
            if (user.challengeName === 'SOFTWARE_TOKEN_MFA') {
                props.user(user);
                props.signInStatus('ConfirmSignIn');
            } else if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
                props.user(user);
                props.signInStatus('NewPassword');
            } else if (
                user.challengeName === 'SMS_MFA' ||
                user.challengeName === 'MFA_SETUP' ||
                user.challengeName === undefined
            ) {
                props.user(user);
                props.signInStatus('TOTPSetup');
            }
        } catch (err) {
            if (err.code === 'PasswordResetRequiredException') {
                props.user(user);
                submitPasswordReset();
            } else {
                console.log(err);
            }
        }
    };

    const handleClose = (event: any, reason: any): void => {
        if (reason === 'clickaway') {
            return;
        }
        setError(false);
    };

    const signIn = (): void => {
        Auth.signIn(email, password)
            .then(user => handleChallenge(user))
            .catch(() => setError(true));
    };

    return (
        <div>
            <Typography component="h1" variant="h5" align="center" color="primary">
                Sign in to Atreides
            </Typography>
            <form className={classes.muiform} noValidate>
                <TextField
                    style={{ backgroundColor: 'white' }}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Email Address"
                    name="username"
                    autoComplete="Email Address"
                    onChange={setEmailInput}
                    autoFocus
                />
                {!ForgotPasswordBool && (
                    <TextField
                        style={{ backgroundColor: 'white' }}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        type="password"
                        id="password"
                        label="Password"
                        autoComplete="current-password"
                        onChange={setPasswordInput}
                    />
                )}
                {!ForgotPasswordBool && (
                    <Button variant="contained" color="primary" className={classes.muisubmit} onClick={signIn}>
                        Sign In
                    </Button>
                )}
                <Grid container>
                    {ForgotPasswordBool && (
                        <Grid item xs>
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.muisubmit}
                                onClick={submitPasswordReset}
                            >
                                Submit Password Reset
                            </Button>
                        </Grid>
                    )}
                    {!ForgotPasswordBool && (
                        <Grid item>
                            <Link variant="body2" className={classes.muisubmit} onClick={ForgotPassword}>
                                Forgot Password?
                            </Link>
                        </Grid>
                    )}
                </Grid>
            </form>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={error}
                autoHideDuration={6000}
                onClose={handleClose}
            >
                <MySnackbarContentWrapper variant="error" message="Incorrect username or password" />
            </Snackbar>
        </div>
    );
}
