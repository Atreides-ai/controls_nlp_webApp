import React, { useState, useEffect } from 'react';
import './App.css';
import SubmitFile from './Submit_File';
import Dashboard from './Dashboard';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import PrivateRoute from './private_route.js';
import Amplify, { Auth } from 'aws-amplify';
import awsmobile from './aws-exports';
import AuthComponent from './Atreides_Auth_Wrapper';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './theme';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppLayout from './AppLayout';
import FolderSharedIcon from '@material-ui/icons/FolderShared';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import FileBrowser from './FileBrowser';
import HomePage from 'HomePage';

Amplify.configure(awsmobile);

export default function App() {
    const [authState, setState] = useState(false);
    const [headers, setHeaders] = useState();
    const [fileName, setFileName] = useState('');
    const baseUrl = process.env.REACT_APP_ENDPOINT;

    const listItems = ['Company Controls', 'Upload'];
    // eslint-disable-next-line react/jsx-key
    const listIcons = [<FolderSharedIcon />, <CloudUploadIcon />];
    const linkList = ['/fileBrowser', '/controlSubmitFile'];

    const authCallbackState = (authStateData, headers) => {
        setState(authStateData);
        setHeaders(headers);
    };

    const fileNameCallback = fileName_ => {
        setFileName(fileName_);
    };

    useEffect(() => {
        const tokenValid = Auth.currentSession().then(session => {
            const expiry = session['accessToken']['payload']['exp'];
            if (Math.floor(Date.now() / 1000) < expiry) {
                return true;
            } else {
                return false;
            }
        });
        setState(tokenValid);
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <Router>
                <Switch>
                    <PrivateRoute path="/home" authState={authState}>
                        <CssBaseline />
                        <HomePage></HomePage>
                    </PrivateRoute>
                    <PrivateRoute path="/dashboard" authState={authState}>
                        <CssBaseline />
                        <AppLayout
                            pageTitle="Controls Dashboard"
                            listItems={listItems}
                            listIcons={listIcons}
                            linkList={linkList}
                            coreElement={<Dashboard fileName={fileName} baseUrl={baseUrl} headers={headers} />}
                        />
                    </PrivateRoute>
                    <PrivateRoute path="/controlSubmitFile" authState={authState}>
                        <CssBaseline />
                        <AppLayout
                            pageTitle="File Submission"
                            listItems={listItems}
                            listIcons={listIcons}
                            linkList={linkList}
                            coreElement={<SubmitFile baseUrl={baseUrl} />}
                        />
                    </PrivateRoute>
                    <PrivateRoute path="/fileBrowser" authState={authState}>
                        <CssBaseline />
                        <AppLayout
                            pageTitle="File Browser"
                            listItems={listItems}
                            listIcons={listIcons}
                            linkList={linkList}
                            coreElement={
                                <FileBrowser
                                    dbCallback={fileNameCallback}
                                    baseUrl={baseUrl}
                                    headers={headers}
                                ></FileBrowser>
                            }
                        />
                    </PrivateRoute>
                    <Route path="/">
                        <AuthComponent appCallback={authCallbackState} />
                    </Route>
                </Switch>
            </Router>
        </ThemeProvider>
    );
}
