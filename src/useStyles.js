import { green } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  root: {
    height: "100vh"
  },
  success: {
    backgroundColor: green[600]
  },
  error: {
    backgroundColor: theme.palette.error.dark
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
    backgroundColor:
      theme.palette.type === "dark"
        ? theme.palette.grey[900]
        : theme.palette.grey[50],
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
  form: {
    width: "100%", // Fix IE 11 issue.
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
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    "&:focus": {
      borderColor: "primary.dark"
    }
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    background: "primary.main",
    "&:hover": {
      backgroundColor: "primary.dark"
    }
  }
}));

export default useStyles;
