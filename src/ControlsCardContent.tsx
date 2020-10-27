import React from 'react';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import useStyles from './useStyles';
import { generateCardMetric } from './utils/AtreidesDataUtils';
import { Box } from '@material-ui/core';

const ControlsCardContent = (props: {
    icon: JSX.Element;
    header: string;
    file: Array<object>;
    column: string;
}): JSX.Element => {
    const classes = useStyles();

    return (
        <Card className={classes.cardRoot}>
            <CardMedia className={classes.cardMedia}>{props.icon}</CardMedia>
            <CardContent>
                <Typography variant="h4" className={classes.title} color="primary">
                    {props.header}
                </Typography>
                <Typography variant="h2" className={classes.title} color="secondary">
                    {generateCardMetric(props.file, props.column, props.header)}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default ControlsCardContent;
