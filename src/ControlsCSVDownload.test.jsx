import React from 'react';
import { shallow, mount } from 'enzyme';
import ControlsCSVDownload from 'ControlsCSVDownload';
import { MemoryRouter } from 'react-router-dom';
import { controlsFile } from './test_utils/controlsTestFile';

describe('ControlsCSVDownload Component Button', () => {
    it('Component Renders', () => {
        shallow(<ControlsCSVDownload dashboardFile={controlsFile}></ControlsCSVDownload>);
    });
    it('Component Accepts props', () => {
        const wrapper = mount(
            <MemoryRouter>
                <ControlsCSVDownload dashboardFile={controlsFile} />
            </MemoryRouter>,
        );
        expect(wrapper.find('ControlsCSVDownload').props().dashboardFile).toEqual(controlsFile);
    });
    it('Download Data', () => {
        const wrapper = mount(
            <MemoryRouter>
                <ControlsCSVDownload dashboardFile={controlsFile} />
            </MemoryRouter>,
        );
        const expectedOutput = [
            {
                'CONTROL ID': 'blah',
                'CONTROL DESCRIPTION': 'blah,blah blah blah',
                'RISK DESCRIPTION': 'blah',
                'CONTROL FREQUENCY': 'monthly',
                'CONTROL OPERATOR': 'josh',
                'RELEVANCE TO RISK': 'strong',
                'CONTAINS WHATS': 'true',
                'CONTAINS HOWS': 'false',
                'CONTAINS WHENS': 'false',
                'CONTAINS WHOS': 'false',
                'CONTAINS THRESHOLDS': 'false',
                'CONTROL SUMMARY RATING': 'fully',
                WHATS: 'blah, blah, blah',
                HOWS: 'blah',
                WHENS: 'blah',
                WHOS: 'blah',
                THRESHOLDS: 'blah',
                'MULTIPLE WHATS': 'true',
                'MULTIPLE HOWS': 'true',
                'MULTIPLE WHENS': 'true',
                'MULTIPLE WHOS': 'true',
                'MULTIPLE THRESHOLDS': 'true',
                ACCURACY: 'false',
                'CLASSIFICATION AND UNDERSTANDABILITY': 'true',
                COMPLETENESS: 'false',
                'CUT OFF': 'true',
                EXISTENCE: 'true',
                VALUATION: 'true',
                'RIGHTS AND OBLIGATIONS': 'true',
                OCCURRENCE: 'true',
                // eslint-disable-next-line @typescript-eslint/camelcase
                extra_data: 'blah',
            },
        ];
        const csvLink = wrapper.find('CSVLink');
        expect(csvLink.prop('data')).toStrictEqual(expectedOutput);
    });
});
