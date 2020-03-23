import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#000000',
            light: '#CFD8DC',
            dark: '#455A64',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#7C4DFF',
            contrastText: '#212121',
        },
    },
});

export default theme;
