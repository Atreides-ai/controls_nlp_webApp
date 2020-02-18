import React, { useState, useEffect } from "react";
import { Storage } from "aws-amplify";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import * as d3 from "d3";
import CircularProgress from "@material-ui/core/CircularProgress";
import MyResponsivePie from "./pieConfig";
import useStyles from "./useStyles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import Typography from "@material-ui/core/Typography";
import "typeface-roboto";
import Copyright from "./copyright";

Storage.configure({ level: "private" });

export default function Dashboard() {
  useEffect(() => {
    getFile();
  }, []);

  const classes = useStyles();
  const [dashboard, showDashboard] = useState(false);
  const [dashboardfile, setFile] = useState();
  const [url, setURL] = useState();

  const getFile = async () => {
    get_url()
      .catch(err => getFile())
      .then(function(url) {
        setURL(url);
        d3.csv(url).then(function(file) {
          setFile(file);
          showDashboard(true);
        });
      });
  };

  const get_url = () => {
    var url = Storage.get("output.csv", { level: "private" }, { expires: 60 });
    return url;
  };

  const countColumnValues = (file, column) => {
    var data_count = d3
      .nest()
      .key(function(d) {
        return d[column];
      })
      .rollup(function(leaves) {
        return leaves.length;
      })
      .entries(file);

    var output_data = renameKeys(data_count);

    console.log(output_data);

    return output_data;
  };

  const renameKeys = data_count => {
    return data_count.map(function(obj) {
      obj["id"] = obj["key"];
      delete obj["key"];
      if (obj["id"] === "True") {
        obj["color"] = "#7C4DFF";
      } else if (obj["id"] === "False") {
        obj["color"] = "#607D8B";
      } else if (obj["id"] === "poor") {
        obj["color"] = "#7C4DFF";
      } else if (obj["id"] === "fair") {
        obj["color"] = "#607D8B";
      } else if (obj["id"] === "good") {
        obj["color"] = "#CFD8DC";
      } else if (obj["id"] === "strong") {
        obj["color"] = "#455A64";
      }
      return obj;
    });
  };

  const generatePie = (file, column) => {
    var data = countColumnValues(file, column);
    return data;
  };

  return (
    <Box className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <a href={url} download="output">
            <IconButton edge="start" color="secondary">
              <CloudDownloadIcon></CloudDownloadIcon>
            </IconButton>
          </a>
          <Typography variant="h6" className={classes.title} align="center">
            Atreides Controls NLP Dashboard
          </Typography>
          <Copyright align="right" color="secondary"></Copyright>
        </Toolbar>
      </AppBar>
      {dashboard === false && (
        <div className={classes.circle} align="centre">
          <CircularProgress
            size={40}
            left={-20}
            top={10}
            style={{ marginLeft: "50%" }}
          />
        </div>
      )}
      {dashboard && (
        <div className={classes.root}>
          <Grid container direction="row" space={3}>
            <Grid item xs>
              <div className={classes.pie}>
                <Paper className={classes.paper}>
                  <Typography variant="h6" align="center">
                    Contains Who?
                  </Typography>
                  <MyResponsivePie
                    id="contains_who_pie"
                    data={generatePie(dashboardfile, "contains_whos")}
                  />
                </Paper>
              </div>
            </Grid>
            <Grid item xs>
              <div className={classes.pie}>
                <Paper className={classes.paper}>
                  <Typography variant="h6" align="center">
                    Contains What?
                  </Typography>
                  <MyResponsivePie
                    id="contains_what_pie"
                    data={generatePie(dashboardfile, "contains_whats")}
                  />{" "}
                </Paper>
              </div>
            </Grid>
            <Grid item xs>
              <div className={classes.pie}>
                <Paper className={classes.paper}>
                  <Typography variant="h6" align="center">
                    Contains How?
                  </Typography>
                  <MyResponsivePie
                    id="contains_how_pie"
                    data={generatePie(dashboardfile, "contains_hows")}
                  />
                </Paper>
              </div>
            </Grid>
          </Grid>
          <Grid container direction="row" space={3}>
            <Grid item xs>
              <div className={classes.pie}>
                <Paper className={classes.paper}>
                  <Typography variant="h6" align="center">
                    Contains Multiple Whos?
                  </Typography>
                  <MyResponsivePie
                    id="multiple_who_pie"
                    data={generatePie(dashboardfile, "multiple_whos")}
                  />
                </Paper>
              </div>
            </Grid>
            <Grid item xs>
              <div className={classes.pie}>
                <Paper className={classes.paper}>
                  <Typography variant="h6" align="center">
                    Contains Multiple Whats?
                  </Typography>
                  <MyResponsivePie
                    id="multiple_what_pie"
                    data={generatePie(dashboardfile, "multiple_whats")}
                  />
                </Paper>
              </div>
            </Grid>
            <Grid item xs>
              <div className={classes.pie}>
                <Paper className={classes.paper}>
                  <Typography variant="h6" align="center">
                    Contains Multiple Hows?
                  </Typography>
                  <MyResponsivePie
                    id="multiple_how_pie"
                    data={generatePie(dashboardfile, "multiple_hows")}
                  />
                </Paper>
              </div>
            </Grid>
          </Grid>
          <Grid container direction="row" space={3}>
            <Grid item xs>
              <div className={classes.pie}>
                <Paper className={classes.paper}>
                  <Typography variant="h6" align="center">
                    Control Relevance to Risk?
                  </Typography>
                  <MyResponsivePie
                    id="risk_relevance_pie"
                    data={generatePie(
                      dashboardfile,
                      "control_relevance_to_risk"
                    )}
                  />
                </Paper>
              </div>
            </Grid>
            <Grid item xs>
              <div className={classes.pie}>
                <Paper className={classes.paper}>
                  <Typography variant="h6" align="center">
                    Contains When?
                  </Typography>
                  <MyResponsivePie
                    id="when_piechart"
                    data={generatePie(dashboardfile, "contains_whens")}
                  />
                </Paper>
              </div>
            </Grid>
            <Grid item xs>
              <div className={classes.pie}>
                <Paper className={classes.paper}>
                  <Typography variant="h6" align="center">
                    Contains Multiple Whens?
                  </Typography>
                  <MyResponsivePie
                    id="multiple_whens_pie"
                    data={generatePie(dashboardfile, "multiple_whens")}
                  />
                </Paper>
              </div>
            </Grid>
          </Grid>
        </div>
      )}
    </Box>
  );
}
