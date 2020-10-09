import React, { useState, useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CardTablePopUp from './CardTablePopUp';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import PrintButton from './PDF_Button';
import dashboardDescriptions from 'Dashboard_Descriptions';
import * as d3 from 'd3';
import LinearProgress from '@material-ui/core/LinearProgress';
import MyResponsivePie from './pieConfig';
import useStyles from './useStyles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import Typography from '@material-ui/core/Typography';
import 'typeface-roboto';
import Copyright from './copyright';
import 'array.prototype.move';
import { CSVLink } from 'react-csv';
import DashboardContent from './Dashboard_Content';
import SecurityIcon from '@material-ui/icons/Security';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ErrorIcon from '@material-ui/icons/Error';
import Divider from '@material-ui/core/Divider';
import FeedbackIcon from '@material-ui/icons/Feedback';
import FlagIcon from '@material-ui/icons/Flag';
import StarIcon from '@material-ui/icons/Star';
import BuildIcon from '@material-ui/icons/Build';
import BugReportIcon from '@material-ui/icons/BugReport';
import PieChartCard from './PieChartCard';
import MaterialTable from 'material-table';
import DataTablePopUp from './DataTablePopUp';
import axios from 'axios';
import tableIcons from './tableIcons';

export default function Dashboard(props) {
    const classes = useStyles();
    const [dashboard, showDashboard] = useState(false);
    const [dashboardfile, setFile] = useState();
    const baseUrl = process.env.REACT_APP_ENDPOINT;
    const [progress, setProgress] = useState(0);
    const [waitMessage, showWaitMessage] = useState(false);
    const [errorMessage, showErrorMessage] = useState(false);
    const [limitMessage, showLimitMessage] = useState(false);
    const descriptions = dashboardDescriptions;
    const COREMETRICS = [
        'control_id',
        'control_description',
        'risk_description',
        'control_operator',
        'control_frequency',
        'relevance_to_risk',
        'contains_whats',
        'contains_hows',
        'contains_whens',
        'contains_whos',
        'contains_thresholds',
        'control_summary_rating',
        'whats',
        'hows',
        'whens',
        'whos',
        'thresholds',
        'multiple_whats',
        'multiple_hows',
        'multiple_whens',
        'multiple_whos',
        'multiple_thresholds',
        'accuracy',
        'classification_and_understandability',
        'completeness',
        'cut_off',
        'existence',
        'valuation',
        'rights_and_obligations',
        'occurrence',
    ];

    const handleClose = () => {
        showWaitMessage(false);
    };

    const createRemediationList = dashboardfile => {
        return dashboardfile.map(function(obj) {
            const remediationText = [];
            if (obj['contains_whats'] === 'false') {
                remediationText.push('No what.\n');
            }
            if (obj['contains_hows'] === 'false') {
                console.log('No how triggered...');
                remediationText.push('No how.\n');
                console.log(remediationText);
            }
            if (obj['contains_whos'] === 'false') {
                remediationText.push('No who\n');
            }
            if (obj['contains_whens'] === 'false') {
                remediationText.push('No when\n');
            }
            if (remediationText === '') {
                remediationText.push('No remediation required');
            }
            console.log(remediationText);
            obj['Remediation'] = remediationText.join('');
            return obj;
        });
    };

    const orderDownload = file => {
        const download = [];
        file.map(obj => {
            const newObj = {};
            COREMETRICS.forEach(item => {
                newObj[item.replace(/_/g, ' ').toUpperCase()] = obj[item];
            });

            const keys = Object.keys(obj);
            const difference = keys.filter(x => !COREMETRICS.includes(x));

            difference.forEach(item => {
                newObj[item] = obj[item];
            });

            download.push(newObj);
        });
        return download;
    };

    const fillNulls = controls => {
        return controls.map(function(obj) {
            for (const [key, value] of Object.entries(obj)) {
                if (obj[key] === null) {
                    obj[key] = 'None';
                } else if (obj[key] === false) {
                    obj[key] = String(value);
                }
            }
            return obj;
        });
    };

    /**
     *
     *
     * @param {*} inputFile
     * @returns
     */
    const unwrapAdditionalData = inputFile => {
        return inputFile.map(function(obj) {
            if (obj['additional_data'] !== undefined) {
                for (const [key, value] of Object.entries(obj['additional_data'])) {
                    obj[key] = value;
                }
            }
            delete obj['additional_data'];
            delete obj['created_at'];
            delete obj['job_id'];
            delete obj['organisation_id'];
            delete obj['__EMPTY'];
            return obj;
        });
    };

    const createCSVDownload = rawFile => {
        const file = unwrapAdditionalData(rawFile);
        const processedFile = fillNulls(file);
        const orderedData = orderDownload(processedFile);
        return orderedData;
    };

    /**
     * Polls the API at 30 second intervals to check job status
     *
     */
    const getFile = async (jobId, apiKey, token) => {
        const url = baseUrl + '/get_results/' + jobId;
        const headers = { headers: { 'x-api-key': apiKey, Authorization: token } };
        const interval = setInterval(() => {
            axios.get(url, headers).then(response => {
                if (response.status === 200 && response['data']['percent_complete'] === 100) {
                    setProgress(100);
                    console.log('completed');
                    if (response.data.controls) {
                        console.log(response);
                        console.log(response.data.controls);
                        setFile(response.data.controls);
                        clearInterval(interval);
                        showDashboard(true);
                    } else {
                        showErrorMessage(true);
                    }
                } else if (response.status === 200 && response['data']['percent_complete'] != 100) {
                    console.log(response);
                    setProgress(response['data']['percent_complete']);
                } else if (response.status === 403) {
                    showLimitMessage(true);
                    clearInterval(interval);
                } else if (response.status === 400 || 404) {
                    console.log(response);
                    showErrorMessage(true);
                    clearInterval(interval);
                }
            });
        }, 5000);
    };

    useEffect(() => {
        getFile(props.jobId, props.apiKey, props.token);
    }, [props.jobId, props.apiKey, props.token]);

    /**
     * Takes a file and relevant column name and returns obj counting all keys
     *
     * @param {[object]} file
     * @param {string} column
     * @returns {[object]}
     */
    const countColumnValues = (file, column) => {
        const dataCount = d3
            .nest()
            .key(function(d) {
                return d[column];
            })
            .rollup(function(leaves) {
                return leaves.length;
            })
            .entries(file);

        return dataCount;
    };

    /**
     * Takes an array of objects of pie chart data and sets colors for each key
     *
     * @param {[object]} dataCount
     * @returns {[object]} formattedData
     */
    const formatData = dataCount => {
        return dataCount.map(function(obj) {
            obj['id'] = obj['key'];
            delete obj['key'];
            if (obj['id'] === 'true') {
                obj['color'] = '#7C4DFF';
            } else if (obj['id'] === 'false') {
                obj['color'] = '#607D8B';
            } else if (obj['id'] === 'poor') {
                obj['color'] = '#7C4DFF';
            } else if (obj['id'] === 'fair') {
                obj['color'] = '#607D8B';
            } else if (obj['id'] === 'good') {
                obj['color'] = '#CFD8DC';
            } else if (obj['id'] === 'strong') {
                obj['color'] = '#455A64';
            } else if (obj['id'] === 'Manual') {
                obj['color'] = '#7C4DFF';
            } else if (obj['id'] === 'Automated') {
                obj['color'] = '#607D8B';
            }
            return obj;
        });
    };

    /**
     * Takes the data for pie chart and orders for legend to ensure consistency
     *
     * @param {[object]} data
     * @returns {[object]} filtered
     */
    const orderData = data => {
        data.forEach(function(element) {
            if (element !== undefined) {
                if (element['id'] === 'True') {
                    data.move(data.indexOf(element), 0);
                } else if (element['id'] === 'False') {
                    data.move(data.indexOf(element), 1);
                } else if (element['id'] === 'poor') {
                    data.move(data.indexOf(element), 0);
                } else if (element['id'] === 'fair') {
                    data.move(data.indexOf(element), 1);
                } else if (element['id'] === 'good') {
                    data.move(data.indexOf(element), 2);
                } else if (element['id'] === 'strong') {
                    data.move(data.indexOf(element), 3);
                }
            }
        });

        const filtered = data.filter(function(x) {
            return x !== undefined;
        });

        return filtered;
    };

    /**
     * Takes the file and the column name and generates pie chart data array
     *
     * @param {string} column
     * @returns {[object]} data
     */
    const generatePie = (file, column) => {
        const dataCount = countColumnValues(file, column);
        if (dataCount[0]['id'] !== 'undefined') {
            const rawData = formatData(dataCount);
            const orderedData = orderData(rawData);
            return orderedData;
        } else return [{ id: 'No Data Provided', value: 20 }];
    };

    /**
     * Finds the column in the data and returns the count for a given key
     *
     * @param {string} column
     * @param {string} key
     * @return {integer} value
     */
    const generateCardMetric = (file, column, key) => {
        const countData = countColumnValues(file, column);
        const fieldCount = countData.filter(function(el) {
            return el['key'] === key;
        });

        if (fieldCount[0] !== undefined) {
            console.log(fieldCount);
            return fieldCount[0]['value'].toString();
        }

        return '0';
    };

    return (
        <Box className={classes.root} id="dashboard">
            <AppBar position="static">
                <Toolbar>
                    {dashboard && (
                        <div>
                            <Grid container direction="row" spacing={1}>
                                <Grid item xs="auto" sm="auto" md="auto" lg="auto">
                                    <CSVLink data={createCSVDownload(dashboardfile)} filename="Analysis.csv">
                                        <IconButton edge="start" color="secondary">
                                            <CloudDownloadIcon></CloudDownloadIcon>
                                        </IconButton>
                                    </CSVLink>
                                </Grid>
                                <Grid item xs="auto" sm="auto" md="auto" lg="auto">
                                    <CSVLink data={createCSVDownload(dashboardfile)} filename="Analysis.csv">
                                        <Button variant="outlined" color="secondary">
                                            Download All Results
                                        </Button>
                                    </CSVLink>
                                </Grid>
                                <Grid item xs="auto" sm="auto" md="auto" lg="auto">
                                    <PrintButton descriptions={descriptions} label="Download Dashboard" />
                                </Grid>
                            </Grid>
                        </div>
                    )}
                    <Typography variant="h6" className={classes.title} align="center">
                        Atreides Controls NLP Dashboard
                    </Typography>
                    <Copyright align="right" color="primary"></Copyright>
                </Toolbar>
            </AppBar>
            {dashboard === false && (
                <Container component="main" maxWidth="xs">
                    <div className={classes.progress} align="centre">
                        <LinearProgress color="secondary" variant="determinate" value={progress} />
                    </div>
                    <Dialog
                        open={waitMessage}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">{'Woah, thats a big file!'}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Sorry for the wait. It looks like you uploaded quite a large file, our AI is reading as
                                fast as it can! We will be right with you.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Thanks!
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog
                        open={limitMessage}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">{'Woah, thats a big file!'}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                It seems that you have used up the number of controls that can be processed in your
                                plan. Please contact support at support@atreides.ai for help upgrading to your plan.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Thanks!
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog
                        open={errorMessage}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">{'Woah, thats a big file!'}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Sorry an error has occured when processing the job, please can you contact support at
                                support@atreides.ai.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Thanks!
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Container>
            )}
            {dashboard && (
                <div className={classes.root}>
                    <Grid container direction="row" spacing={1}>
                        <Grid item xs={12} sm="auto" md="auto" lg="auto">
                            <Divider variant="middle" />
                            <Typography variant="h4" className={classes.dashboardHeader}>
                                How well do the controls cover the design requirements?
                            </Typography>
                        </Grid>
                        <Grid container direction="row" spacing={3} justify="center">
                            <Grid item xs={12} sm="auto" md="auto" lg="auto">
                                <CardTablePopUp
                                    id="fully_card"
                                    analysisField="control_summary_rating"
                                    dashboardFile={createRemediationList(dashboardfile)}
                                    filter="Fully"
                                    tableIcons={tableIcons}
                                    showRemediation={true}
                                    DashboardContent={
                                        <DashboardContent
                                            icon={<StarIcon style={{ fontSize: 120 }} />}
                                            header="Fully"
                                            body={generateCardMetric(dashboardfile, 'control_summary_rating', 'Fully')}
                                        />
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} sm="auto" md="auto" lg="auto">
                                <CardTablePopUp
                                    analysisField="control_summary_rating"
                                    dashboardFile={createRemediationList(dashboardfile)}
                                    filter="Mostly"
                                    tableIcons={tableIcons}
                                    id="mostly_card"
                                    showRemediation={true}
                                    DashboardContent={
                                        <DashboardContent
                                            icon={<BuildIcon style={{ fontSize: 120 }} />}
                                            header="Mostly"
                                            body={generateCardMetric(dashboardfile, 'control_summary_rating', 'Mostly')}
                                        ></DashboardContent>
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} sm="auto" md="auto" lg="auto">
                                <CardTablePopUp
                                    analysisField="control_summary_rating"
                                    dashboardFile={createRemediationList(dashboardfile)}
                                    filter="Partially"
                                    tableIcons={tableIcons}
                                    id="partially_card"
                                    showRemediation={true}
                                    DashboardContent={
                                        <DashboardContent
                                            icon={<BugReportIcon style={{ fontSize: 120 }} />}
                                            header="Partially"
                                            body={generateCardMetric(
                                                dashboardfile,
                                                'control_summary_rating',
                                                'Partially',
                                            )}
                                        ></DashboardContent>
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} sm="auto" md="auto" lg="auto">
                                <CardTablePopUp
                                    analysisField="control_summary_rating"
                                    dashboardFile={createRemediationList(dashboardfile)}
                                    filter="Poorly"
                                    id="poorly_card"
                                    showRemediation={true}
                                    tableIcons={tableIcons}
                                    DashboardContent={
                                        <DashboardContent
                                            icon={<FeedbackIcon style={{ fontSize: 120 }} />}
                                            header="Poorly"
                                            body={generateCardMetric(dashboardfile, 'control_summary_rating', 'Poorly')}
                                        ></DashboardContent>
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} sm="auto" md="auto" lg="auto">
                                <CardTablePopUp
                                    analysisField="control_summary_rating"
                                    dashboardFile={createRemediationList(dashboardfile)}
                                    filter="None"
                                    tableIcons={tableIcons}
                                    id="none_card"
                                    showRemediation={true}
                                    DashboardContent={
                                        <DashboardContent
                                            icon={<FlagIcon style={{ fontSize: 120 }} />}
                                            header="None"
                                            body={generateCardMetric(dashboardfile, 'control_summary_rating', 'None')}
                                        ></DashboardContent>
                                    }
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container direction="row" spacing={1}>
                        <Grid item xs={12} sm="auto" md="auto" lg="auto">
                            <Divider variant="middle" />
                            <Typography variant="h4" className={classes.dashboardHeader}>
                                Control Relevance To Risk
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container direction="row" spacing={1}>
                        <Grid item xs={12} sm={3} md={3} lg={3}>
                            <CardTablePopUp
                                analysisField="relevance_to_risk"
                                dashboardFile={dashboardfile}
                                filter="strong"
                                tableIcons={tableIcons}
                                id="strong_risk_card"
                                DashboardContent={
                                    <DashboardContent
                                        icon={<SecurityIcon style={{ fontSize: 120 }} />}
                                        header="Strong"
                                        body={generateCardMetric(dashboardfile, 'relevance_to_risk', 'strong')}
                                    ></DashboardContent>
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={3} md={3} lg={3}>
                            <CardTablePopUp
                                analysisField="relevance_to_risk"
                                dashboardFile={dashboardfile}
                                filter="good"
                                tableIcons={tableIcons}
                                id="good_risk_card"
                                DashboardContent={
                                    <DashboardContent
                                        icon={<ThumbUpIcon style={{ fontSize: 120 }} />}
                                        header="Good"
                                        body={generateCardMetric(dashboardfile, 'relevance_to_risk', 'good')}
                                    ></DashboardContent>
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={3} md={3} lg={3}>
                            <CardTablePopUp
                                analysisField="relevance_to_risk"
                                dashboardFile={dashboardfile}
                                filter="fair"
                                tableIcons={tableIcons}
                                id="fair_risk_card"
                                DashboardContent={
                                    <DashboardContent
                                        icon={<NotificationsIcon style={{ fontSize: 120 }} />}
                                        header="Fair"
                                        body={generateCardMetric(dashboardfile, 'relevance_to_risk', 'fair')}
                                    ></DashboardContent>
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={3} md={3} lg={3}>
                            <CardTablePopUp
                                analysisField="relevance_to_risk"
                                dashboardFile={dashboardfile}
                                filter="poor"
                                tableIcons={tableIcons}
                                id="poor_risk_card"
                                DashboardContent={
                                    <DashboardContent
                                        icon={<ErrorIcon style={{ fontSize: 120 }} />}
                                        header="Poor"
                                        body={generateCardMetric(dashboardfile, 'relevance_to_risk', 'poor')}
                                    ></DashboardContent>
                                }
                            />
                        </Grid>
                        <Grid container direction="row" spacing={1}>
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                <Divider variant="middle" />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container direction="row" spacing={1}>
                        <Grid item xs={12} sm={12} md={12} lg="auto">
                            <Typography variant="h4" className={classes.dashboardHeader}>
                                Detailed Metrics
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container direction="row" spacing={1}>
                        <Grid item xs={12} sm={4} md={4} lg={4}>
                            <PieChartCard
                                id="automated_manual_pie"
                                chart={<MyResponsivePie data={generatePie(dashboardfile, 'Control Method')} />}
                                table={
                                    <DataTablePopUp
                                        table={
                                            <MaterialTable
                                                options={{
                                                    exportButton: true,
                                                }}
                                                icons={tableIcons}
                                                columns={[
                                                    { title: 'Control Description', field: 'control_description' },
                                                    { title: 'Control Method', field: 'Control Method' },
                                                ]}
                                                data={dashboardfile}
                                                title="Analysis Summary"
                                            />
                                        }
                                    />
                                }
                                header="Control Method"
                                body="The split of controls that are automated or manual."
                            ></PieChartCard>
                        </Grid>
                        <Grid item xs={12} sm={4} md={4} lg={4}>
                            <PieChartCard
                                id="contains_what_pie"
                                chart={<MyResponsivePie data={generatePie(dashboardfile, 'contains_whats')} />}
                                table={
                                    <DataTablePopUp
                                        table={
                                            <MaterialTable
                                                options={{
                                                    exportButton: true,
                                                }}
                                                icons={tableIcons}
                                                columns={[
                                                    { title: 'Control Description', field: 'control_description' },
                                                    { title: 'What Text', field: 'whats' },
                                                    { title: 'Contains What', field: 'contains_whats' },
                                                ]}
                                                data={dashboardfile}
                                                title="Analysis Summary"
                                            />
                                        }
                                    />
                                }
                                header="What"
                                body="Controls that define what is performed."
                            ></PieChartCard>
                        </Grid>
                        <Grid item xs={12} sm={4} md={4} lg={4}>
                            <PieChartCard
                                id="contains_how_pie"
                                chart={<MyResponsivePie data={generatePie(dashboardfile, 'contains_hows')} />}
                                table={
                                    <DataTablePopUp
                                        table={
                                            <MaterialTable
                                                options={{
                                                    exportButton: true,
                                                }}
                                                icons={tableIcons}
                                                columns={[
                                                    { title: 'Control Description', field: 'control_description' },
                                                    { title: 'How Text', field: 'hows' },
                                                    { title: 'Contains How', field: 'contains_hows' },
                                                ]}
                                                data={dashboardfile}
                                                title="Analysis Summary"
                                            />
                                        }
                                    />
                                }
                                header="How"
                                body="Controls that define how the activity is done or evidenced."
                            ></PieChartCard>
                        </Grid>
                    </Grid>
                    <Grid container direction="row" spacing={1}>
                        <Grid item xs={12} sm={4} md={4} lg={4}>
                            <PieChartCard
                                id="contains_who_pie"
                                chart={<MyResponsivePie data={generatePie(dashboardfile, 'contains_whos')} />}
                                table={
                                    <DataTablePopUp
                                        table={
                                            <MaterialTable
                                                options={{
                                                    exportButton: true,
                                                }}
                                                icons={tableIcons}
                                                columns={[
                                                    { title: 'Control Description', field: 'control_description' },
                                                    { title: 'Who Text', field: 'whos' },
                                                    { title: 'Contains Who', field: 'contains_whos' },
                                                ]}
                                                data={dashboardfile}
                                                title="Analysis Summary"
                                            />
                                        }
                                    />
                                }
                                header="Who"
                                body="Controls that define the operator."
                            ></PieChartCard>
                        </Grid>
                        <Grid item xs={12} sm={4} md={4} lg={4}>
                            <PieChartCard
                                id="contains_whens_pie"
                                chart={<MyResponsivePie data={generatePie(dashboardfile, 'contains_whens')} />}
                                table={
                                    <DataTablePopUp
                                        table={
                                            <MaterialTable
                                                options={{
                                                    exportButton: true,
                                                }}
                                                icons={tableIcons}
                                                columns={[
                                                    { title: 'Control Description', field: 'control_description' },
                                                    { title: 'When Text', field: 'whens' },
                                                    { title: 'Contains When', field: 'contains_whens' },
                                                ]}
                                                data={dashboardfile}
                                                title="Analysis Summary"
                                            />
                                        }
                                    />
                                }
                                header="When"
                                body="Controls that define the frequency of performance."
                            ></PieChartCard>
                        </Grid>
                        <Grid item xs={12} sm={4} md={4} lg={4}>
                            <PieChartCard
                                id="multiple_what_pie"
                                chart={<MyResponsivePie data={generatePie(dashboardfile, 'multiple_whats')} />}
                                table={
                                    <DataTablePopUp
                                        table={
                                            <MaterialTable
                                                options={{
                                                    exportButton: true,
                                                }}
                                                icons={tableIcons}
                                                columns={[
                                                    { title: 'Control Description', field: 'control_description' },
                                                    { title: 'Multiple Whats', field: 'whats' },
                                                    {
                                                        title: 'Contains Multiple Whats',
                                                        field: 'multiple_whats',
                                                    },
                                                ]}
                                                data={dashboardfile}
                                                title="Analysis Summary"
                                            />
                                        }
                                    />
                                }
                                header="Multiple Whats"
                                body="Controls with multiple activities."
                            ></PieChartCard>
                        </Grid>
                    </Grid>
                    <Grid container direction="row" spacing={1}>
                        <Grid item xs={12} sm={4} md={4} lg={4}>
                            <PieChartCard
                                id="multiple_how_pie"
                                chart={<MyResponsivePie data={generatePie(dashboardfile, 'multiple_hows')} />}
                                table={
                                    <DataTablePopUp
                                        table={
                                            <MaterialTable
                                                options={{
                                                    exportButton: true,
                                                }}
                                                icons={tableIcons}
                                                columns={[
                                                    { title: 'Control Description', field: 'control_description' },
                                                    { title: 'How Text', field: 'hows' },
                                                    { title: 'Contains Multiple Hows', field: 'contains_hows' },
                                                ]}
                                                data={dashboardfile}
                                                title="Analysis Summary"
                                            />
                                        }
                                    />
                                }
                                header="Multiple Hows"
                                body="Controls that define how multiple activities are performed."
                            ></PieChartCard>
                        </Grid>
                        <Grid item xs={12} sm={4} md={4} lg={4}>
                            <PieChartCard
                                id="multiple_who_pie"
                                chart={<MyResponsivePie data={generatePie(dashboardfile, 'multiple_whos')} />}
                                table={
                                    <DataTablePopUp
                                        table={
                                            <MaterialTable
                                                options={{
                                                    exportButton: true,
                                                }}
                                                icons={tableIcons}
                                                columns={[
                                                    { title: 'Control Description', field: 'control_description' },
                                                    { title: 'Who Text', field: 'whos' },
                                                    { title: 'Contains Multiple Who', field: 'multiple_whos' },
                                                ]}
                                                data={dashboardfile}
                                                title="Analysis Summary"
                                            />
                                        }
                                    />
                                }
                                header="Multiple Whos"
                                body="Controls with multiple operators likely defined."
                            ></PieChartCard>
                        </Grid>
                        <Grid item xs={12} sm={4} md={4} lg={4}>
                            <PieChartCard
                                id="multiple_when_pie"
                                chart={<MyResponsivePie data={generatePie(dashboardfile, 'multiple_whens')} />}
                                table={
                                    <DataTablePopUp
                                        table={
                                            <MaterialTable
                                                options={{
                                                    exportButton: true,
                                                }}
                                                icons={tableIcons}
                                                columns={[
                                                    { title: 'Control Description', field: 'control_description' },
                                                    { title: 'When Text', field: 'whens' },
                                                    { title: 'Contains Multiple Whens', field: 'multiple_whens' },
                                                ]}
                                                data={dashboardfile}
                                                title="Analysis Summary"
                                            />
                                        }
                                    />
                                }
                                header="Multiple Whens"
                                body="Controls with multiple frequencies."
                            ></PieChartCard>
                        </Grid>
                    </Grid>
                </div>
            )}
        </Box>
    );
}
