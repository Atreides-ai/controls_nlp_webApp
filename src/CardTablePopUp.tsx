import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';
import MaterialTable from 'material-table';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement<any, any> },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const CardTablePopUp = (props: {
    DashboardContent: JSX.Element;
    analysisField: string;
    dashboardFile: any;
    filter: any;
    tableIcons: any;
    id: string;
    showRemediation: boolean;
}): JSX.Element => {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <div id={props.id} onClick={handleClickOpen}>
                {props.DashboardContent}
            </div>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
                fullWidth={true}
                maxWidth={'xl'}
            >
                <DialogTitle id="alert-dialog-slide-title">{'Atreides.ai'}</DialogTitle>
                <DialogContent>
                    {props.showRemediation && (
                        <MaterialTable
                            options={{
                                exportButton: true,
                                filtering: true,
                            }}
                            icons={props.tableIcons}
                            columns={[
                                { title: 'Control Description', field: 'control_description', filtering: false },
                                { title: 'Risk Description', field: 'risk_description', filtering: false },
                                { title: 'Overall Score', field: props.analysisField, defaultFilter: props.filter },
                                { title: 'Remediation', field: 'Remediation', filtering: false },
                            ]}
                            data={props.dashboardFile}
                            title="Analysis Summary"
                        />
                    )}
                    {!props.showRemediation && (
                        <MaterialTable
                            options={{
                                exportButton: true,
                                filtering: true,
                            }}
                            icons={props.tableIcons}
                            columns={[
                                { title: 'Control Description', field: 'control_description', filtering: false },
                                { title: 'Risk Description', field: 'risk_description', filtering: false },
                                { title: 'Overall Score', field: props.analysisField, defaultFilter: props.filter },
                            ]}
                            data={props.dashboardFile}
                            title="Analysis Summary"
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Done
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

CardTablePopUp.defaultProps = {
    showRemediation: false,
};

export default CardTablePopUp;