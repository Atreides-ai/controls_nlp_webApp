import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#607D8B',
            light: '#CFD8DC',
            dark: '#455A64',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#009688',
            light: '#484848',
            dark: '#000000',
            contrastText: '#FFFFFF',
        },
    },
});

export default theme;
