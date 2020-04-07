import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Storage } from 'aws-amplify';
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
import * as d3 from 'd3';
import { Auth } from 'aws-amplify';

Storage.configure({ level: 'private' });

MySnackbarContentWrapper.propTypes = {
    className: PropTypes.string,
    message: PropTypes.string,
    onClose: PropTypes.func,
    variant: PropTypes.oneOf(['error', 'success']).isRequired,
};

export default function SubmitFile({ user }) {
    const classes = useStyles();
    const [file, selectFile] = useState(null);
    const [open, setOpen] = useState();
    const [success, setSuccess] = useState();
    const [fileName, selectedFileName] = useState('No File Selected');
    const [showDashboardButton, setDashboardButton] = useState(false);

    const reduceFileForPilot = fileString => {
        const parsedFile = d3.csvParse(fileString);
        const sample = parsedFile.slice(0, 50);

        return d3.csvFormat(sample);
    };

    const handleUpload = async e => {
        Storage.put(fileName, file, 'private')
            .then(result => console.log(result))
            .catch(err => console.log(err));
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
        const selectedFile = e.target.files[0];

        Auth.userSession(user).then(session => {
            const userGroup = session.accessToken.payload['cognito:groups'][0];
            if (userGroup === 'pilot' || 'demo') {
                const reader = new FileReader();
                reader.onload = function() {
                    const csvFile = reduceFileForPilot(reader.result);
                    selectFile(csvFile);
                };
                reader.readAsBinaryString(selectedFile);
            } else if (userGroup === 'atreides' || 'enterprise') {
                selectFile(selectedFile);
            }
        });
    };
    const handleDelete = async e => {
        window.location.reload(false);
    };

    const uploadManager = async e => {
        if (file != null) {
            handleUpload();
            successMessage();
            setDashboardButton(true);
        } else {
            failMessage();
        }
    };
    return (
        <Box>
            <Grid container component="main" className={classes.root}>
                <CssBaseline />
                <Grid item xs={false} sm={4} md={7} className={classes.image} />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <div className={classes.paper}>
                        <form className={classes.muiform} noValidate>
                            <Grid item xs={12}>
                                <Container>
                                    <Card className={classes.card}>
                                        <CardActionArea>
                                            <CardMedia className={classes.media} image={logo} title="Atreides.ai" />
                                            <CardContent>
                                                <Typography gutterBottom variant="h5" component="h2">
                                                    Controls Natural Language Processing
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">
                                                    Welcome to the Atreides.ai Controls NLP Portal. We are a cutting
                                                    edge data science start up applying Machine Learning to the risk
                                                    management domain.
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
                                </Container>
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
                                    <Chip
                                        color="primary"
                                        onDelete={handleDelete}
                                        icon={<FileCopyIcon />}
                                        label={fileName}
                                    />
                                </Grid>
                            </Grid>
                            <Grid />
                            <Grid item></Grid>
                            <Box mt={5}>
                                <Copyright />
                            </Box>
                        </form>
                    </div>
                </Grid>
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
                </div>
            </Grid>
        </Box>
    );
}
