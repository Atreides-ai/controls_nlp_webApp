/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
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
import LinearProgress from '@material-ui/core/LinearProgress';
import ResponsivePie from './ResponsivePie';
import useStyles from './useStyles';
import Typography from '@material-ui/core/Typography';
import 'typeface-roboto';
import 'array.prototype.move';
import SecurityIcon from '@material-ui/icons/Security';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ErrorIcon from '@material-ui/icons/Error';
import FeedbackIcon from '@material-ui/icons/Feedback';
import FlagIcon from '@material-ui/icons/Flag';
import StarIcon from '@material-ui/icons/Star';
import BuildIcon from '@material-ui/icons/Build';
import BugReportIcon from '@material-ui/icons/BugReport';
import PieChartCard from './PieChartCard';
import MaterialTable from 'material-table';
import DataTablePopUp from './DataTablePopUp';
import axios from 'axios';
import ControlsCSVDownload from 'ControlsCSVDownload';
import tableIcons from './tableIcons';
import { PIEMETRICS } from './PieMetrics';
import _ from 'lodash';
import { generateHeaders } from './utils/AtreidesAPIUtils';
import { controlsFile } from './test_utils/controlsTestFile';

const Dashboard = (props: { fileName: string; token: string; apiKey: string; baseUrl: string }): JSX.Element => {
    const classes = useStyles();
    const [dashboard, showDashboard] = useState(false);
    const [dashboardfile, setFile] = useState<Array<object>>();
    const [progress, setProgress] = useState(0);
    const [errorMessage, showErrorMessage] = useState(false);
    const [limitMessage, showLimitMessage] = useState(false);
    const descriptions = dashboardDescriptions;

    const handleClose = (): void => {
        showErrorMessage(false);
        showLimitMessage(false);
    };

    const splitToChunks = (array: Array<string>, parts: number): Array<Array<string>> => {
        const result = [];
        for (let i = parts; i > 0; i--) {
            result.push(array.splice(0, Math.ceil(array.length / i)));
        }
        return result;
    };

    const createPieElements = (): JSX.Element[] => {
        const gridContent = splitToChunks(PIEMETRICS, 3);
        return gridContent.map((content: Array<string>) => {
            return (
                <Grid container direction="row" spacing={1}>
                    {content.map((item: string) => {
                        const id = 'contains_' + item + '_pie';
                        const column = 'contains_' + item.replace('multiple_', '');
                        const capitalised = _.upperFirst(item).replace('_', ' ');
                        const valueText = capitalised + ' Text';
                        const trueFalse = 'Contains ' + capitalised;
                        const textColumn = item.replace('multiple_', '');
                        return (
                            <Grid item xs={12} sm={4} md={4} lg={4}>
                                <PieChartCard
                                    id={id}
                                    chart={<ResponsivePie controlsFile={dashboardfile!} column={column} />}
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
                                                        { title: valueText, field: textColumn },
                                                        { title: trueFalse, field: column },
                                                    ]}
                                                    data={dashboardfile!}
                                                    title="Analysis Summary"
                                                />
                                            }
                                        />
                                    }
                                    header={capitalised}
                                    body={'Our analysis of: ' + capitalised}
                                ></PieChartCard>
                            </Grid>
                        );
                    })}
                </Grid>
            );
        });
    };

    /**
     * Polls the API at 30 second intervals to check job status
     *
     */
    const getFile = async (fileId: string): Promise<void> => {
        // This is for testing only ------->
        // setFile(controlsFile);
        // showDashboard(true);
        // ------------>
        const url = props.baseUrl + fileId;
        const headers = await generateHeaders();
        const interval = setInterval(() => {
            axios.get(url, headers).then(response => {
                if (response.status === 200 && response['data']['percent_complete'] === 100) {
                    setProgress(100);
                    if (response.data.controls) {
                        setFile(response.data.controls);
                        clearInterval(interval);
                        showDashboard(true);
                    } else {
                        showErrorMessage(true);
                    }
                } else if (response.status === 200 && response['data']['percent_complete'] != 100) {
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
        getFile(props.fileName);
    }, []);

    return (
        <Box className={classes.root} id="dashboard">
            {dashboard && (
                <Grid container direction="row" spacing={1} justify="flex-end">
                    <Grid item xs={12} sm="auto" md="auto" lg="auto">
                        <ControlsCSVDownload dashboardFile={dashboardfile!} />
                    </Grid>
                    <Grid item xs={12} sm="auto" md="auto" lg="auto">
                        <PrintButton descriptions={descriptions} label="Download Dashboard" />
                    </Grid>
                </Grid>
            )}
            {dashboard === false && (
                <Container component="main" maxWidth="xs">
                    <div className={classes.progress}>
                        <LinearProgress color="secondary" variant="determinate" value={progress} />
                    </div>
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
                            <Typography variant="h4" className={classes.dashboardHeader}>
                                How well do the controls cover the design requirements?
                            </Typography>
                        </Grid>
                        <Grid container direction="row" spacing={3} justify="center">
                            <Grid item xs={12} sm={6} md={4} lg="auto">
                                <CardTablePopUp
                                    id="fully_card"
                                    icon={<StarIcon style={{ fontSize: 100 }} />}
                                    analysisField="control_summary_rating"
                                    dashboardFile={dashboardfile!}
                                    filter="Fully"
                                    showRemediation={true}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4} lg="auto">
                                <CardTablePopUp
                                    analysisField="control_summary_rating"
                                    dashboardFile={dashboardfile!}
                                    filter="Mostly"
                                    id="mostly_card"
                                    showRemediation={true}
                                    icon={<BuildIcon style={{ fontSize: 100 }} />}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4} lg="auto">
                                <CardTablePopUp
                                    analysisField="control_summary_rating"
                                    dashboardFile={dashboardfile!}
                                    filter="Partially"
                                    icon={<BugReportIcon style={{ fontSize: 100 }} />}
                                    id="partially_card"
                                    showRemediation={true}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4} lg="auto">
                                <CardTablePopUp
                                    analysisField="control_summary_rating"
                                    icon={<FeedbackIcon style={{ fontSize: 100 }} />}
                                    dashboardFile={dashboardfile!}
                                    filter="Poorly"
                                    id="poorly_card"
                                    showRemediation={true}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4} lg="auto">
                                <CardTablePopUp
                                    analysisField="control_summary_rating"
                                    dashboardFile={dashboardfile!}
                                    filter="None"
                                    id="none_card"
                                    showRemediation={true}
                                    icon={<FlagIcon style={{ fontSize: 100 }} />}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container direction="row" spacing={1}>
                        <Grid item xs={12} sm="auto" md="auto" lg="auto">
                            <Typography variant="h4" className={classes.dashboardHeader}>
                                Control Relevance To Risk
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container direction="row" spacing={1}>
                        <Grid item xs={12} sm={6} md={3} lg={3}>
                            <CardTablePopUp
                                analysisField="relevance_to_risk"
                                dashboardFile={dashboardfile!}
                                filter="strong"
                                icon={<SecurityIcon style={{ fontSize: 90 }} />}
                                id="strong_risk_card"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3} lg={3}>
                            <CardTablePopUp
                                analysisField="relevance_to_risk"
                                dashboardFile={dashboardfile!}
                                filter="good"
                                icon={<ThumbUpIcon style={{ fontSize: 90 }} />}
                                id="good_risk_card"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3} lg={3}>
                            <CardTablePopUp
                                analysisField="relevance_to_risk"
                                dashboardFile={dashboardfile!}
                                filter="fair"
                                icon={<NotificationsIcon style={{ fontSize: 90 }} />}
                                id="fair_risk_card"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3} lg={3}>
                            <CardTablePopUp
                                analysisField="relevance_to_risk"
                                dashboardFile={dashboardfile!}
                                filter="poor"
                                id="poor_risk_card"
                                icon={<ErrorIcon style={{ fontSize: 90 }} />}
                            />
                        </Grid>
                        <Grid container direction="row" spacing={1}>
                            <Grid item xs={12} sm={12} md={12} lg={12}></Grid>
                        </Grid>
                    </Grid>
                    <Grid container direction="row" spacing={1}>
                        <Grid item xs={12} sm={12} md={12} lg="auto">
                            <Typography variant="h4" className={classes.dashboardHeader}>
                                Detailed Metrics
                            </Typography>
                        </Grid>
                    </Grid>
                    {createPieElements()}
                </div>
            )}
        </Box>
    );
};

export default Dashboard;
