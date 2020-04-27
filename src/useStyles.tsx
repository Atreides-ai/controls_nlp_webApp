import { green, red, grey } from '@material-ui/core/colors';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core';

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
        image: {
            backgroundImage: 'url(https://source.unsplash.com/8WFnEehJWso)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: theme.palette.primary.light,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
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
        circle: {
            display: 'flex',
            '& > * + *': {
                marginLeft: theme.spacing(2),
            },
            align: 'center',
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
            alignContent: 'center',
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
            height: 200,
            margin: 'auto',
            borderRadius: theme.spacing(2), // 16px
            transition: '0.3s',
            boxShadow: '0px 14px 80px rgba(34, 35, 58, 0.2)',
            position: 'relative',
            maxWidth: 500,
            marginLeft: 'auto',
            overflow: 'initial',
            background: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'top',
            paddingBottom: theme.spacing(-10),
            [theme.breakpoints.up('md')]: {
                flexDirection: 'row',
                padding: theme.spacing(2),
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
        },
    }),
);

export default useStyles;
