import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import useStyles from './useStyles';
import Box from '@material-ui/core/Box';
import AtreidesSignIn from './Atreides_Sign_In';
import AtreidesMFA from './Atreides_Confirm_SignIn';
import AtreidesTOTPSetup from './Atreides_TOTP_Setup';
import AtreidesForgotPassword from './Atreides_Forgot_Password';
import AtreidesNewPassword from './Atreides_New_Password';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Avatar from '@material-ui/core/Avatar';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Copyright from './copyright';

export default function AuthComponent(props: { appCallback: any }): JSX.Element {
    const classes = useStyles();
    const [authStage, setAuthStage] = useState<string>('SignedOut');
    const [user, setUser] = useState();

    /**
     * Manages the authorisation state by passing it back to the App.TSX
     *
     * @param {string} stage
     */
    const manageAuthStage = (stage: string): void => {

        setAuthStage(stage);
        if (stage === 'SignedIn') {
            props.appCallback(true, user);
        }
    };

    /**
     * Callback function that is passed to AtreidesSignIn to get the user
     *
     * @param {*} user
     */
    const getUser = (user: any): void => {
        setUser(user);
    };

    return (
        <Container component="main" maxWidth="xs">
            {authStage === 'SignedIn' && <Redirect to="/submitFile" />}
            <CssBaseline />
            <div className={classes.loginSurface}>
                <Avatar className={classes.avatar} color="secondary">
                    <LockOutlinedIcon />
                </Avatar>
                {authStage === 'SignedOut' && <AtreidesSignIn signInStatus={manageAuthStage} user={getUser} />}
                {authStage === 'ConfirmSignIn' && <AtreidesMFA signInStatus={manageAuthStage} user={user} />}
                {authStage === 'TOTPSetup' && <AtreidesTOTPSetup signInStatus={manageAuthStage} user={user} />}
                {authStage === 'ForgotPassword' && <AtreidesForgotPassword signInStatus={manageAuthStage} />}
                {authStage === 'NewPassword' && <AtreidesNewPassword signInStatus={manageAuthStage} user={user} />}
            </div>
            <Box mt={8}>
                <Copyright />
            </Box>
        </Container>
    );
}
