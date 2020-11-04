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
    const [tableData, setTableData] = useState<Array<object>>();
    const [errorMessage, showErrorMessage] = useState<boolean>(false);

    const handleClose = (): void => {
        showErrorMessage(false);
    };

    const rateFile = async (value: number | null): Promise<void> => {
        // TODO: Rating submission URL and finish post request
        const url = props.baseUrl + '/rate';
        const headers = await generateHeaders();
        axios.put(url, { value: value }, headers);
    };

    const columns = [
        { title: 'File', field: 'name' },
        { title: 'Created', field: 'created_at' },
        { title: 'User', field: 'username' },
        { title: 'status', field: 'status' },
        {
            title: 'Rating',
            field: 'rating',
            render: (rowData: object): JSX.Element => {
                return (
                    <Rating
                        name="hover-feedback"
                        value={rowData['rating']}
                        onChange={(event, newValue) => {
                            rowData['rating'] = newValue;
                            rateFile(newValue);
                        }}
                    />
                );
            },
        },
        {
            title: 'Dashboard',
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

    const getOrgFileNames = () => {
        return [
            {
                name: 'test.csv',
                created_at: 'today',
                username: 'richardhurley@atreides.ai',
                status: 'STARTED',
                rating: 0,
            },
            {
                name: 'test.csv',
                created_at: 'today',
                username: 'richardhurley@atreides.ai',
                status: 'FAILED',
                rating: 0,
            },
            {
                name: 'test.csv',
                created_at: 'today',
                username: 'richardhurley@atreides.ai',
                status: 'SUCCEEDED',
                rating: 0,
            },
        ];

        // const headers = await generateHeaders();
        // const interval = setInterval(() => {
        //     const url = props.baseUrl + '/filename';
        //     axios.get(url, headers).then(response => {
        //         if (response.status === 200) {
        //             setTableData(response.data);
        //             clearInterval(200);
        //         } else if (response.status === 403) {
        //             showErrorMessage(true);
        //             clearInterval(interval);
        //         }
        //     });
        // }, 10000);
    };

    // each grouped object will have a meta header to match row format required

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
                icons={tableIcons}
                columns={columns}
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                data={getOrgFileNames()}
                title="Files"
            />
        </div>
    );
};

export default FileBrowser;
