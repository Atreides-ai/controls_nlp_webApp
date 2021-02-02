import React from 'react';
import clsx from 'clsx';
import useStyles from './useStyles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { useTheme } from '@material-ui/core/styles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Link } from 'react-router-dom';
import SignOut from './sign_out';
import { Button, Grid } from '@material-ui/core';

const AppLayout = (props: {
    pageTitle: string;
    listItems: string[];
    listIcons: JSX.Element[];
    linkList: string[];
    coreElement: JSX.Element;
}): JSX.Element => {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <div className={classes.appPageRoot}>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, open && classes.hide)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Grid container direction="row" spacing={1} justify="flex-start">
                        <Grid item xs={12} sm="auto" md="auto" lg="auto">
                            <Typography variant="h6" noWrap align="center">
                                {props.pageTitle}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container direction="row" spacing={1} justify="flex-end">
                        <Grid item xs={12} sm="auto" md="auto" lg="auto">
                            <SignOut />
                        </Grid>
                        <Grid item xs={12} sm="auto" md="auto" lg="auto">
                            <Button variant="contained" size="small" color="secondary" href="https://www.atreides.ai/">
                                About us
                            </Button>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    {props.listItems.map((text, index) => (
                        // eslint-disable-next-line react/jsx-key
                        <Link to={props.linkList[index]} style={{ textDecoration: 'none' }}>
                            <ListItem button key={text}>
                                <ListItemIcon>{props.listIcons[index]}</ListItemIcon>
                                <ListItemText primary={<Typography color="primary">{text}</Typography>} />
                            </ListItem>
                        </Link>
                    ))}
                </List>
            </Drawer>
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: open,
                })}
            >
                <div className={classes.drawerHeader} />
                {props.coreElement}
            </main>
        </div>
    );
};

export default AppLayout;
