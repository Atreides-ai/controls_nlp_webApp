import * as d3 from 'd3';
import 'array.prototype.move';
import { PieDatum } from '@nivo/pie';
import theme from '../theme';

/**
 * Adds a remediation checklist to the results received from the Controls api.
 *
 * @param {Array<object>} dashboardfile
 * @returns {Array<object>}
 */
export const createRemediationList = (dashboardfile: Array<object>): Array<object> => {
    return dashboardfile.map((obj: object): object => {
        const remediationText = [];
        if (obj['contains_whats'] === 'false') {
            remediationText.push('No what. ');
        }
        if (obj['contains_hows'] === 'false') {
            remediationText.push('No how. ');
        }
        if (obj['contains_whos'] === 'false') {
            remediationText.push('No who. ');
        }
        if (obj['contains_whens'] === 'false') {
            remediationText.push('No when. ');
        }
        console.log(remediationText);
        if (remediationText.length === 0) {
            remediationText.push('No remediation required.');
        }
        obj['Remediation'] = remediationText.join('');
        return obj;
    });
};

/**
 * Takes a file and relevant column name and returns obj counting all keys
 *
 * @param {[object]} file
 * @param {string} column
 * @returns {[object]}
 */
export const countColumnValues = (file: Array<object>, column: string): Array<object> => {
    const dataCount = d3
        .nest()
        .key(function(d: any): any {
            return d[column];
        })
        .rollup(function(leaves: any): any {
            return leaves.length;
        })
        .entries(file);

    return dataCount;
};

/**
 * Finds the column in the data and returns the count for a given key
 *
 * @param {string} column
 * @param {string} key
 * @return {integer} value
 */
export const generateCardMetric = (file: Array<object>, column: string, key: string): string => {
    const countData = countColumnValues(file, column);
    const fieldCount = countData.filter(el => {
        return el['key'] === key;
    });

    if (fieldCount[0] !== undefined) {
        return fieldCount[0]['value'].toString();
    }

    return '0';
};

/**
 * Takes an array of objects of pie chart data and sets colors for each key
 *
 * @param {[object]} dataCount
 * @returns {[object]} formattedData
 */
export const formatData = (dataCount: Array<object>): Array<object> => {
    return dataCount.map((obj: object): object => {
        obj['id'] = obj['key'];
        delete obj['key'];
        if (obj['id'] === 'true') {
            obj['color'] = theme.palette.primary.main;
        } else if (obj['id'] === 'false') {
            obj['color'] = theme.palette.secondary.main;
        }
        return obj;
    });
};

/**
 * Takes the data for pie chart and orders for legend to ensure consistency
 *
 * @param {[object]} data
 * @returns {[object]} filtered
 */
export const orderData = (data: Array<object>): Array<object> => {
    data.forEach((element: object): void => {
        if (element !== undefined) {
            if (element['id'] === 'true') {
                data.move(data.indexOf(element), 0);
            } else if (element['id'] === 'false') {
                data.move(data.indexOf(element), 1);
            } else if (element['id'] === 'poor') {
                data.move(data.indexOf(element), 0);
            } else if (element['id'] === 'fair') {
                data.move(data.indexOf(element), 1);
            } else if (element['id'] === 'good') {
                data.move(data.indexOf(element), 2);
            } else if (element['id'] === 'strong') {
                data.move(data.indexOf(element), 3);
            }
        }
    });

    const filtered = data.filter(function(x) {
        return x !== undefined;
    });

    return filtered;
};

/**
 * Takes the file and the column name and generates pie chart data array
 *
 * @param {string} column
 * @returns {[object]} data
 */
export const generatePie = (file: Array<object>, column: string): Array<PieDatum> => {
    const dataCount = countColumnValues(file, column);
    if (dataCount[0]['id'] !== 'undefined') {
        const rawData = formatData(dataCount);
        const orderedData = orderData(rawData);
        return orderedData as Array<PieDatum>;
    } else return [{ id: 'No Data Provided', value: 0 }];
};
