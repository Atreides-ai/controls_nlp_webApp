import React, { useState, useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { Storage } from 'aws-amplify';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
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
import DashboardCard from './Dashboard_Card';
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
import MaterialTable, { Column } from 'material-table';
import DataTablePopUp from './DataTablePopUp';
import { forwardRef } from 'react';
import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import axios from 'axios';
import tableIcons from './tableIcons';

Storage.configure({ level: 'private' });

export default function Dashboard(jobId, token, apiKey) {
    useEffect(() => {
        getFile();
    }, []);

    const classes = useStyles();
    const [dashboard, showDashboard] = useState(false);
    const [dashboardfile, setFile] = useState();
    const baseUrl = 'https://api.atreides.ai/dev/atreides-app/controls-nlp/v1';
    const [progress, setProgress] = useState(0);
    const [waitMessage, showWaitMessage] = useState(false);
    const [ackWaitMessage, setAckWaitMessage] = useState(false);

    const handleClose = () => {
        showWaitMessage(false);
        setAckWaitMessage(true);
    };

    /**
     * Polls the API at 30 second intervals to check job status
     *
     */
    const getFile = async e => {
        url = baseUrl + '/get_results';
        const headers = { headers: { 'x-api-key': apiKey, Authorization: token } };
        const interval = setInterval(() => {
            axios.get(url, jobId, headers).then(response => {
                if (response.status === 200) {
                    setProgress(100);
                    showWaitMessage(false);
                    setFile(response.data);
                    clearInterval(interval);
                }
                if (response.status === 202) {
                    if (progress < 100) {
                        setProgress(progress + 10);
                    } else if (!ackWaitMessage) {
                        showWaitMessage(true);
                    }
                }
                if (response.status === 400 || 403 || 404) {
                    // show some error message
                    clearInterval(interval);
                }
            });
        }, 30000);
    };

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
            if (obj['id'] === 'True') {
                obj['color'] = '#7C4DFF';
            } else if (obj['id'] === 'False') {
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
            if (element != undefined) {
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
        console.log(dataCount);
        if (dataCount[0]['key'] != 'undefined') {
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
            return el['key'] == key;
        });

        if (fieldCount[0] != undefined) {
            return fieldCount[0]['value'].toString();
        }

        return '0';
    };

    return (
        <Box className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    {dashboard && (
                        <div>
                            <Grid container direction="row" spacing={1}>
                                <Grid item xs="auto" sm="auto" md="auto" lg="auto">
                                    <CSVLink data={dashboardfile} filename="Analysis.csv">
                                        <IconButton edge="start" color="secondary">
                                            <CloudDownloadIcon></CloudDownloadIcon>
                                        </IconButton>
                                    </CSVLink>
                                </Grid>
                                <Grid item xs="auto" sm="auto" md="auto" lg="auto">
                                    <CSVLink data={dashboardfile} filename="Analysis.csv">
                                        <Button variant="outlined" color="secondary" className={classes.summaryButton}>
                                            Download All Results
                                        </Button>
                                    </CSVLink>
                                </Grid>
                            </Grid>
                        </div>
                    )}
                    <Typography variant="h6" className={classes.title} align="center">
                        Atreides Controls NLP Dashboard
                    </Typography>
                    <Copyright align="right" color="secondary"></Copyright>
                </Toolbar>
            </AppBar>
            {dashboard === false && (
                <div className={classes.progress} align="centre">
                    <LinearProgress
                        variant="determinate"
                        value={progress}
                        left={-20}
                        top={10}
                        style={{ marginLeft: '50%' }}
                    />
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
                </div>
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
                        <Grid item xs={12} sm={2} md={2} lg={2}>
                            <DataTablePopUp
                                table={
                                    <MaterialTable
                                        options={{
                                            exportButton: true,
                                        }}
                                        icons={tableIcons}
                                        columns={[
                                            { title: 'Control Description', field: 'Control Description' },
                                            { title: 'Overall Score', field: 'control_summary_rating' },
                                        ]}
                                        data={dashboardfile}
                                        title="Analysis Summary"
                                    />
                                }
                            />
                        </Grid>
                    </Grid>
                    <Grid container direction="row" spacing={3} justify="center">
                        <Grid item xs={12} sm="auto" md="auto" lg="auto">
                            <DashboardCard
                                icon={<StarIcon style={{ fontSize: 120 }} />}
                                header="Fully"
                                body={generateCardMetric(
                                    dashboardfile,
                                    'control_summary_rating',
                                    'Requirements Met Fully',
                                )}
                            ></DashboardCard>
                        </Grid>
                        <Grid item xs={12} sm="auto" md="auto" lg="auto">
                            <DashboardCard
                                icon={<BuildIcon style={{ fontSize: 120 }} />}
                                header="Mostly"
                                body={generateCardMetric(dashboardfile, 'control_summary_rating', 'Requirements Met')}
                            ></DashboardCard>
                        </Grid>
                        <Grid item xs={12} sm="auto" md="auto" lg="auto">
                            <DashboardCard
                                icon={<BugReportIcon style={{ fontSize: 120 }} />}
                                header="Partially"
                                body={generateCardMetric(
                                    dashboardfile,
                                    'control_summary_rating',
                                    'Requirements Partially Met',
                                )}
                            ></DashboardCard>
                        </Grid>
                        <Grid item xs={12} sm="auto" md="auto" lg="auto">
                            <DashboardCard
                                icon={<FeedbackIcon style={{ fontSize: 120 }} />}
                                header="Poorly"
                                body={generateCardMetric(
                                    dashboardfile,
                                    'control_summary_rating',
                                    'Requirements Substantially Not Met',
                                )}
                            ></DashboardCard>
                        </Grid>
                        <Grid item xs={12} sm="auto" md="auto" lg="auto">
                            <DashboardCard
                                icon={<FlagIcon style={{ fontSize: 120 }} />}
                                header="None"
                                body={generateCardMetric(
                                    dashboardfile,
                                    'control_summary_rating',
                                    'No Requirements Met',
                                )}
                            ></DashboardCard>
                        </Grid>
                    </Grid>
                    <Grid container direction="row" spacing={1}>
                        <Grid item xs={12} sm="auto" md="auto" lg="auto">
                            <Divider variant="middle" />
                            <Typography variant="h4" className={classes.dashboardHeader}>
                                Control Relevance To Risk
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2} md={2} lg={2}>
                            <DataTablePopUp
                                table={
                                    <MaterialTable
                                        options={{
                                            exportButton: true,
                                        }}
                                        icons={tableIcons}
                                        columns={[
                                            { title: 'Control Description', field: 'Control Description' },
                                            { title: 'Risk Description', field: 'Risk Description' },
                                            { title: 'Control Relevance To Risk', field: 'control_relevance_to_risk' },
                                        ]}
                                        data={dashboardfile}
                                        title="Analysis Summary"
                                    />
                                }
                            />
                        </Grid>
                    </Grid>
                    <Grid container direction="row" spacing={1}>
                        <Grid item xs={12} sm={3} md={3} lg={3}>
                            <DashboardCard
                                icon={<SecurityIcon style={{ fontSize: 120 }} />}
                                header="Strong"
                                body={generateCardMetric(dashboardfile, 'control_relevance_to_risk', 'strong')}
                            ></DashboardCard>
                        </Grid>
                        <Grid item xs={12} sm={3} md={3} lg={3}>
                            <DashboardCard
                                icon={<ThumbUpIcon style={{ fontSize: 120 }} />}
                                header="Good"
                                body={generateCardMetric(dashboardfile, 'control_relevance_to_risk', 'good')}
                            ></DashboardCard>
                        </Grid>
                        <Grid item xs={12} sm={3} md={3} lg={3}>
                            <DashboardCard
                                icon={<NotificationsIcon style={{ fontSize: 120 }} />}
                                header="Fair"
                                body={generateCardMetric(dashboardfile, 'control_relevance_to_risk', 'fair')}
                            ></DashboardCard>
                        </Grid>
                        <Grid item xs={12} sm={3} md={3} lg={3}>
                            <DashboardCard
                                icon={<ErrorIcon style={{ fontSize: 120 }} />}
                                header="Poor"
                                body={generateCardMetric(dashboardfile, 'control_relevance_to_risk', 'poor')}
                            ></DashboardCard>
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
                                chart={
                                    <MyResponsivePie
                                        id="automated_manual_pie"
                                        data={generatePie(dashboardfile, 'Control Method')}
                                    />
                                }
                                table={
                                    <DataTablePopUp
                                        table={
                                            <MaterialTable
                                                options={{
                                                    exportButton: true,
                                                }}
                                                icons={tableIcons}
                                                columns={[
                                                    { title: 'Control Description', field: 'Control Description' },
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
                                chart={
                                    <MyResponsivePie
                                        id="contains_what_pie"
                                        data={generatePie(dashboardfile, 'contains_whats')}
                                    />
                                }
                                table={
                                    <DataTablePopUp
                                        table={
                                            <MaterialTable
                                                options={{
                                                    exportButton: true,
                                                }}
                                                icons={tableIcons}
                                                columns={[
                                                    { title: 'Control Description', field: 'Control Description' },
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
                                chart={
                                    <MyResponsivePie
                                        id="contains_how_pie"
                                        data={generatePie(dashboardfile, 'contains_hows')}
                                    />
                                }
                                table={
                                    <DataTablePopUp
                                        table={
                                            <MaterialTable
                                                options={{
                                                    exportButton: true,
                                                }}
                                                icons={tableIcons}
                                                columns={[
                                                    { title: 'Control Description', field: 'Control Description' },
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
                                chart={
                                    <MyResponsivePie
                                        id="contains_who_pie"
                                        data={generatePie(dashboardfile, 'contains_whos')}
                                    />
                                }
                                table={
                                    <DataTablePopUp
                                        table={
                                            <MaterialTable
                                                options={{
                                                    exportButton: true,
                                                }}
                                                icons={tableIcons}
                                                columns={[
                                                    { title: 'Control Description', field: 'Control Description' },
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
                                chart={
                                    <MyResponsivePie
                                        id="when_piechart"
                                        data={generatePie(dashboardfile, 'contains_whens')}
                                    />
                                }
                                table={
                                    <DataTablePopUp
                                        table={
                                            <MaterialTable
                                                options={{
                                                    exportButton: true,
                                                }}
                                                icons={tableIcons}
                                                columns={[
                                                    { title: 'Control Description', field: 'Control Description' },
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
                                chart={
                                    <MyResponsivePie
                                        id="multiple_what_pie"
                                        data={generatePie(dashboardfile, 'multiple_whats')}
                                    />
                                }
                                table={
                                    <DataTablePopUp
                                        table={
                                            <MaterialTable
                                                options={{
                                                    exportButton: true,
                                                }}
                                                icons={tableIcons}
                                                columns={[
                                                    { title: 'Control Description', field: 'Control Description' },
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
                                chart={
                                    <MyResponsivePie
                                        id="multiple_how_pie"
                                        data={generatePie(dashboardfile, 'multiple_hows')}
                                    />
                                }
                                table={
                                    <DataTablePopUp
                                        table={
                                            <MaterialTable
                                                options={{
                                                    exportButton: true,
                                                }}
                                                icons={tableIcons}
                                                columns={[
                                                    { title: 'Control Description', field: 'Control Description' },
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
                                chart={
                                    <MyResponsivePie
                                        id="multiple_who_pie"
                                        data={generatePie(dashboardfile, 'multiple_whos')}
                                    />
                                }
                                table={
                                    <DataTablePopUp
                                        table={
                                            <MaterialTable
                                                options={{
                                                    exportButton: true,
                                                }}
                                                icons={tableIcons}
                                                columns={[
                                                    { title: 'Control Description', field: 'Control Description' },
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
                                chart={
                                    <MyResponsivePie
                                        id="multiple_whens_pie"
                                        data={generatePie(dashboardfile, 'multiple_whens')}
                                    />
                                }
                                table={
                                    <DataTablePopUp
                                        table={
                                            <MaterialTable
                                                options={{
                                                    exportButton: true,
                                                }}
                                                icons={tableIcons}
                                                columns={[
                                                    { title: 'Control Description', field: 'Control Description' },
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
