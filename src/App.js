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
import AppLayout from './AppLayout';
import HomeIcon from '@material-ui/icons/Home';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import FolderSharedIcon from '@material-ui/icons/FolderShared';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

Amplify.configure(awsmobile);

export default function App() {
    const [authState, setState] = useState(false);
    const [jobId, setJobId] = useState(false);
    const [token, setToken] = useState(false);
    const [apiKey, setApiKey] = useState(false);

    const listItems = ['Home', 'Dashboard', 'Company Controls', 'Upload'];
    // eslint-disable-next-line react/jsx-key
    const listIcons = [<HomeIcon />, <DonutLargeIcon />, <FolderSharedIcon />, <CloudUploadIcon />];
    const linkList = ['/home', '/dashboard', '/comp-controls', '/upload'];

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
                        <AppLayout
                            pageTitle="File Submission"
                            listItems={listItems}
                            listIcons={listIcons}
                            linkList={linkList}
                            coreElement={<SubmitFile dbCallback={jobCallback} />}
                        />
                    </PrivateRoute>
                    <Route path="/">
                        <AuthComponent appCallback={authCallbackState} /> */
                    </Route>
                </Switch>
            </Router>
        </ThemeProvider>
    );
}
