import React from 'react';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import useStyles from './useStyles';
import { Typography, Divider } from '@material-ui/core';
import DataTablePopUp from 'DataTablePopUp';

const PieChartCard = (props: { chart: JSX.Element; table: JSX.Element; header: string; body: string }): JSX.Element => {
    const classes = useStyles();
    return (
        <Card className={classes.pieCardRoot}>
            <CardMedia className={classes.pieCardmedia}>
                <div className={classes.pie}>{props.chart}</div>
            </CardMedia>
            <CardContent>
                <Typography variant="h5" className={classes.title} color="primary">
                    {props.header}
                </Typography>
                <Divider variant="middle"></Divider>
                <Typography variant="body1" color="secondary">
                    {props.body}
                </Typography>
                {props.table}
            </CardContent>
        </Card>
    );
};

export default PieChartCard;
