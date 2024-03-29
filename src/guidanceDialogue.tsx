import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import useStyles from './useStyles';
import { TransitionProps } from '@material-ui/core/transitions';
import { useTheme } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement<any, any> },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function GuidanceDialogue() {
    const theme = useTheme<Theme>();
    const [open, setOpen] = React.useState(false);
    const classes = useStyles(theme);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        setOpen(true);
    }, []);

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
                maxWidth={'md'}
            >
                <DialogTitle id="alert-dialog-slide-title">{'How to use the tool'}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        <Typography variant="body1">
                            Please select select the controls file you wish to be processed.
                        </Typography>
                        <div></div>
                        <li>The file type must be a .csv or Excel file (.xls or .xlsx)</li>
                        <li>
                            If you have an Excel file with more than one sheet, all sheets will be put together into one
                            file. A column is added in the download stating the sheet the row comes from.
                        </li>
                        <li>
                            For best results run a spellcheck on your data prior to uploading and remove any annotations
                            in [square brackets].
                        </li>
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
                                        <TableCell align="center">Control Operator (Optional)</TableCell>
                                        <TableCell align="center">Control Frequency (Optional)</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell align="center">A reconciliation is...</TableCell>
                                        <TableCell align="center">There is a risk that...</TableCell>
                                        <TableCell align="center">Financial Accountant...</TableCell>
                                        <TableCell align="center">Monthly...</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <br></br>
                        <div>Please note that ordering of columns and unrelated data columns do not matter.</div>
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
