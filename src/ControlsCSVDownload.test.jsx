import React from 'react';
import { shallow, mount } from 'enzyme';
import ControlsCSVDownload from 'ControlsCSVDownload';
import { MemoryRouter } from 'react-router-dom';

const controlsFile = [
    // eslint-disable-next-line @typescript-eslint/camelcase
    {
        // eslint-disable-next-line @typescript-eslint/camelcase
        control_description: 'blah,blah blah blah',
        // eslint-disable-next-line @typescript-eslint/camelcase
        risk_description: 'blah',
        // eslint-disable-next-line @typescript-eslint/camelcase
        control_frequency: 'monthly',
        // eslint-disable-next-line @typescript-eslint/camelcase
        control_operator: 'josh',
        // eslint-disable-next-line @typescript-eslint/camelcase
        relevance_to_risk: 'strong',
        // eslint-disable-next-line @typescript-eslint/camelcase
        contains_whats: true,
        // eslint-disable-next-line @typescript-eslint/camelcase
        contains_hows: false,
        // eslint-disable-next-line @typescript-eslint/camelcase
        contains_whens: false,
        // eslint-disable-next-line @typescript-eslint/camelcase
        contains_whos: false,
        // eslint-disable-next-line @typescript-eslint/camelcase
        contains_thresholds: false,
        // eslint-disable-next-line @typescript-eslint/camelcase
        control_summary_rating: 'fully',
        whats: ['blah', 'blah', 'blah'],
        hows: ['blah'],
        whens: ['blah'],
        whos: ['blah'],
        thresholds: ['blah'],
        // eslint-disable-next-line @typescript-eslint/camelcase
        multiple_whats: true,
        // eslint-disable-next-line @typescript-eslint/camelcase
        multiple_hows: true,
        // eslint-disable-next-line @typescript-eslint/camelcase
        multiple_whens: true,
        // eslint-disable-next-line @typescript-eslint/camelcase
        multiple_whos: true,
        // eslint-disable-next-line @typescript-eslint/camelcase
        multiple_thresholds: true,
        accuracy: false,
        // eslint-disable-next-line @typescript-eslint/camelcase
        classification_and_understandability: true,
        completeness: false,
        // eslint-disable-next-line @typescript-eslint/camelcase
        cut_off: true,
        existence: true,
        valuation: true,
        // eslint-disable-next-line @typescript-eslint/camelcase
        rights_and_obligations: true,
        occurrence: true,
        // eslint-disable-next-line @typescript-eslint/camelcase
        created_at: 'blah',
        // eslint-disable-next-line @typescript-eslint/camelcase
        job_id: 'blah',
        // eslint-disable-next-line @typescript-eslint/camelcase
        organisation_id: 'blah',
        __EMPTY: '',
        // eslint-disable-next-line @typescript-eslint/camelcase
        control_id: 'blah',
        // eslint-disable-next-line @typescript-eslint/camelcase
        additional_data: { extra_data: 'blah' },
    },
];

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
        csvLink.simulate('click');
        expect(csvLink.prop('data')).toStrictEqual(expectedOutput);
    });
});
