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

Storage.configure({ level: 'private' });

export default function Dashboard() {
    useEffect(() => {
        getFile();
    }, []);

    const classes = useStyles();
    const [dashboard, showDashboard] = useState(false);
    const [dashboardfile, setFile] = useState();

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

    const get_url = () => {
        const url = Storage.get('output.csv', { level: 'private' }, { expires: 60 });
        return url;
    };

    const countColumnValues = (file, column) => {
        const data_count = d3
            .nest()
            .key(function(d) {
                return d[column];
            })
            .rollup(function(leaves) {
                return leaves.length;
            })
            .entries(file);

        const output_data = formatData(data_count);
        const ordered_data = orderData(output_data);

        return ordered_data;
    };

    const formatData = data_count => {
        return data_count.map(function(obj) {
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

    const generatePie = (file, column) => {
        const data = countColumnValues(file, column);
        return data;
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
                    <Typography variant="h3">Control Relevance To Risk</Typography>
                    <Grid container direction="row" spacing={1}>
                        <Grid item xs={12} sm={3} md={3} lg={3}>
                            <DashboardCard
                                icon={<SecurityIcon style={{ fontSize: 150 }} />}
                                header="Strong"
                                body="123"
                            ></DashboardCard>
                        </Grid>
                        <Grid item xs={12} sm={3} md={3} lg={3}>
                            <DashboardCard
                                icon={<ThumbUpIcon style={{ fontSize: 150 }} />}
                                header="Good"
                                body="123"
                            ></DashboardCard>
                        </Grid>
                        <Grid item xs={12} sm={3} md={3} lg={3}>
                            <DashboardCard
                                icon={<NotificationsIcon style={{ fontSize: 150 }} />}
                                header="Fair"
                                body="123"
                            ></DashboardCard>
                        </Grid>
                        <Grid item xs={12} sm={3} md={3} lg={3}>
                            <DashboardCard
                                icon={<ErrorIcon style={{ fontSize: 150 }} />}
                                header="Poor"
                                body="123"
                            ></DashboardCard>
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
