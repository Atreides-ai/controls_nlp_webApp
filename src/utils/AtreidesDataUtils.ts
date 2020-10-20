import * as d3 from 'd3';

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
            remediationText.push('No what.\n');
        }
        if (obj['contains_hows'] === 'false') {
            console.log('No how triggered...');
            remediationText.push('No how.\n');
            console.log(remediationText);
        }
        if (obj['contains_whos'] === 'false') {
            remediationText.push('No who.\n');
        }
        if (obj['contains_whens'] === 'false') {
            remediationText.push('No when.\n');
        }
        if (remediationText === []) {
            remediationText.push('No remediation required.');
        }
        console.log(remediationText);
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
        console.log(fieldCount);
        return fieldCount[0]['value'].toString();
    }

    return '0';
};
