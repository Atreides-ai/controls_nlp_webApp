import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import { Redirect } from 'react-router-dom';
import useStyles from './useStyles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import AtreidesSignIn from 'Atreides_Sign_In';

export default function AuthComponent(appCallback: any): JSX.Element {
    const classes = useStyles();
    const [authStage, setAuthStage] = useState<string>('');
    const [authState, SetAuthState] = useState(false);

    const handleStateChange = (state: string): void => {
        if (state === 'signedIn') {
            appCallback(true);
            SetAuthState(true);
        } else {
        }
    };

    return (
        <Box className={classes.loginImage}>
            {authState === true && <Redirect to="/submitFile" />}
            {authState === false && (
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
                            <AtreidesSignIn></AtreidesSignIn>
                            {/* <AtreidesMFA></AtreidesMFA>
              <AtreidesMFASetUp></AtreidesMFASetUp>
              <AtreidesForgotPassword></AtreidesForgotPassword>
              <AtreidesReqNewPassword></AtreidesReqNewPassword> */}
                        </Paper>
                    </Grid>
                </Grid>
            )}
        </Box>
    );
}
