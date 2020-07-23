import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import SignOut from './sign_out';
import GuidanceDiaglogue from './guidanceDialogue';
import './button_hider.css';
import Snackbar from '@material-ui/core/Snackbar';
import Chip from '@material-ui/core/Chip';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { Container } from '@material-ui/core';
import logo from './logo.png';
import Copyright from './copyright';
import { Link } from 'react-router-dom';
import MySnackbarContentWrapper from './mySnackbarContentWrapper';
import useStyles from './useStyles';
import { Auth } from 'aws-amplify';
import axios from 'axios';
import papaparse from 'papaparse';

MySnackbarContentWrapper.propTypes = {
    className: PropTypes.string,
    message: PropTypes.string,
    onClose: PropTypes.func,
    variant: PropTypes.oneOf(['error', 'success']).isRequired,
};

export default function SubmitFile(dbCallback) {
    const baseUrl = 'https://api.atreides.ai/dev/atreides-app/controls-nlp/v1';
    const classes = useStyles();
    const [token, setToken] = useState();
    const [apiKey, setApiKey] = useState();
    const [file, selectFile] = useState(null);
    const [open, setOpen] = useState();
    const [success, setSuccess] = useState();
    const [badData, setBadData] = useState();
    const [unauthorized, setUnauthorized] = useState();
    const [fileName, selectedFileName] = useState('No File Selected');
    const [showDashboardButton, setDashboardButton] = useState(false);

    const papaPromise = () =>
        new Promise((resolve, reject) => {
            papaparse.parse(file, {
                header: true,
                complete: function(results) {
                    resolve(results);
                },
                error: function(error) {
                    reject(error);
                },
            });
        });

    const formatData = rawData => {
        return rawData.map(function(obj) {
            delete obj[''];
            obj['control_description'] = obj['Control Description'];
            delete obj['Control Description'];
            obj['risk_description'] = obj['Risk Description'];
            delete obj['Risk Description'];
            if (obj['Control Frequency']) {
                obj['control_frequency'] = obj['Control Frequency'];
                delete obj['Control Frequency'];
            }
            if (obj['Control Operator']) {
                obj['control_operator'] = obj['Control Operator'];
                delete obj['Control Operator'];
            }
            return obj;
        });
    };

    const convertCsvToJson = async e => {
        const rawData = await papaPromise().then(obj => {
            return obj['data'];
        });
        const data = await formatData(rawData);
        return { data: data };
    };

    const generateHeaders = async e => {
        const token = await Auth.currentSession().then(data => {
            return data['idToken']['jwtToken'];
        });

        setToken(token);

        const apiKey = await Auth.currentUserInfo().then(data => {
            return data['attributes']['custom:api-key'];
        });

        setApiKey(apiKey);

        return { headers: { 'x-api-key': apiKey, Authorization: token } };
    };

    const successMessage = async e => {
        setSuccess(true);
        setOpen(true);
    };
    const failMessage = async e => {
        setSuccess(false);
        setOpen(true);
    };
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };
    const handleSelectedFile = async e => {
        selectedFileName(e.target.files[0].name);
        selectFile(e.target.files[0]);
    };
    const handleDelete = async e => {
        window.location.reload(false);
    };

    const handleUpload = async e => {
        const headers = await generateHeaders();
        const data = await convertCsvToJson();
        console.log(data);
        const url = baseUrl + '/control';
        axios.post(url, data, headers).then(response => {
            if (response.status === 400) {
                setOpen(true);
                setBadData(true);
            }
            if (response.status === 403) {
                setOpen(true);
                setUnauthorized(true);
            }
            if (response.status === 202) {
                successMessage();
                setOpen(true);
                dbCallback(response['data']['job_id'], token, apiKey);
                setDashboardButton(true);
            }
            if (response.status === 200) {
                successMessage();
                setOpen(true);
                setDashboardButton(true);
            }
        });
    };

    const uploadManager = async e => {
        if (file != null) {
            handleUpload();
        } else {
            failMessage();
        }
    };

    return (
        <Container component="main" maxWidth="lg">
            <div className={classes.loginSurface}>
                <form className={classes.mui_form} noValidate>
                    <Grid container direction="row" spacing={3} justify="center">
                        <Grid item xs={12} sm="auto" md="auto" lg="auto">
                            <Card className={classes.card}>
                                <CardActionArea>
                                    <CardMedia className={classes.media} image={logo} title="Atreides.ai" />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            Controls Natural Language Processing
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" component="p">
                                            Welcome to the Atreides.ai Controls NLP Portal. We are a cutting edge data
                                            science start up applying Machine Learning to the risk management domain.
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                                <CardActions>
                                    <Button size="small" color="primary" href="https://www.atreides.ai/">
                                        About us
                                    </Button>
                                    <GuidanceDiaglogue />
                                    <SignOut />
                                </CardActions>
                            </Card>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <input
                            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                            id="contained-button-file"
                            type="file"
                            onChange={handleSelectedFile}
                        />
                    </Grid>
                    <Grid container direction="row" justify="space-between" alignItems="center">
                        <Grid item>
                            <label htmlFor="contained-button-file">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    component="span"
                                    className={classes.muisubmit}
                                    fullwidth
                                >
                                    Select File
                                </Button>
                            </label>
                        </Grid>
                        <Grid item>
                            <label htmlFor="UploadButton">
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    component="span"
                                    fullwidth
                                    className={classes.muisubmit}
                                    onClick={uploadManager}
                                >
                                    Upload
                                </Button>
                            </label>
                        </Grid>
                        {showDashboardButton && (
                            <Grid item>
                                <Link to="/dashboard">
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="secondary"
                                        component="span"
                                        fullwidth
                                        className={classes.muisubmit}
                                    >
                                        View Results
                                    </Button>
                                </Link>
                            </Grid>
                        )}
                        <Grid item>
                            <Chip color="primary" onDelete={handleDelete} icon={<FileCopyIcon />} label={fileName} />
                        </Grid>
                    </Grid>
                    <Grid />
                    <Box mt={5}>
                        <Copyright />
                    </Box>
                </form>
            </div>
            <div>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={open & success}
                    autoHideDuration={6000}
                    onClose={handleClose}
                >
                    <MySnackbarContentWrapper onClose={handleClose} variant="success" message="Upload Success!" />
                </Snackbar>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={open & !success}
                    autoHideDuration={6000}
                    onClose={handleClose}
                >
                    <MySnackbarContentWrapper
                        variant="error"
                        className={classes.margin}
                        message="Please select a file!"
                    />
                </Snackbar>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={open & badData}
                    autoHideDuration={6000}
                    onClose={handleClose}
                >
                    <MySnackbarContentWrapper
                        onClose={handleClose}
                        variant="success"
                        message="Oops! There was a problem with your data"
                    />
                </Snackbar>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={open & unauthorized}
                    autoHideDuration={6000}
                    onClose={handleClose}
                >
                    <MySnackbarContentWrapper
                        onClose={handleClose}
                        variant="success"
                        message="Subscription limit Reached!"
                    />
                </Snackbar>
            </div>
        </Container>
    );
}
