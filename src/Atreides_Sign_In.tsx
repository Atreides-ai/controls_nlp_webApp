import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import useStyles from './useStyles';
import { useTheme, Theme } from '@material-ui/core/styles';
import { Auth } from 'aws-amplify';

export default function AtreidesSignIn(props: {
    signInStatus: (stage: string) => void;
    user: (user: any) => void;
}): JSX.Element {
    const theme = useTheme<Theme>();
    const classes = useStyles(theme);

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const setEmailInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setEmail(event.target.value);
    };

    const setPasswordInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setPassword(event.target.value);
    };

    const handleChallenge = (user: any): void => {
        try {
            if (user.challengeName === 'SOFTWARE_TOKEN_MFA') {
                props.user(user);
                props.signInStatus('confirmSignIn');
            } else if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
                props.user(user);
                props.signInStatus('requireNewPassword');
            } else if (user.challengeName === 'SMS_MFA' || user.challengeName === 'MFA_SETUP') {
                props.user(user);
                props.signInStatus('TOTPSetup');
            }
        } catch (err) {
            if (err.code === 'PasswordResetRequiredException') {
                props.user(user);
                props.signInStatus('forgotPassword');
            } else {
                console.log(err);
            }
        }
    };

    const signIn = (): void => {
        Auth.signIn(email, password).then(user => handleChallenge(user));
    };
    return (
        <Container component="main" maxWidth="xs">
            <div className={classes.login}>
                <Typography component="h1" variant="h5" align="center" color="primary">
                    Sign in to Atreides
                </Typography>
                <div className={classes.muiform}>
                    <form className={classes.muiform} noValidate>
                        <TextField
                            style={{ backgroundColor: 'white' }}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            name="username"
                            autoComplete="Email Address"
                            onChange={setEmailInput}
                        />
                        <TextField
                            style={{ backgroundColor: 'white' }}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={setPasswordInput}
                        />
                        <Button variant="contained" color="primary" className={classes.muisubmit} onClick={signIn}>
                            Sign In
                        </Button>
                        <Button variant="contained" className={classes.muisubmit}>
                            Forgot Password?
                        </Button>
                    </form>
                </div>
            </div>
        </Container>
    );
}
