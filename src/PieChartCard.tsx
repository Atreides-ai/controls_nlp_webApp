import React from 'react';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import useStyles from './useStyles';
import { Typography, Divider } from '@material-ui/core';

const PieChartCard = (props: { chart: JSX.Element; header: string; body: string; id: string }): JSX.Element => {
    const classes = useStyles();
    return (
        <div id={props.id}>
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
                </CardContent>
            </Card>
        </div>
    );
};

export default PieChartCard;
