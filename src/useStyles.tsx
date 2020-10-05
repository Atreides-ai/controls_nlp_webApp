import { green, red } from '@material-ui/core/colors';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            height: '100vh',
        },
        success: {
            backgroundColor: green[600],
        },
        error: {
            backgroundColor: red[800],
        },
        icon: {
            fontSize: 20,
        },
        iconVariant: {
            opacity: 0.9,
            marginRight: theme.spacing(1),
        },
        message: {
            display: 'flex',
            alignItems: 'center',
        },
        paper: {
            margin: theme.spacing(1.5, 3),
            display: 'flex',
            alignItems: 'center',
        },
        mui_form: {
            width: '100%',
            marginTop: theme.spacing(1),
        },
        submit: {
            margin: theme.spacing(3, 0, 2),
        },
        card: {
            maxWidth: 600,
        },
        media: {
            height: 500,
        },
        progress: {
            '& > * + *': {
                marginLeft: theme.spacing(2),
            },
            align: 'center',
            width: '100%',
            marginTop: theme.spacing(15),
            flexDirection: 'column',
            alignItems: 'center',
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
        },
        pie: {
            height: 250,
            marginBottom: theme.spacing(2),
        },
        avatar: {
            margin: theme.spacing(1),
            backgroundColor: theme.palette.primary.main,
        },
        muiform: {
            width: '100%', // Fix IE 11 issue.
            marginTop: theme.spacing(1),
        },
        muisubmit: {
            margin: theme.spacing(3, 0, 2),
        },
        loginSurface: {
            marginTop: theme.spacing(8),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        table: {
            minWidth: 650,
        },
        cardRoot: {
            height: 170,
            borderRadius: theme.spacing(2), // 16px
            transition: '0.3s',
            position: 'relative',
            maxWidth: 500,
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            overflow: 'initial',
            background: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'top',
            paddingBottom: theme.spacing(-10),
            marginBottom: theme.spacing(2),
            [theme.breakpoints.up('lg')]: {
                flexDirection: 'row',
                padding: theme.spacing(2),
            },
            [theme.breakpoints.down('md')]: {
                flexDirection: 'column',
                padding: theme.spacing(2),
                height: 300,
            },
        },
        cardMedia: {
            width: '88%',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: theme.spacing(-3),
            height: 0,
            paddingBottom: '48%',
            borderRadius: theme.spacing(2),
            backgroundColor: '#fff',
            position: 'relative',
            [theme.breakpoints.up('md')]: {
                width: '100%',
                marginLeft: theme.spacing(2),
                marginTop: 0,
                transform: 'translateX(-8px)',
            },
            '&:after': {
                content: '" "',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: theme.spacing(2), // 16
                opacity: 0.5,
            },
            [theme.breakpoints.down('md')]: {
                paddingTop: '0%',
                paddingBottom: '50%',
            },
        },
        dashboardHeader: {
            marginLeft: theme.spacing(2),
            marginBottom: theme.spacing(2),
            marginTop: theme.spacing(2),
        },
        centerGrid: {
            flexGrow: 1,
            alignItems: 'center',
        },
        pieCardRoot: {
            flexDirection: 'column',
            maxWidth: 500,
            margin: 'auto',
            borderRadius: 12,
            padding: 12,
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
        },
        pieCardmedia: {
            borderRadius: 6,
        },
        summaryButton: {
            marginTop: theme.spacing(1),
        },
        appPageRoot: {
            display: 'flex',
        },
        appBar: {
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        },
        appBarShift: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        hide: {
            display: 'none',
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
        },
        drawerHeader: {
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing(0, 1),
            // necessary for content to be below app bar
            ...theme.mixins.toolbar,
            justifyContent: 'flex-end',
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: -drawerWidth,
        },
        contentShift: {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        },
        homePageCard: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            maxWidth: 500,
        },
        homePageSurface: {
            marginTop: '5%',
            marginLeft: '5%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
        },
        atreidesLogo: {
            marginLeft: '30%',
        },
    }),
);

export default useStyles;
