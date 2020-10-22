import * as d3 from 'd3';
import {
    createRemediationList,
    countColumnValues,
    generateCardMetric,
    formatData,
    orderData,
    generatePie,
} from './AtreidesDataUtils';
import { controlsFile } from '../test_utils/controlsTestFile';
import _ from 'lodash';

describe('Atreides Data Utils', () => {
    it('createRemediationList', () => {
        const fileCopy = _.clone(controlsFile);
        fileCopy[0]['Remediation'] = 'No how. No who. No when. ';
        expect(createRemediationList(controlsFile)).toEqual(fileCopy);
    });
    it('countColumnValues', () => {
        const expectedOutput = [{ key: 'true', value: 1 }];
        expect(countColumnValues(controlsFile, 'contains_whats')).toEqual(expectedOutput);
    });
    it('generateCardMetric', () => {
        const expectedOutput = '1';
        expect(generateCardMetric(controlsFile, 'control_summary_rating', 'fully')).toEqual(expectedOutput);
    });
    it('formatData', () => {
        const input = [
            { key: 'true', value: 1 },
            { key: 'false', value: 1 },
        ];
        const expectedOutput = [
            { id: 'true', value: 1, color: '#7C4DFF' },
            { id: 'false', value: 1, color: '#607D8B' },
        ];
        expect(formatData(input)).toEqual(expectedOutput);
    });
    it('orderData', () => {
        const input = [
            { id: 'false', value: 1 },
            { id: 'true', value: 1 },
        ];
        const expectedOutput = [
            { id: 'true', value: 1 },
            { id: 'false', value: 1 },
        ];
        expect(orderData(input)).toEqual(expectedOutput);
    });
    it('generatePie', () => {
        const input = controlsFile;
        const expectedOutput = [{ color: '#7C4DFF', id: 'true', value: 1 }];
        expect(generatePie(input, 'contains_whats')).toEqual(expectedOutput);
    });
});
