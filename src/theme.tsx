import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#2196F3',
            light: '#BBDEFB',
            dark: '#1976D2',
            contrastText: '#212121',
        },
        secondary: {
            main: '#FF4081',
            contrastText: '#FFFFFF',
        },
    },
});

export default theme;
