import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#212121',
            light: '#484848',
            dark: '#000000',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#e64a19',
            light: '#ff7d47',
            dark: '#ac0800',
            contrastText: '#000000',
        },
    },
});

export default theme;
