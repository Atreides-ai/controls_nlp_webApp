import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import { Redirect } from 'react-router-dom';
import useStyles from './useStyles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import AtreidesSignIn from './Atreides_Sign_In';
import AtreidesMFA from './Atreides_Confirm_SignIn';

export default function AuthComponent(appCallback: any): JSX.Element {
    const classes = useStyles();
    const [authStage, setAuthStage] = useState<string>('SignedOut');

    const manageAuthStage = (stage: string): void => {
        setAuthStage(stage);
        if (authStage === 'SignedIn') {
            appCallback(true);
        }
    };
    return (
        <Box className={classes.loginImage}>
            {authStage === 'SignedIn' && <Redirect to="/submitFile" />}
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
                style={{ minHeight: '100vh' }}
            >
                <Grid item xs={3}>
                    <Paper elevation={3} className={classes.loginSurface}>
                        {authStage === 'SignedOut' && <AtreidesSignIn signInStatus={manageAuthStage} />}
                        {authStage === 'ConfirmSignIn' && <AtreidesMFA signInStatus={manageAuthStage} />}
                        {/* {authStage === 'SetUpMFA' && <AtreidesMFASetUp signInStatus={manageAuthStage} />}
                        {authStage === 'ForgotPassword' && <AtreidesForgotPassword signInStatus={manageAuthStage} />}
                        {authStage === 'NewPasswordReq' && <AtreidesReqNewPassword signInStatus={manageAuthStage} />} */}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
