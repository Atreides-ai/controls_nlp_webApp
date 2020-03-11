import { green, red } from "@material-ui/core/colors";
import { createStyles, withStyles } from "@material-ui/core/styles";
import { Theme } from '@material-ui/core';

const useStyles = (theme: Theme) => createStyles({
  root: {
    height: "100vh"
  },
  success: {
    backgroundColor: green[600]
  },
  error: {
    backgroundColor: red[800]
  },
  icon: {
    fontSize: 20
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1)
  },
  message: {
    display: "flex",
    alignItems: "center"
  },
  image: {
    backgroundImage: "url(https://source.unsplash.com/8WFnEehJWso)",
    backgroundRepeat: "no-repeat",
    backgroundColor: theme.palette.primary.light,
    backgroundSize: "cover",
    backgroundPosition: "center"
  },
  paper: {
    height: "30vh",
    margin: theme.spacing(1.5, 3),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  mui_form: {
    width: "100%",
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  card: {
    maxWidth: 600
  },
  media: {
    height: 500
  },
  circle: {
    display: "flex",
    "& > * + *": {
      marginLeft: theme.spacing(2)
    },
    align: "center"
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1,
    alignContent: "center"
  },
  pie: {
    height: 250,
    marginBottom: theme.spacing(2)
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  muiform: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    "&:focus": {
      borderColor: "primary.dark"
    }
  },
  muisubmit: {
    margin: theme.spacing(3, 0, 2),
    padding: theme.spacing(3, 2),
    background: "primary.main",
    "&:hover": {
      backgroundColor: "primary.dark"
    }
  },
  login: {
    padding: "0 30px",
    height: 200,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
  loginImage: {
    backgroundImage: "url(https://source.unsplash.com/rCbdp8VCYhQ)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh"
  },
  loginSurface: {
    height: "40vh",
    padding: "20px 10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "black"
  },
  table: {
    minWidth: 650
  }
});

export default withStyles(useStyles);
