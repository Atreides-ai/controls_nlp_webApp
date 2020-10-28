import React, { useState } from 'react';
// import { DataGrid, ColDef } from '@material-ui/data-grid';

// const FileBrowser = (props: { apiKey: string; token: string }): JSX.Element => {
//     const groupedData = useState<Array<Array<object>>>();
//     const columns: ColDef[] = [
//         { field: 'id', headerName: 'ID', width: 70 },
//         { field: 'filename', headerName: 'File', width: 130 },
//         { field: 'created', headerName: 'Created', width: 130 },
//         { field: 'dashboard', headerName: 'Download', width: 130 },
//         { field: 'dashboard', headerName: 'Dashboard', width: 130 },
//     ];

//     const getAllControls = () => {
//         // TODO make some api request to the get all controls endpoint
//     };

//     const groupByJobId = () => {
//         // TODO group the controls in the following data structure [[{meta: {control}s}], ...]
//         // input will be [{}] so array.filter by obj ['job_id']
//     };

//     const getTableRows = () => {
//         // each grouped object will have a meta header to match row format required
//     };

//     return <DataGrid rows={rows} columns={columns} pageSize={25} checkboxSelection />;
// };
