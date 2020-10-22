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
import MyResponsivePie from './pieConfig';
import useStyles from './useStyles';
import Typography from '@material-ui/core/Typography';
import 'typeface-roboto';
import 'array.prototype.move';
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
import ControlsCSVDownload from 'ControlsCSVDownload';
import d3 from 'd3';

const Dashboard = (props: { jobId: string; token: string; apiKey: string }): JSX.Element => {
    const classes = useStyles();
    const [dashboard, showDashboard] = useState(false);
    const [dashboardfile, setFile] = useState();
    const baseUrl = process.env.REACT_APP_ENDPOINT;
    const [progress, setProgress] = useState(0);
    const [errorMessage, showErrorMessage] = useState(false);
    const [limitMessage, showLimitMessage] = useState(false);
    const descriptions = dashboardDescriptions;

    const handleClose = (): void => {
        showErrorMessage(false);
        showLimitMessage(false);
    };

    /**
     * Polls the API at 30 second intervals to check job status
     *
     */
    const getFile = async (jobId: string, apiKey: string, token: string): void => {
        const url = baseUrl + '/get_results/' + jobId;
        const headers = { headers: { 'x-api-key': apiKey, Authorization: token } };
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

    useEffect(() => getFile(props.jobId, props.apiKey, props.token));

    
  
    return (
        <Box className={classes.root} id="dashboard">
            {dashboard && (
                <Grid container direction="row" spacing={1}>
                    <Grid item xs="auto" sm="auto" md="auto" lg="auto">
                        <ControlsCSVDownload dashboardFile={dashboardfile!} />
                    </Grid>
                    <Grid item xs="auto" sm="auto" md="auto" lg="auto">
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
                            <Divider variant="middle" />
                            <Typography variant="h4" className={classes.dashboardHeader}>
                                How well do the controls cover the design requirements?
                            </Typography>
                        </Grid>
                        <Grid container direction="row" spacing={3} justify="center">
                            <Grid item xs={12} sm="auto" md="auto" lg="auto">
                                <CardTablePopUp
                                    id="fully_card"
                                    icon={<StarIcon style={{ fontSize: 120 }} />}
                                    analysisField="control_summary_rating"
                                    dashboardFile={dashboardfile!}
                                    filter="Fully"
                                    showRemediation={true}
                                />
                            </Grid>
                            <Grid item xs={12} sm="auto" md="auto" lg="auto">
                                <CardTablePopUp
                                    analysisField="control_summary_rating"
                                    dashboardFile={dashboardfile!}
                                    filter="Mostly"
                                    id="mostly_card"
                                    showRemediation={true}
                                    icon={<BuildIcon style={{ fontSize: 120 }} />}
                                />
                            </Grid>
                            <Grid item xs={12} sm="auto" md="auto" lg="auto">
                                <CardTablePopUp
                                    analysisField="control_summary_rating"
                                    dashboardFile={dashboardfile!}
                                    filter="Partially"
                                    icon={<BugReportIcon style={{ fontSize: 120 }} />}
                                    id="partially_card"
                                    showRemediation={true}
                                />
                            </Grid>
                            <Grid item xs={12} sm="auto" md="auto" lg="auto">
                                <CardTablePopUp
                                    analysisField="control_summary_rating"
                                    icon={<FeedbackIcon style={{ fontSize: 120 }} />}
                                    dashboardFile={dashboardfile!}
                                    filter="Poorly"
                                    id="poorly_card"
                                    showRemediation={true}
                                />
                            </Grid>
                            <Grid item xs={12} sm="auto" md="auto" lg="auto">
                                <CardTablePopUp
                                    analysisField="control_summary_rating"
                                    dashboardFile={dashboardfile!}
                                    filter="None"
                                    id="none_card"
                                    showRemediation={true}
                                    icon={<FlagIcon style={{ fontSize: 120 }} />}
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
                                dashboardFile={dashboardfile!}
                                filter="strong"
                                icon={<SecurityIcon style={{ fontSize: 120 }} />}
                                id="strong_risk_card"
                            />
                        </Grid>
                        <Grid item xs={12} sm={3} md={3} lg={3}>
                            <CardTablePopUp
                                analysisField="relevance_to_risk"
                                dashboardFile={dashboardfile!}
                                filter="good"
                                icon={<ThumbUpIcon style={{ fontSize: 120 }} />}
                                id="good_risk_card"
                            />
                        </Grid>
                        <Grid item xs={12} sm={3} md={3} lg={3}>
                            <CardTablePopUp
                                analysisField="relevance_to_risk"
                                dashboardFile={dashboardfile!}
                                filter="fair"
                                icon={<NotificationsIcon style={{ fontSize: 120 }} />}
                                id="fair_risk_card"
                            />
                        </Grid>
                        <Grid item xs={12} sm={3} md={3} lg={3}>
                            <CardTablePopUp
                                analysisField="relevance_to_risk"
                                dashboardFile={dashboardfile!}
                                filter="poor"
                                id="poor_risk_card"
                                icon={<ErrorIcon style={{ fontSize: 120 }} />}
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
                                chart={<MyResponsivePie data={generatePie(dashboardfile!, 'Control Method')} />}
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
                                                data={dashboardfile!}
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
                                chart={<MyResponsivePie data={generatePie(dashboardfile!, 'contains_whats')} />}
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
                                                data={dashboardfile!}
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
                                chart={<MyResponsivePie data={generatePie(dashboardfile!, 'contains_hows')} />}
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
                                                data={dashboardfile!}
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
                                chart={<MyResponsivePie data={generatePie(dashboardfile!, 'contains_whos')} />}
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
                                                data={dashboardfile!}
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
                                chart={<MyResponsivePie data={generatePie(dashboardfile!, 'contains_whens')} />}
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
                                                data={dashboardfile!}
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
                                chart={<MyResponsivePie data={generatePie(dashboardfile!, 'multiple_whats')} />}
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
                                                data={dashboardfile!}
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
                                chart={<MyResponsivePie data={generatePie(dashboardfile!, 'multiple_hows')} />}
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
                                                data={dashboardfile!}
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
                                chart={<MyResponsivePie data={generatePie(dashboardfile!, 'multiple_whos')} />}
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
                                                data={dashboardfile!}
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
                                chart={<MyResponsivePie data={generatePie(dashboardfile!, 'multiple_whens')} />}
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
                                                data={dashboardfile!}
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
};

export default Dashboard;
