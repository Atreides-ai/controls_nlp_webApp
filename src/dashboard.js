import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
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
import PrintButton from 'PDF_Button';
import dashboardDescriptions from 'Dashboard_Descriptions';

Storage.configure({ level: 'private' });

export default function Dashboard() {
    const tableIcons = {
        Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
        Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
        Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
        Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
        DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
        Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
        Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
        Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
        FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
        LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
        NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
        PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
        ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
        Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
        SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
        ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
        ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
    };

    useEffect(() => {
        getFile();
    }, []);

    const classes = useStyles();
    const [dashboard, showDashboard] = useState(false);
    const [dashboardfile, setFile] = useState();

    const descriptions = dashboardDescriptions;

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
        <Box className={classes.root} id="dashboard">
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
                                id="fully_card"
                                icon={<StarIcon style={{ fontSize: 120 }} />}
                                header="Fully"
                                body={generateCardMetric(dashboardfile, 'control_summary_rating', 'Fully')}
                            ></DashboardCard>
                        </Grid>
                        <Grid item xs={12} sm="auto" md="auto" lg="auto">
                            <DashboardCard
                                id="mostly_card"
                                icon={<BuildIcon style={{ fontSize: 120 }} />}
                                header="Mostly"
                                body={generateCardMetric(dashboardfile, 'control_summary_rating', 'Mostly')}
                            ></DashboardCard>
                        </Grid>
                        <Grid item xs={12} sm="auto" md="auto" lg="auto">
                            <DashboardCard
                                id="partially_card"
                                icon={<BugReportIcon style={{ fontSize: 120 }} />}
                                header="Partially"
                                body={generateCardMetric(dashboardfile, 'control_summary_rating', 'Partially')}
                            ></DashboardCard>
                        </Grid>
                        <Grid item xs={12} sm="auto" md="auto" lg="auto">
                            <DashboardCard
                                id="poorly_card"
                                icon={<FeedbackIcon style={{ fontSize: 120 }} />}
                                header="Poorly"
                                body={generateCardMetric(dashboardfile, 'control_summary_rating', 'Poorly')}
                            ></DashboardCard>
                        </Grid>
                        <Grid item xs={12} sm="auto" md="auto" lg="auto">
                            <DashboardCard
                                id="none_card"
                                icon={<FlagIcon style={{ fontSize: 120 }} />}
                                header="None"
                                body={generateCardMetric(dashboardfile, 'control_summary_rating', 'None')}
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
                                id="strong_risk_card"
                                icon={<SecurityIcon style={{ fontSize: 120 }} />}
                                header="Strong"
                                body={generateCardMetric(dashboardfile, 'control_relevance_to_risk', 'strong')}
                            ></DashboardCard>
                        </Grid>
                        <Grid item xs={12} sm={3} md={3} lg={3}>
                            <DashboardCard
                                id="good_risk_card"
                                icon={<ThumbUpIcon style={{ fontSize: 120 }} />}
                                header="Good"
                                body={generateCardMetric(dashboardfile, 'control_relevance_to_risk', 'good')}
                            ></DashboardCard>
                        </Grid>
                        <Grid item xs={12} sm={3} md={3} lg={3}>
                            <DashboardCard
                                id="fair_risk_card"
                                icon={<NotificationsIcon style={{ fontSize: 120 }} />}
                                header="Fair"
                                body={generateCardMetric(dashboardfile, 'control_relevance_to_risk', 'fair')}
                            ></DashboardCard>
                        </Grid>
                        <Grid item xs={12} sm={3} md={3} lg={3}>
                            <DashboardCard
                                id="poor_risk_card"
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
