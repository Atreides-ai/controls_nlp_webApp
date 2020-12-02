import React from 'react';
import useStyles from './useStyles';
import { Grid, Container } from '@material-ui/core';
import HomePageTile from './HomePageTile';
import controls from './img_resources/controls.jpg';
import policy from './img_resources/policy.jpg';
import risk from './img_resources/risk.jpg';
import AtreidesLogo from './AtreidesLogo';

const HomePage = (): JSX.Element => {
    const classes = useStyles();
    return (
        <Container component="main">
            <Grid container direction="row" spacing={1}>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <AtreidesLogo></AtreidesLogo>
                </Grid>
            </Grid>
            <div className={classes.homePageSurface}>
                <Grid container direction="row" spacing={4}>
                    <Grid item xs={12} sm={4} md={4} lg={4}>
                        <HomePageTile
                            imagePath={controls}
                            header="Controls"
                            body="Automatically analyze and quality assure your controls."
                            buttonText="Enter"
                            module="/controlSubmitFile"
                        ></HomePageTile>
                    </Grid>
                    <Grid item xs={12} sm={4} md={4} lg={4}>
                        <HomePageTile
                            imagePath={policy}
                            header="Policy"
                            body="Automatically compare policies against your controls."
                            buttonText="Coming Soon"
                            module="/home"
                        ></HomePageTile>
                    </Grid>
                    <Grid item xs={12} sm={4} md={4} lg={4}>
                        <HomePageTile
                            imagePath={risk}
                            header="Risk"
                            body="Automatically check for missing controls against risk."
                            buttonText="Coming Soon"
                            module="/home"
                        ></HomePageTile>
                    </Grid>
                </Grid>
            </div>
        </Container>
    );
};

export default HomePage;
