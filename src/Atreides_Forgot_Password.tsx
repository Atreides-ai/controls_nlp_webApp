import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import useStyles from './useStyles';
import { useTheme, Theme } from '@material-ui/core/styles';
import { Auth } from 'aws-amplify';

export default function AtreidesForgotPassword(props: { signInStatus: (stage: string) => void }): JSX.Element {
    const theme = useTheme<Theme>();
    const classes = useStyles(theme);
    const [password, setPassword] = useState<string>('');
    const [pwResetCode, setPWResetCode] = useState<string>('');
    const [email, setEmail] = useState<string>('');

    const handlePassword = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setPassword(event.target.value);
    };

    const handleResetCode = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setPWResetCode(event.target.value);
    };

    const setEmailInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setEmail(event.target.value);
    };

    const submitPassword = (): void => {
        Auth.forgotPasswordSubmit(email, pwResetCode, password).then(() => props.signInStatus('SignedOut'));
    };

    return (
        <Container component="main" maxWidth="xs">
            <div className={classes.login}>
                <Typography component="h1" variant="h5" align="center" color="primary">
                    Reset Your Password
                </Typography>
                <div className={classes.muiform}>
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
                            onChange={handlePassword}
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
                            onChange={handleResetCode}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.muisubmit}
                            onClick={submitPassword}
                        >
                            Submit
                        </Button>
                    </form>
                </div>
            </div>
        </Container>
    );
}
