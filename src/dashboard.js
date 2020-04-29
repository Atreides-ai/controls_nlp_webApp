import React, { useState, useEffect } from 'react';
import { Storage } from 'aws-amplify';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import * as d3 from 'd3';
import CircularProgress from '@material-ui/core/CircularProgress';
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

Storage.configure({ level: 'private' });

export default function Dashboard() {
    useEffect(() => {
        getFile();
    }, []);

    const classes = useStyles();
    const [dashboard, showDashboard] = useState(false);
    const [dashboardfile, setFile] = useState();

    /**
     * Downloads the file from s3 by recursively calling until it is found
     *
     */
    const getFile = async () => {
        get_url()
            .catch(err => getFile())
            .then(function(url) {
                d3.csv(url)
                    .then(function(file) {
                        setFile(file);
                        showDashboard(true);
                    })
                    .catch(err => setTimeout(getFile(), 60000));
            });
    };

    /**
     * gets the output file signed url from s3 using Amplify Storage.get
     *
     * @returns {string} url
     */
    const get_url = () => {
        const url = Storage.get('output.csv', { level: 'private' }, { expires: 60 });
        return url;
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
        const rawData = formatData(dataCount);
        const orderedData = orderData(rawData);
        return orderedData;
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

        console.log(fieldCount);

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
                        <CSVLink data={dashboardfile} filename="Analysis.csv">
                            <IconButton edge="start" color="secondary">
                                <CloudDownloadIcon></CloudDownloadIcon>
                            </IconButton>
                        </CSVLink>
                    )}
                    <Typography variant="h6" className={classes.title} align="center">
                        Atreides Controls NLP Dashboard
                    </Typography>
                    <Copyright align="right" color="secondary"></Copyright>
                </Toolbar>
            </AppBar>
            {dashboard === false && (
                <div className={classes.circle} align="centre">
                    <CircularProgress size={40} left={-20} top={10} style={{ marginLeft: '50%' }} />
                </div>
            )}
            {dashboard && (
                <div className={classes.root}>
                    <Grid container direction="row" spacing={1}>
                        <Grid item xs={12} sm={12} md={12} lg="auto">
                            <Divider variant="middle" />
                            <Typography variant="h4" className={classes.dashboardHeader}>
                                Overall Control Scores
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container direction="row" spacing={5} justify="center">
                        <Grid item xs={12} sm="auto" md="auto" lg="auto">
                            <DashboardCard
                                icon={<StarIcon style={{ fontSize: 120 }} />}
                                header="cat1"
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
                                header="Good"
                                body={generateCardMetric(dashboardfile, 'control_summary_rating', 'Requirements Met')}
                            ></DashboardCard>
                        </Grid>
                        <Grid item xs={12} sm="auto" md="auto" lg="auto">
                            <DashboardCard
                                icon={<BugReportIcon style={{ fontSize: 120 }} />}
                                header="Fair"
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
                                header="Poor"
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
                                header="Poor"
                                body={generateCardMetric(
                                    dashboardfile,
                                    'control_summary_rating',
                                    'No Requirements Met',
                                )}
                            ></DashboardCard>
                        </Grid>
                    </Grid>
                    <Grid container direction="row" spacing={1}>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <Divider variant="middle" />
                            <Typography variant="h4" className={classes.dashboardHeader}>
                                Control Relevance To Risk
                            </Typography>
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
                            <div className={classes.pie}>
                                <Typography variant="h6" align="center">
                                    Control Method?
                                </Typography>
                                <MyResponsivePie
                                    id="automated_manual_pie"
                                    data={generatePie(dashboardfile, 'Control Method')}
                                />
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={4} md={4} lg={4}>
                            <div className={classes.pie}>
                                <Typography variant="h6" align="center">
                                    Contains What?
                                </Typography>
                                <MyResponsivePie
                                    id="contains_what_pie"
                                    data={generatePie(dashboardfile, 'contains_whats')}
                                />
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={4} md={4} lg={4}>
                            <div className={classes.pie}>
                                <Typography variant="h6" align="center">
                                    Contains How?
                                </Typography>
                                <MyResponsivePie
                                    id="contains_how_pie"
                                    data={generatePie(dashboardfile, 'contains_hows')}
                                />
                            </div>
                        </Grid>
                    </Grid>
                    <Grid container direction="row" spacing={1}>
                        <Grid item xs={12} sm={4} md={4} lg={4}>
                            <div className={classes.pie}>
                                <Typography variant="h6" align="center">
                                    Contains Multiple Whos?
                                </Typography>
                                <MyResponsivePie
                                    id="multiple_who_pie"
                                    data={generatePie(dashboardfile, 'multiple_whos')}
                                />
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={4} md={4} lg={4}>
                            <div className={classes.pie}>
                                <Typography variant="h6" align="center">
                                    Contains Multiple Whats?
                                </Typography>
                                <MyResponsivePie
                                    id="multiple_what_pie"
                                    data={generatePie(dashboardfile, 'multiple_whats')}
                                />
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={4} md={4} lg={4}>
                            <div className={classes.pie}>
                                <Typography variant="h6" align="center">
                                    Contains Multiple Hows?
                                </Typography>
                                <MyResponsivePie
                                    id="multiple_how_pie"
                                    data={generatePie(dashboardfile, 'multiple_hows')}
                                />
                            </div>
                        </Grid>
                    </Grid>
                    <Grid container direction="row" spacing={1}>
                        <Grid item xs={12} sm={4} md={4} lg={4}>
                            <div className={classes.pie}>
                                <Typography variant="h6" align="center">
                                    Contains Who?
                                </Typography>
                                <MyResponsivePie
                                    id="contains_who_pie"
                                    data={generatePie(dashboardfile, 'contains_whos')}
                                />
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={4} md={4} lg={4}>
                            <div className={classes.pie}>
                                <Typography variant="h6" align="center">
                                    Contains When?
                                </Typography>
                                <MyResponsivePie
                                    id="when_piechart"
                                    data={generatePie(dashboardfile, 'contains_whens')}
                                />
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={4} md={4} lg={4}>
                            <div className={classes.pie}>
                                <Typography variant="h6" align="center">
                                    Contains Multiple Whens?
                                </Typography>
                                <MyResponsivePie
                                    id="multiple_whens_pie"
                                    data={generatePie(dashboardfile, 'multiple_whens')}
                                />
                            </div>
                        </Grid>
                    </Grid>
                </div>
            )}
        </Box>
    );
}
