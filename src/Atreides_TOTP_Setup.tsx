import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import useStyles from './useStyles';
import { useTheme, Theme } from '@material-ui/core/styles';
import { Auth } from 'aws-amplify';
import QRCode from 'qrcode.react';
import { isCompositeComponent } from 'react-dom/test-utils';

export default function AtreidesTOTPSetup(props: { signInStatus: (stage: string) => void; user: any }): JSX.Element {
    const theme = useTheme<Theme>();
    const classes = useStyles(theme);
    const [qrCode, setQrCode] = useState('');
    const [totpCode, setTOTPCode] = useState('');

    const generateQRCode = (): void => {
        console.log('generating QR Code');
        const username = props.user.username;
        console.log(username);
        Auth.setupTOTP(props.user).then(code => {
            console.log(code);
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
                Auth.setPreferredMFA(props.user, 'TOTP');
                props.signInStatus('SignedIn');
            })
            .catch(e => {
                // Token is not verified
            });
    };

    useEffect(() => {
        generateQRCode();
    }, []);

    return (
        <Container component="main" maxWidth="xs">
            <div className={classes.login}>
                <Typography component="h1" variant="h5" align="center" color="primary">
                    Please scan this QR Code with your authentication app of choice
                </Typography>
                <div className={classes.muiform}>
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
                            autoComplete="TOTP Code"
                            onChange={setTOTPInput}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.muisubmit}
                            onClick={verifyTOTPCode}
                        >
                            Submit Code
                        </Button>
                    </form>
                </div>
            </div>
        </Container>
    );
}
