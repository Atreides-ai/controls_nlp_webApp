/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import axios from 'axios';
import { Button } from '@material-ui/core';
import { generateHeaders } from './utils/AtreidesAPIUtils';
import tableIcons from 'tableIcons';
import { Rating } from '@material-ui/lab';
import { Link } from 'react-router-dom';

const FileBrowser = (props: { baseUrl: string; dbCallback: (fileName: string) => void }): JSX.Element => {
    const [tableData, setTableData] = useState<Array<object>>();

    // const rateFile = async (value: number): Promise<void> => {
    //     // TODO: Rating submission URL and finish post request
    //     const url = props.baseUrl + '/rate';
    //     const headers = await generateHeaders();
    //     axios.put(url, { value: value } headers)
    // }

    // Check file status at interval
    //     const interval = setInterval(() => {
    //         axios.get(url, headers).then(response => {
    //             if (response.status === 200 && response['data']['percent_complete'] === 100) {
    //                 setProgress(100);
    //                 if (response.data.controls) {
    //                     setFile(response.data.controls);
    //                     clearInterval(interval);
    //                     showDashboard(true);
    //                 } else {
    //                     showErrorMessage(true);
    //                 }
    //             } else if (response.status === 200 && response['data']['percent_complete'] != 100) {
    //                 setProgress(response['data']['percent_complete']);
    //             } else if (response.status === 403) {
    //                 showLimitMessage(true);
    //                 clearInterval(interval);
    //             } else if (response.status === 400 || 404) {
    //                 console.log(response);
    //                 showErrorMessage(true);
    //                 clearInterval(interval);
    //             }
    //         });
    //     }, 5000);
    // };

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
                            console.log(rowData);
                        }}
                    />
                );
            },
        },
        {
            title: 'Dashboard',
            render: (rowData: object): JSX.Element => {
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
            },
        },
    ];

    const getOrgFileNames = () => {
        return [
            {
                name: 'test.csv',
                created_at: 'today',
                username: 'richardhurley@atreides.ai',
                status: 'in progress',
                rating: 0,
            },
        ];
        // const url = props.baseUrl + '/filename';
        // const headers = await generateHeaders();
        // axios.get(url, headers).then(response => {
        //     console.log(response);
        //     if (response.status === 200) {
        //         setTableData(response.data);
        //         // process results
        //     } else {
        //         // show error message
        //     }
        // });
    };

    // each grouped object will have a meta header to match row format required

    useEffect(() => {
        getOrgFileNames();
    }, []);

    return (
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        <MaterialTable
            options={{
                exportButton: true,
                filtering: true,
            }}
            icons={tableIcons}
            columns={columns}
            data={getOrgFileNames()}
            title="Files"
        />

        // <Button color="primary" onClick={getOrgFileNames}>
        //     Click Me
        // </Button>
    );
};

export default FileBrowser;
