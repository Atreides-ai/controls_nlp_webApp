import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import useStyles from './useStyles';
import { useTheme, Theme } from '@material-ui/core/styles';
import { Auth } from 'aws-amplify';
import Snackbar from '@material-ui/core/Snackbar';
import MySnackbarContentWrapper from './mySnackbarContentWrapper';

export default function AtreidesMFA(props: { signInStatus: (stage: string) => void; user: any }): JSX.Element {
    const theme = useTheme<Theme>();
    const classes = useStyles(theme);
    const [code, setCode] = useState<string>('');
    const [error, setError] = useState<boolean>(false);

    const handleCode = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setCode(event.target.value);
    };

    const submitCode = (): void => {
        Auth.confirmSignIn(props.user, code, 'SOFTWARE_TOKEN_MFA')
            .then(user => console.log(user))
            .then(() => props.signInStatus('SignedIn'))
            .catch(() => setError(true));
    };

    const handleClose = (event: any, reason: any): void => {
        if (reason === 'clickaway') {
            return;
        }
        setError(false);
    };

    return (
        <div>
            <Typography component="h1" variant="h5" align="center" color="primary">
                Enter Your Code
            </Typography>
            <form className={classes.muiform} noValidate>
                <TextField
                    style={{ backgroundColor: 'white' }}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="code"
                    name="code"
                    type="password"
                    autoComplete="TOTP Code"
                    label="TOTP Code"
                    onChange={handleCode}
                />
                <Button variant="contained" color="primary" className={classes.muisubmit} onClick={submitCode}>
                    Submit Code
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
                <MySnackbarContentWrapper variant="error" message="Incorrect Code" />
            </Snackbar>
        </div>
    );
}
