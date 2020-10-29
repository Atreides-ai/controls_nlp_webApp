import React, { useState } from 'react';
import './App.css';
import SubmitFile from './Submit_File';
import Dashboard from './Dashboard';
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
import FileBrowser from './FileBrowser';

Amplify.configure(awsmobile);

export default function App() {
    const [authState, setState] = useState(false);
    const [jobId, setJobId] = useState(false);
    const baseUrl = process.env.REACT_APP_ENDPOINT;

    const listItems = ['Home', 'Dashboard', 'Company Controls', 'Upload'];
    // eslint-disable-next-line react/jsx-key
    const listIcons = [<HomeIcon />, <DonutLargeIcon />, <FolderSharedIcon />, <CloudUploadIcon />];
    const linkList = ['/home', '/dashboard', '/comp-controls', '/upload'];

    const authCallbackState = authStateData => {
        setState(authStateData);
    };

    const jobCallback = jobId_ => {
        setJobId(jobId_);
    };

    return (
        <ThemeProvider theme={theme}>
            <Router>
                <Switch>
                    <PrivateRoute path="/dashboard" authState={authState}>
                        <CssBaseline />
                        <AppLayout
                            pageTitle="Controls Dashboard"
                            listItems={listItems}
                            listIcons={listIcons}
                            linkList={linkList}
                            coreElement={<Dashboard jobId={jobId} baseUrl={baseUrl} />}
                        />
                    </PrivateRoute>
                    <PrivateRoute path="/submitFile" authState={authState}>
                        <CssBaseline />
                        {/* <AppLayout
                            pageTitle="File Submission"
                            listItems={listItems}
                            listIcons={listIcons}
                            linkList={linkList}
                            coreElement={<SubmitFile dbCallback={jobCallback} baseUrl={baseUrl} />}
                        /> */}
                        <FileBrowser baseUrl={baseUrl}></FileBrowser>
                    </PrivateRoute>
                    <Route path="/">
                        <AuthComponent appCallback={authCallbackState} />
                    </Route>
                </Switch>
            </Router>
        </ThemeProvider>
    );
}
