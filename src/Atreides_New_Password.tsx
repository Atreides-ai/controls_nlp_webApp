import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import useStyles from './useStyles';
import { useTheme, Theme } from '@material-ui/core/styles';
import { Auth } from 'aws-amplify';
import Snackbar from '@material-ui/core/Snackbar';
import MySnackbarContentWrapper from './mySnackbarContentWrapper';

export default function AtreidesNewPassword(props: { signInStatus: (stage: string) => void; user: any }): JSX.Element {
    const theme = useTheme<Theme>();
    const classes = useStyles(theme);
    const [preferredName, setPreferredName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<boolean>(false);
    const [policyErrorOpen, setPolicyErrorOpen] = useState<boolean>(false);

    /**
     * Listens to the input of preferred name field and stores it in state.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} event
     */
    const handlePreferredName = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setPreferredName(event.target.value);
    };

    /**
     * Listens to the input of the password field and stores it in state.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} event
     */
    const handlePassword = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setPassword(event.target.value);
    };

    /**
     * Listens to the input of the confirm password field and stores it in state.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} event
     */
    const handleConfirmPassword = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setConfirmPassword(event.target.value);
    };

    /**
     * Submits the new password to cognito via API and sets status to TOTPSetUp
     *
     */
    const submitPassword = (): void => {
        if (password !== confirmPassword) {
            setError(true);
        } else {
            Auth.completeNewPassword(props.user, password, { name: preferredName })
                .then(() => props.signInStatus('TOTPSetup'))
                .catch(() => setPolicyErrorOpen(true));
        }
    };

    /**
     * Closes the snackbar messages
     *
     * @param {*} event
     * @param {*} reason
     * @returns {void}
     */
    const handleClose = (event: any, reason: any): void => {
        if (reason === 'clickaway') {
            return;
        }
        setPolicyErrorOpen(false);
        setError(false);
    };

    return (
        <div>
            <Typography component="h1" variant="h5" align="center" color="primary">
                Set Your New Password
            </Typography>
            <form className={classes.muiform} noValidate>
                <TextField
                    style={{ backgroundColor: 'white' }}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="Name"
                    name="Name"
                    autoComplete="Name"
                    label="Preferred Name"
                    onChange={handlePreferredName}
                />
                <Typography variant="caption" display="block">
                    Your password must be at least 8 characters long and contain numbers, upper and lower case letters.
                </Typography>
                <TextField
                    style={{ backgroundColor: 'white' }}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    type="password"
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
                    type="password"
                    id="Confirm Password"
                    name="Confirm Password"
                    autoComplete="Confirm Password"
                    label="Confirm Password"
                    onChange={handleConfirmPassword}
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
                open={error}
                autoHideDuration={6000}
                onClose={handleClose}
            >
                <MySnackbarContentWrapper variant="error" message="Password doesn't match" />
            </Snackbar>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={policyErrorOpen}
                autoHideDuration={6000}
                onClose={handleClose}
            >
                <MySnackbarContentWrapper variant="error" message="Password does not comply with policy" />
            </Snackbar>
        </div>
    );
}
