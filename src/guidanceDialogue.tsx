import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import useStyles from "./useStyles";
import { TransitionProps } from "@material-ui/core/transitions";
import { useTheme } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core';

const Transition = React.forwardRef<unknown, TransitionProps>(
  function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  }
);

export default function GuidanceDialogue(){
  const theme = useTheme<Theme>();
  console.log(theme);
  const [open, setOpen] = React.useState(false);
  const classes = useStyles(theme);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button size="small" color="primary" onClick={handleClickOpen}>
        Portal Guidance
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        fullWidth={true}
        maxWidth={"md"}
      >
        <DialogTitle id="alert-dialog-slide-title">
          {"Using Atreides' NLP service for controls?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <li>
              Please select select the controls file you wish to be processed.
            </li>
            <li>
              The file type must be a .csv with no blank border rows or columns.
            </li>
            <li>The file name must have no spaces.</li>
            <li>
              The columns should be titled <b>exactly</b> as shown below:
            </li>
            <br></br>
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Control Description</TableCell>
                    <TableCell align="center">Risk Description</TableCell>
                    <TableCell align="center">Control Operator</TableCell>
                    <TableCell align="center">Control Frequency</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell align="center">A reconciliation is...</TableCell>
                    <TableCell align="center">
                      There is a risk that...
                    </TableCell>
                    <TableCell align="center">
                      Financial Accountant...
                    </TableCell>
                    <TableCell align="center">Monthly...</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <br></br>
            <div>
              Please note that ordering of columns and unrelated data columns do
              not matter.
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Thanks!
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
