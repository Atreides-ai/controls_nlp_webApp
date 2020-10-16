import React from 'react';
import { shallow, mount } from 'enzyme';
import ControlsCSVDownload, {
    orderDownload,
    fillNulls,
    unwrapAdditionalData,
    createCSVDownload,
} from 'ControlsCSVDownload';
import { MemoryRouter } from 'react-router-dom';

const controlsFile = [
    // eslint-disable-next-line @typescript-eslint/camelcase
    {
        // eslint-disable-next-line @typescript-eslint/camelcase
        control_description: 'blah',
        // eslint-disable-next-line @typescript-eslint/camelcase
        risk_description: 'blah',
        // eslint-disable-next-line @typescript-eslint/camelcase
        control_frequency: 'monthly',
        // eslint-disable-next-line @typescript-eslint/camelcase
        control_operator: 'josh',
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
    it('unwrap Data', () => {
        const output = unwrapAdditionalData(controlsFile);
        expect(output).toBe()
    });
});
