/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import axios from 'axios';
import {
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    Dialog,
    DialogContentText,
    LinearProgress,
    Grid,
} from '@material-ui/core';
import tableIcons from 'tableIcons';
import RefreshIcon from '@material-ui/icons/Refresh';
import { Rating, Skeleton } from '@material-ui/lab';
import { Link } from 'react-router-dom';

const FileBrowser = (props: {
    baseUrl: string;
    headers: object;
    dbCallback: (fileName: string) => void;
}): JSX.Element => {
    const [tableData, setTableData] = useState<Array<object>>([]);
    const [table, showTable] = useState<boolean>(false);
    const [errorMessage, showErrorMessage] = useState<boolean>(false);

    const handleClose = (): void => {
        showErrorMessage(false);
    };

    const rateFile = async (name: string, value: number | null): Promise<void> => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const url = props.baseUrl + '/filename';
        const data = { data: { name: name, rating: value } };
        console.log(data);
        axios.post(url, data, props.headers).then(response => {
            if (response.status !== 200) {
                showErrorMessage(true);
            }
        });
    };

    const columns = [
        { title: 'File', field: 'name', editable: 'never' as const },
        { title: 'Created', field: 'created_at', editable: 'never' as const },
        { title: 'User', field: 'username', editable: 'never' as const },
        { title: 'Status', field: 'status', editable: 'never' as const },
        {
            title: 'Rating',
            field: 'rating',
            editable: 'onUpdate' as const,
            render: (rowData: object): JSX.Element => {
                return <Rating name="hover-feedback" value={rowData['rating']} readOnly />;
            },
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            editComponent: (props: { value: number | null | undefined; onChange: (arg0: number | null) => void }) => (
                <Rating
                    name="hover-feedback"
                    // eslint-disable-next-line react/prop-types
                    value={props.value}
                    onChange={(event, newValue) => {
                        // eslint-disable-next-line react/prop-types
                        props.onChange(newValue);
                    }}
                />
            ),
        },
        {
            title: 'Dashboard',
            editable: 'never' as const,
            render: (rowData: object): JSX.Element => {
                if (rowData['status'] === 'SUCCEEDED') {
                    return (
                        <Link to="/dashboard">
                            <Button
                                variant="contained"
                                color="secondary"
                                // eslint-disable-next-line react/prop-types
                                onClick={(): void => props.dbCallback(rowData['name'])}
                            >
                                View
                            </Button>
                        </Link>
                    );
                }
                if (rowData['status'] === 'STARTED') {
                    return <LinearProgress color="secondary" />;
                } else {
                    return (
                        <Link to="/controlSubmitFile">
                            <Button variant="contained" color="secondary">
                                Retry
                            </Button>
                        </Link>
                    );
                }
            },
        },
    ];

    const getOrgFileNames = async (headers: object): Promise<void> => {
        const url = props.baseUrl + '/filename';
        axios.get(url, headers).then(response => {
            if (response.status === 504) {
                getOrgFileNames(headers);
            }
            if (response.status === 200) {
                const data = Object.values(response.data) as Array<Array<object>>;
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                setTableData(data![0]);
                showTable(true);
            } else if (response.status === 403) {
                showErrorMessage(true);
            }
        });
    };

    useEffect(() => {
        getOrgFileNames(props.headers);
    }, []);

    return (
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        <div>
            <Dialog
                open={errorMessage}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Sorry an error occured</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        An error has occured. Please contact support at support@atreides.ai for help.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Thanks!
                    </Button>
                </DialogActions>
            </Dialog>
            {table && (
                <MaterialTable
                    actions={[
                        {
                            icon: (): JSX.Element => <RefreshIcon />,
                            tooltip: 'refresh',
                            isFreeAction: true,
                            onClick: (): any => {
                                showTable(false);
                                getOrgFileNames(props.headers);
                            },
                        },
                    ]}
                    options={{
                        exportButton: true,
                        filtering: true,
                    }}
                    editable={{
                        onRowUpdate: (newData, oldData) =>
                            new Promise((resolve, reject) => {
                                const dataUpdate = [...tableData];
                                const index = oldData!['tableData']['id'];
                                dataUpdate[index] = newData;
                                resolve(setTableData(dataUpdate));
                                rateFile(newData['name'], newData['rating']);
                            }),
                    }}
                    icons={tableIcons}
                    columns={columns}
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    data={tableData!}
                    title="Files"
                />
            )}
            {!table && (
                <Grid container direction="column" spacing={1}>
                    <Grid item xs={12} sm="auto" md="auto" lg="auto">
                        <Skeleton variant="text" />
                    </Grid>
                    <Grid item xs={12} sm="auto" md="auto" lg="auto">
                        <Skeleton variant="rect" height={500} />
                    </Grid>
                </Grid>
            )}
        </div>
    );
};

export default FileBrowser;
