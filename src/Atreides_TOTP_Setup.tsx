import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import useStyles from './useStyles';
import { useTheme, Theme } from '@material-ui/core/styles';
import { Auth } from 'aws-amplify';
import QRCode from 'qrcode.react';
import Snackbar from '@material-ui/core/Snackbar';
import MySnackbarContentWrapper from './mySnackbarContentWrapper';

export default function AtreidesTOTPSetup(props: { signInStatus: (stage: string) => void; user: any }): JSX.Element {
    const theme = useTheme<Theme>();
    const classes = useStyles(theme);
    const [qrCode, setQrCode] = useState('');
    const [totpCode, setTOTPCode] = useState('');
    const [error, setError] = useState<boolean>(false);

    const generateQRCode = (): void => {
        const username = props.user.username;
        Auth.setupTOTP(props.user).then(code => {
            const generatedQrCode = 'otpauth://totp/AWSCognito:' + username + '?secret=' + code + '&issuer=Atreides';
            setQrCode(generatedQrCode);
        });
    };
    const setTOTPInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setTOTPCode(event.target.value);
    };

    const verifyTOTPCode = (): void => {
        Auth.verifyTotpToken(props.user, totpCode)
            .then(() => {
                Auth.setPreferredMFA(props.user, 'TOTP').then(() => {
                    props.signInStatus('SignedIn');
                    Auth.enableSMS(props.user);
                });
            })
            .catch(() => setError(true));
    };

    const handleClose = (event: any, reason: any): void => {
        if (reason === 'clickaway') {
            return;
        }
        setError(false);
    };

    useEffect(() => {
        generateQRCode();
    }, []);

    return (
        <div>
            <Typography component="h1" variant="h5" align="center" color="primary">
                Please scan this QR Code with your authentication app of choice
            </Typography>
            <form className={classes.muiform} noValidate>
                <QRCode value={qrCode} />
                <TextField
                    style={{ backgroundColor: 'white' }}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="TOTP Code"
                    type="TOTP Code"
                    id="TOTP Code"
                    label="TOTP Code"
                    autoComplete="TOTP Code"
                    onChange={setTOTPInput}
                />
                <Button variant="contained" color="primary" className={classes.muisubmit} onClick={verifyTOTPCode}>
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
