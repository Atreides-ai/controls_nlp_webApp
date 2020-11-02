import React, { useState } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import SignOut from './sign_out';
import GuidanceDiaglogue from './guidanceDialogue';
import './button_hider.css';
import Snackbar from '@material-ui/core/Snackbar';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { Container } from '@material-ui/core';
import Copyright from './copyright';
import { Link } from 'react-router-dom';
import MySnackbarContentWrapper from './mySnackbarContentWrapper';
import useStyles from './useStyles';
import { Auth } from 'aws-amplify';
import axios from 'axios';
import papaparse from 'papaparse';
import XLSX from 'xlsx';
import AtreidesDropzone from 'Atreides_Dropzone';
import { generateHeaders } from './utils/AtreidesAPIUtils';

export default function SubmitFile(props: { dbCallback: (jobID: string) => void; baseUrl: string }): JSX.Element {
    const classes = useStyles();
    const [file, selectFile] = useState<Array<File>>();
    const [open, setOpen] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [badData, setBadData] = useState<boolean>(false);
    const [unauthorized, setUnauthorized] = useState<boolean>(false);
    const [showDashboardButton, setDashboardButton] = useState<boolean>(false);
    const [showLoadingCircle, setLoadingCircle] = useState<boolean>(false);
    const [allowSubmission, setAllowSubmission] = useState<boolean>(true);

    const papaPromise = async (rawFile: File): Promise<object | Error> => {
        return new Promise((resolve, reject) => {
            papaparse.parse(rawFile, {
                header: true,
                complete: function(results) {
                    resolve(results);
                },
                error: function(error) {
                    reject(error);
                },
            });
        });
    };

    const convertValuesToString = (rawData: Array<object>): Array<object> => {
        return rawData.map(function(obj) {
            for (const key in obj) {
                if (obj[key] !== undefined) {
                    obj[key] = String(obj[key]);
                }
            }
            return obj;
        });
    };

    const formatData = (rawData: Array<object>): Array<object> => {
        const data = rawData.map(function(obj) {
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

        const formattedData = convertValuesToString(data);

        return formattedData;
    };

    const convertCSVToJSON = async (file: File): Promise<Array<object>> => {
        const rawData = await papaPromise(file).then((obj: object | void) => {
            return obj['data'];
        });
        const data = await formatData(rawData);
        return data;
    };

    const fileReaderPromise = async (file: File): Promise<string | ArrayBuffer | null> => {
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
            reader.onerror = (): any => {
                reader.abort();
                reject(new DOMException('Problem parsing input file.'));
            };

            reader.onload = (): any => {
                resolve(reader.result);
            };
            reader.readAsBinaryString(file);
        });
    };

    const addSheetName = (sheet: Array<object>, sheetName: string): Array<object> => {
        return sheet.map(obj => {
            obj['sheetName'] = sheetName;
            return obj;
        });
    };

    const addFileNameanduserID = async (data: Array<object>, fileName: string): Promise<Array<object>> => {
        const username = await Auth.currentUserInfo().then(data => {
            return data['attributes']['email'];
        });
        return data.map(obj => {
            obj['filename'] = fileName;
            obj['username'] = username;
            return obj;
        });
    };

    const handleTitleRow = (rawWorkBook: any, sheetName: string): Array<object> | void => {
        let counter = 0;
        while (counter <= 5) {
            const sheet = XLSX.utils.sheet_to_json(rawWorkBook.Sheets[sheetName], { range: counter }) as Array<object>;
            if (sheet[0].hasOwnProperty('Control Description') && sheet[0].hasOwnProperty('Risk Description')) {
                const namedSheets = addSheetName(sheet, sheetName);
                return namedSheets;
            } else {
                counter++;
            }
        }

        if (counter > 5) {
            setOpen(true);
            setBadData(true);
        }
    };

    const convertXLToJSON = async (file: File): Promise<Array<object>> => {
        const data = await fileReaderPromise(file)
            .then(rawData => {
                const rawWorkbook = XLSX.read(rawData, { type: 'binary' });
                const jsonList: unknown[][] = [];
                rawWorkbook.SheetNames.forEach(function(sheetName) {
                    const sheet = handleTitleRow(rawWorkbook, sheetName) as Array<object>;
                    jsonList.push(sheet);
                });
                // This was used instead of .flat() to ensure compatability with IE
                const mergedData = jsonList.reduce((accumulator, value) => accumulator.concat(value), []);
                return mergedData as Array<object>;
            })
            .then(mergedData => {
                const data = formatData(mergedData);
                return data;
            });

        return data;
    };

    const convertFileToJson = (file: File, fileName: string): Promise<Array<object>> => {
        if (fileName.split('.').pop() === 'csv') {
            const data = convertCSVToJSON(file);
            return data;
        } else {
            const data = convertXLToJSON(file);
            return data;
        }
    };

    const successMessage = async (): Promise<void> => {
        setSuccess(true);
        setOpen(true);
    };
    const failMessage = async (): Promise<void> => {
        setSuccess(false);
        setOpen(true);
    };
    const handleClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string): void => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const handleFiles = async (files: Array<File>): Promise<void> => {
        selectFile(files);
    };

    const handleUpload = async (files: Array<File>): Promise<void> => {
        const headers = await generateHeaders();
        files.forEach(async file => {
            const fileName = file['name'];
            const data = await convertFileToJson(file, fileName);
            const subData = await addFileNameanduserID(data, fileName);
            const url = props.baseUrl + '/control';
            if (allowSubmission === true) {
                setAllowSubmission(false);
                setLoadingCircle(true);
                axios.post(url, { data: subData }, headers).then(response => {
                    console.log(response);
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
                        props.dbCallback(response['data']['job_id']);
                        setLoadingCircle(false);
                        setDashboardButton(true);
                    }
                    if (response.status === 200) {
                        successMessage();
                        setOpen(true);
                        setDashboardButton(true);
                    }
                });
            }
        });
    };

    const uploadManager = async (): Promise<void> => {
        if (file !== null || undefined) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            handleUpload(file!);
        } else {
            failMessage();
        }
    };

    return (
        <Container component="main" maxWidth="lg">
            <div className={classes.loginSurface}>
                <form className={classes.mui_form} noValidate>
                    <Grid container direction="row" spacing={1} justify="center">
                        <Grid item xs={12} sm="auto" md="auto" lg="auto">
                            <Card className={classes.card}>
                                <CardActionArea>
                                    <AtreidesDropzone handleFiles={handleFiles} />
                                    <CardContent>
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
                    <Grid container direction="column" alignItems="center" spacing={3}>
                        <Grid item>
                            <Button variant="contained" color="secondary" onClick={uploadManager}>
                                Upload
                            </Button>
                        </Grid>
                        <Grid item>
                            {showDashboardButton && (
                                <Link to="/fileBrowser">
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="secondary"
                                        className={classes.muisubmit}
                                    >
                                        View Results
                                    </Button>
                                </Link>
                            )}
                            {showLoadingCircle && <CircularProgress color="primary" />}
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
                    open={open && success}
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
                    open={open && !success}
                    autoHideDuration={6000}
                    onClose={handleClose}
                >
                    <MySnackbarContentWrapper variant="error" message="Please select a file!" />
                </Snackbar>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={open && badData}
                    autoHideDuration={6000}
                    onClose={handleClose}
                >
                    <MySnackbarContentWrapper
                        onClose={handleClose}
                        variant="error"
                        message="Oops! There was a problem with your data"
                    />
                </Snackbar>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={open && unauthorized}
                    autoHideDuration={6000}
                    onClose={handleClose}
                >
                    <MySnackbarContentWrapper
                        onClose={handleClose}
                        variant="error"
                        message="Subscription limit Reached!"
                    />
                </Snackbar>
            </div>
        </Container>
    );
}
