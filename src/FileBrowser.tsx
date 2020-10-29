import React, { useState } from 'react';
import MaterialTable from 'material-table';
import axios from 'axios';
import { Button } from '@material-ui/core';
import { generateHeaders } from './utils/AtreidesAPIUtils';

const FileBrowser = (props: { baseUrl: string }): JSX.Element => {
    const groupedData = useState<Array<Array<object>>>();
    // const columns: ColDef[] = [
    //     { field: 'filename', headerName: 'File', width: 130 },
    //     { field: 'created', headerName: 'Created', width: 130 },
    //     { field: 'recommend', headerName: 'Recommend', width: 130 },
    // ];

    const getOrgFileNames = async (): Promise<void> => {
        const url = props.baseUrl + '/filename';
        const headers = await generateHeaders();
        console.log(headers);
        axios.get(url, headers).then(response => {
            console.log(response);
            if (response.status === 200) {
                // process results
            } else {
                // show error message
            }
        });
    };

    const getTableRows = () => {
        // each grouped object will have a meta header to match row format required
    };

    return (
        <Button color="primary" onClick={getOrgFileNames}>
            Click Me
        </Button>
    );
};

export default FileBrowser;
