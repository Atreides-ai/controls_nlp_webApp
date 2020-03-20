import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import useStyles from './useStyles';
import { useTheme, Theme } from '@material-ui/core/styles';
import { Auth } from 'aws-amplify';
import Snackbar from '@material-ui/core/Snackbar';
import MySnackbarContentWrapper from './mySnackbarContentWrapper';

export default function AtreidesForgotPassword(props: { signInStatus: (stage: string) => void }): JSX.Element {
    const theme = useTheme<Theme>();
    const classes = useStyles(theme);
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [pwResetCode, setPWResetCode] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [error, setError] = useState<boolean>(false);
    const [errorOpen, setErrorOpen] = useState<boolean>(false);

    const handlePassword = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setPassword(event.target.value);
    };

    const handleConfirmPassword = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setConfirmPassword(event.target.value);
    };

    const handleResetCode = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setPWResetCode(event.target.value);
    };

    const setEmailInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setEmail(event.target.value);
    };

    const submitPassword = (): void => {
        if (password !== confirmPassword) {
            setErrorOpen(true);
            setError(true);
        } else {
            Auth.forgotPasswordSubmit(email, pwResetCode, password).then(() => props.signInStatus('SignedOut'));
        }
    };

    const handleClose = (event: any, reason: any): void => {
        if (reason === 'clickaway') {
            return;
        }
        setErrorOpen(false);
        setError(false);
    };

    return (
        <div>
            <Typography component="h1" variant="h5" align="center" color="primary">
                Reset Your Password
            </Typography>
            <form className={classes.muiform} noValidate>
                <TextField
                    style={{ backgroundColor: 'white' }}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="Email"
                    name="Email"
                    autoComplete="Email"
                    label="Email Address"
                    onChange={setEmailInput}
                />
                <TextField
                    style={{ backgroundColor: 'white' }}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="New Password"
                    name="New Password"
                    autoComplete="New Password"
                    label="New Password"
                    onChange={handlePassword}
                />
                <TextField
                    style={{ backgroundColor: 'white' }}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="Confirm Password"
                    name="Confirm Password"
                    autoComplete="Confirm Password"
                    label="Confirm Password"
                    onChange={handleConfirmPassword}
                />
                <TextField
                    style={{ backgroundColor: 'white' }}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="Reset Code"
                    name="Reset Code"
                    autoComplete="Reset Code"
                    label="Reset Code"
                    onChange={handleResetCode}
                />
                <Button variant="contained" color="primary" className={classes.muisubmit} onClick={submitPassword}>
                    Submit
                </Button>
            </form>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={error && errorOpen}
                autoHideDuration={6000}
                onClose={handleClose}
            >
                <MySnackbarContentWrapper variant="error" message="Password doesn't match" />
            </Snackbar>
        </div>
    );
}
