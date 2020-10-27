import React from 'react';
import Button from '@material-ui/core/Button';
import { CSVLink } from 'react-csv';
import { COREMETRICS } from 'CoreMetrics';

const ControlsCSVDownload = (props: { dashboardFile: Array<object> }): JSX.Element => {
    const orderDownload = (file: Array<object>): Array<object> => {
        const download = [] as Array<[] | object>;
        file.map(obj => {
            const newObj = {};
            COREMETRICS.forEach(item => {
                newObj[item.replace(/_/g, ' ').toUpperCase()] = obj[item];
            });

            const keys = Object.keys(obj);
            const difference = keys.filter(x => !COREMETRICS.includes(x));

            difference.forEach(item => {
                newObj[item] = obj[item];
            });

            download.push(newObj);
        });
        return download;
    };

    const fillNulls = (controls: Array<object>): Array<object> => {
        return controls.map(function(obj) {
            for (const [key, value] of Object.entries(obj)) {
                if (obj[key] === null) {
                    obj[key] = 'None';
                } else if (COREMETRICS.includes(key) && !['control_description', 'risk_description'].includes(key)) {
                    obj[key] = value
                        .toString()
                        .replace(/,/g, ', ')
                        .replace(/  +/g, ' ');
                }
            }
            return obj;
        });
    };

    /**
     *
     *
     * @param {*} inputFile
     * @returns
     */
    const unwrapAdditionalData = (inputFile: Array<object>): Array<object> => {
        return inputFile.map(function(obj) {
            if (obj['additional_data'] !== undefined) {
                for (const [key, value] of Object.entries(obj['additional_data'])) {
                    obj[key] = value;
                }
            }
            delete obj['additional_data'];
            delete obj['created_at'];
            delete obj['job_id'];
            delete obj['organisation_id'];
            delete obj['__EMPTY'];
            return obj;
        });
    };

    const createCSVDownload = (rawFile: Array<object>): Array<object> => {
        const file = unwrapAdditionalData(rawFile);
        const processedFile = fillNulls(file);
        const orderedData = orderDownload(processedFile);
        return orderedData;
    };

    return (
        <CSVLink data={createCSVDownload(props.dashboardFile)} filename="Analysis.csv">
            <Button variant="contained" color="secondary">
                Download All Results
            </Button>
        </CSVLink>
    );
};

export default ControlsCSVDownload;
