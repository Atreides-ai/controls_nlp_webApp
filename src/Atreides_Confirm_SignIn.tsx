import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import useStyles from './useStyles';
import { useTheme, Theme } from '@material-ui/core/styles';
import { Auth } from 'aws-amplify';

export default function AtreidesMFA(props: { signInStatus: (stage: string) => void }): JSX.Element {
    const theme = useTheme<Theme>();
    const classes = useStyles(theme);
    const [code, setCode] = useState<string>('');

    const handleCode = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setCode(event.target.value);
    };

    const submitCode = (): void => {
        Auth.currentAuthenticatedUser().then(user =>
            Auth.confirmSignIn(user, code)
                .then(() => props.signInStatus('SignedIn'))
                .then(() => console.log(user)),
        );
    };

    return (
        <Container component="main" maxWidth="xs">
            <div className={classes.login}>
                <Typography component="h1" variant="h5" align="center" color="primary">
                    Enter Your Code
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
                            onChange={handleCode}
                        />
                        <Button variant="contained" color="primary" className={classes.muisubmit} onClick={submitCode}>
                            Submit Code
                        </Button>
                    </form>
                </div>
            </div>
        </Container>
    );
}
