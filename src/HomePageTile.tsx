import React from 'react';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import useStyles from './useStyles';
import { CardActions, CardActionArea, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';

const HomePageTile = (props: {
    imagePath: string;
    header: string;
    body: string;
    buttonText: string;
    module: string;
}): JSX.Element => {
    const classes = useStyles();
    return (
        <Card className={classes.homePageCard}>
            <CardActionArea>
                <CardMedia component="img" height="140" image={props.imagePath} />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {props.header}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {props.body}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <Link to={props.module} style={{ textDecoration: 'none' }}>
                    <Button variant="contained" size="small" color="secondary">
                        {props.buttonText}
                    </Button>
                </Link>
            </CardActions>
        </Card>
    );
};

export default HomePageTile;
