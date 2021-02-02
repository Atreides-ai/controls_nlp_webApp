import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';
import MaterialTable from 'material-table';
import tableIcons from './tableIcons';
import ControlsCardContent from './ControlsCardContent';
import { createRemediationList } from './utils/AtreidesDataUtils';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement<any, any> },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const CardTablePopUp = (props: {
    icon: JSX.Element;
    analysisField: string;
    dashboardFile: Array<object>;
    filter: any;
    id: string;
    showRemediation: boolean;
}): JSX.Element => {
    const [open, setOpen] = useState(false);

    const handleClickOpen = (): void => {
        setOpen(true);
    };

    const handleClose = (): void => {
        setOpen(false);
    };

    return (
        <div>
            <div id={props.id} onClick={handleClickOpen}>
                <ControlsCardContent
                    icon={props.icon}
                    header={props.filter}
                    file={props.dashboardFile}
                    column={props.analysisField}
                />
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
                            icons={tableIcons}
                            columns={[
                                { title: 'Control Description', field: 'control_description', filtering: false },
                                { title: 'Risk Description', field: 'risk_description', filtering: false },
                                { title: 'Overall Score', field: props.analysisField, defaultFilter: props.filter },
                                { title: 'Remediation', field: 'Remediation', filtering: false },
                            ]}
                            data={createRemediationList(props.dashboardFile)}
                            title="Analysis Summary"
                        />
                    )}
                    {!props.showRemediation && (
                        <MaterialTable
                            options={{
                                exportButton: true,
                                filtering: true,
                            }}
                            icons={tableIcons}
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
