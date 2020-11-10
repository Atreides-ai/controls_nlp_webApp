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
} from '@material-ui/core';
import { generateHeaders } from './utils/AtreidesAPIUtils';
import tableIcons from 'tableIcons';
import { Rating } from '@material-ui/lab';
import { Link } from 'react-router-dom';

const FileBrowser = (props: { baseUrl: string; dbCallback: (fileName: string) => void }): JSX.Element => {
    const [tableData, setTableData] = useState<Array<object>>([]);
    const [errorMessage, showErrorMessage] = useState<boolean>(false);

    const handleClose = (): void => {
        showErrorMessage(false);
    };

    const rateFile = async (name: string, value: number | null): Promise<void> => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const url = props.baseUrl + '/filename';
        const headers = await generateHeaders();
        const data = { data: { name: name, rating: value } };
        axios.post(url, data, headers).then(response => {
            if (response.status != 200) {
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

    const checkStarted = async (data: Array<object>): Promise<Array<boolean>> => {
        return data.map(object => {
            if (object['status'] === 'STARTED') {
                return true;
            } else {
                return false;
            }
        });
    };

    const getOrgFileNames = async (): Promise<void> => {
        // return [
        //     {
        //         name: 'test.csv',
        //         created_at: 'today',
        //         username: 'richardhurley@atreides.ai',
        //         status: 'STARTED',
        //         rating: 0,
        //     },
        //     {
        //         name: 'test.csv',
        //         created_at: 'today',
        //         username: 'richardhurley@atreides.ai',
        //         status: 'FAILED',
        //         rating: 0,
        //     },
        //     {
        //         name: 'test.csv',
        //         created_at: 'today',
        //         username: 'richardhurley@atreides.ai',
        //         status: 'SUCCEEDED',
        //         rating: 0,
        //     },
        // ];

        const headers = await generateHeaders();
        let int = 1000;
        const interval = setInterval(() => {
            const url = props.baseUrl + '/filename';
            axios.get(url, headers).then(response => {
                if (response.status === 200) {
                    const data = Object.values(response.data) as Array<Array<object>>;
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    console.log(data);
                    setTableData(data![0]);
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    const started = checkStarted(data![0]);
                    if (!started[0]) {
                        clearInterval(interval);
                    } else {
                        int += 500;
                    }
                } else if (response.status === 403) {
                    showErrorMessage(true);
                    clearInterval(interval);
                }
            });
        }, int);
    };

    useEffect(() => {
        getOrgFileNames();
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
            <MaterialTable
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
                            console.log(newData['name']);
                            rateFile(newData['name'], newData['value']);
                        }),
                }}
                icons={tableIcons}
                columns={columns}
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                data={tableData!}
                title="Files"
            />
        </div>
    );
};

export default FileBrowser;
