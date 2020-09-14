import React, { useState, useRef } from 'react';
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
import XLSX from 'xlsx';

export default function SubmitFile(props: {
    dbCallback: (jobID: string, token: string, apiKey: string) => void;
}): JSX.Element {
    const baseUrl = 'https://api.atreides.ai/dev/atreides-app/controls-nlp/v1';
    const classes = useStyles();
    const [file, selectFile] = useState<File>();
    const [open, setOpen] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [badData, setBadData] = useState<boolean>(false);
    const [unauthorized, setUnauthorized] = useState<boolean>(false);
    const [fileName, selectedFileName] = useState<string>('No File Selected');
    const [showDashboardButton, setDashboardButton] = useState<boolean>(false);
    const inputFileRef: any = useRef<HTMLInputElement>(null);

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

    const convertValuesToString = (rawData: any[]): any[] => {
        return rawData.map(function(obj) {
            for (const key in obj) {
                if (obj[key] !== undefined) {
                    obj[key] = String(obj[key]);
                }
            }
            return obj;
        });
    };

    const formatData = (rawData: any[]): any[] => {
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

    const convertCSVToJSON = async (file: File): Promise<Record<string, any>> => {
        const rawData = await papaPromise(file).then((obj: object | void) => {
            return obj['data'];
        });
        const data = await formatData(rawData);
        return { data: data };
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

    const convertXLToJSON = async (file: File): Promise<Record<string, any>> => {
        const data = await fileReaderPromise(file)
            .then(rawData => {
                const rawWorkbook = XLSX.read(rawData, { type: 'binary' });
                const jsonList: unknown[][] = [];
                rawWorkbook.SheetNames.forEach(function(sheetName) {
                    const sheet = XLSX.utils.sheet_to_json(rawWorkbook.Sheets[sheetName]);
                    jsonList.push(sheet);
                });
                // This was used instead of .flat() to ensure compatability with IE
                const mergedData = jsonList.reduce((accumulator, value) => accumulator.concat(value), []);
                return mergedData;
            })
            .then(mergedData => {
                const data = formatData(mergedData);
                return data;
            });

        return { data: data };
    };

    const convertFileToJson = async (file: File): Promise<Record<string, any>> => {
        if (fileName.split('.').pop() === '.csv') {
            return convertCSVToJSON(file);
        } else {
            return convertXLToJSON(file);
        }
    };

    const generateHeaders = async (): Promise<Record<string, any>> => {
        const token = await Auth.currentSession().then(data => {
            return data['idToken']['jwtToken'];
        });

        const apiKey = await Auth.currentUserInfo().then(data => {
            return data['attributes']['custom:api-key'];
        });

        return { headers: { 'x-api-key': apiKey, Authorization: token } };
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

    const handleSelectedFile = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
        const element = e.target as HTMLInputElement;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const theFile = element!.files![0];
        selectFile(theFile);
        selectedFileName(theFile['name']);
    };

    const handleDelete = (): void => {
        window.location.reload(false);
    };

    const handleUpload = async (file: File): Promise<void> => {
        const headers = await generateHeaders();
        const data = await convertFileToJson(file);
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
                console.log(response);
                successMessage();
                setOpen(true);
                props.dbCallback(
                    response['data']['job_id'],
                    headers['headers']['Authorization'],
                    headers['headers']['x-api-key'],
                );
                setDashboardButton(true);
            }
            if (response.status === 200) {
                successMessage();
                setOpen(true);
                setDashboardButton(true);
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

    const onBtnClick = () => {
        /*Collecting node-element and performing click*/
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        inputFileRef!.current!.click();
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
                            ref={inputFileRef}
                            type="file"
                            onChange={e => handleSelectedFile(e)}
                        />
                    </Grid>
                    <Grid container direction="row" justify="space-between" alignItems="center">
                        <Grid item>
                            <Button variant="contained" color="primary" onClick={onBtnClick}>
                                Select File
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color="primary" onClick={uploadManager}>
                                Upload
                            </Button>
                        </Grid>
                        {showDashboardButton && (
                            <Grid item>
                                <Link to="/dashboard">
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="secondary"
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
