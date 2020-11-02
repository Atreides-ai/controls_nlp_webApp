import React, { useState, useEffect, ChangeEvent } from 'react';
import MaterialTable from 'material-table';
import axios from 'axios';
import { Button } from '@material-ui/core';
import { generateHeaders } from './utils/AtreidesAPIUtils';
import tableIcons from 'tableIcons';
import {Rating} from '@material-ui/lab';

const FileBrowser = (props: { baseUrl: string }): JSX.Element => {
    const [tableData, setTableData] = useState<Array<object>>();

    const rateFile = async (value: number): Promise<void> => {
        // TODO: Rating submission URL and finish post request
        const url = props.baseUrl + '/rate';
        const headers = await generateHeaders();
        axios.put(url, { value: value } headers)
    }

    const columns = [
        { title: 'File', field: 'name' },
        { title: 'Created', field: 'created_at' },
        { title: 'status', field: 'status' },
        { title: 'Recommended', field: 'recommend', render: (rowData: object) => {return <Rating
            name="hover-feedback"
            value={rowData['recommended']}
            onChange={(event, newValue) => {
              rowData['recommended'] = newValue
            }}
          />}}
    ];

    const getOrgFileNames = async (): Promise<void> => {
        const url = props.baseUrl + '/filename';
        const headers = await generateHeaders();
        axios.get(url, headers).then(response => {
            console.log(response);
            if (response.status === 200) {
                setTableData(response.data);
                // process results
            } else {
                // show error message
            }
        });
    };

        // each grouped object will have a meta header to match row format required
    };

    useEffect(() => {
        getOrgFileNames();
    }, []);

    return (
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        <MaterialTable icons={tableIcons} columns={columns} data={getTableRows(tableData!)} title="Files" />

        // <Button color="primary" onClick={getOrgFileNames}>
        //     Click Me
        // </Button>
    );
};

export default FileBrowser;
