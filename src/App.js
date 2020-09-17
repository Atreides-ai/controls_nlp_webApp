import React, { useState } from 'react';
import './App.css';
import SubmitFile from './Submit_File';
import Dashboard from './dashboard.js';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import PrivateRoute from './private_route.js';
import Amplify from 'aws-amplify';
import awsmobile from './aws-exports';
import AuthComponent from './Atreides_Auth_Wrapper';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './theme';
import CssBaseline from '@material-ui/core/CssBaseline';
import HomePage from './HomePage';

Amplify.configure(awsmobile);

export default function App() {
    const [authState, setState] = useState(false);
    const [jobId, setJobId] = useState(false);
    const [token, setToken] = useState(false);
    const [apiKey, setApiKey] = useState(false);

    const authCallbackState = authStateData => {
        setState(authStateData);
    };

    const jobCallback = (jobId_, token_, apiKey_) => {
        setJobId(jobId_);
        setToken(token_);
        setApiKey(apiKey_);
    };

    return (
        <ThemeProvider theme={theme}>
            <Router>
                <Switch>
                    <PrivateRoute path="/dashboard" authState={authState}>
                        <CssBaseline />
                        <Dashboard jobId={jobId} token={token} apiKey={apiKey} />
                    </PrivateRoute>
                    <PrivateRoute path="/submitFile" authState={authState}>
                        <CssBaseline />
                        <SubmitFile dbCallback={jobCallback} />
                    </PrivateRoute>
                    <Route path="/">
                        <HomePage></HomePage>
                        {/* <AuthComponent appCallback={authCallbackState} /> */}
                    </Route>
                </Switch>
            </Router>
        </ThemeProvider>
    );
}
