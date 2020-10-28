import React, { useState } from 'react';
import { DataGrid, ColDef } from '@material-ui/data-grid';

const FileBrowser = (props: { apiKey: string; token: string }): JSX.Element => {
    const groupedData = useState<Array<Array<object>>>();
    const getFileNames = process.env.REACT_APP_FILENAMES_ENDPOINT
    const columns: ColDef[] = [
        { field: 'filename', headerName: 'File', width: 130 },
        { field: 'created', headerName: 'Created', width: 130 },
        { field: 'recommend', headerName: 'Recommend', width: 130 },
    ];

    const getOrgFileNames = (): Array<object> => {
        // TODO make some api request to the get all controls endpoint
        // need endpoints for dev and prod set up
    };

    const getTableRows = () => {
        // each grouped object will have a meta header to match row format required
    };

    return <DataGrid rows={getOrgFileNames()} columns={columns} pageSize={25} checkboxSelection />;
};
