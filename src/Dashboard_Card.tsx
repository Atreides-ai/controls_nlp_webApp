import React from 'react';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import useStyles from './useStyles';

const DashboardCard = (props: { icon: JSX.Element; header: string; body: string; id: string }): JSX.Element => {
    const classes = useStyles();
    return (
        <div id={props.id}>
            <Card className={classes.cardRoot}>
                <CardMedia className={classes.cardMedia}>{props.icon}</CardMedia>
                <CardContent>
                    <Typography variant="h4" className={classes.title} color="primary">
                        {props.header}
                    </Typography>
                    <Typography variant="h2" className={classes.title} color="secondary">
                        {props.body}
                    </Typography>
                </CardContent>
            </Card>
        </div>
    );
};

export default DashboardCard;
