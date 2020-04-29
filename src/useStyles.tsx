import { green, red } from '@material-ui/core/colors';
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
        paper: {
            height: '30vh',
            margin: theme.spacing(1.5, 3),
            display: 'flex',
            flexDirection: 'column',
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
    }),
);

export default useStyles;
