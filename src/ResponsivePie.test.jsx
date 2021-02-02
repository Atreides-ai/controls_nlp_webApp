import React from 'react';
import { shallow, mount } from 'enzyme';
import ResponsivePie from 'ResponsivePie';
import { MemoryRouter } from 'react-router-dom';
import { controlsFile } from './test_utils/controlsTestFile';

describe('CardTablePopUp Component', () => {
    it('Component Renders', () => {
        shallow(<ResponsivePie controlsFile={controlsFile} column="contains_whats" />);
    });
    it('Component Accepts props with Remediation', () => {
        const wrapper = mount(
            <MemoryRouter>
                <ResponsivePie controlsFile={controlsFile} column="contains_whats" />,
            </MemoryRouter>,
        );
        expect(wrapper.find('ResponsivePie').props().controlsFile).toEqual(controlsFile);
        expect(wrapper.find('ResponsivePie').props().column).toEqual('contains_whats');
    });
});
