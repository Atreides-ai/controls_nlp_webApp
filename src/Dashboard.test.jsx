import React from 'react';
import { shallow, mount } from 'enzyme';
import Dashboard from 'Dashboard';
import { MemoryRouter } from 'react-router-dom';
import { controlsFile } from './test_utils/controlsTestFile';

const properties = {
    jobID: 'blah',
    token: 'blah',
    apiKey: 'blah',
};

describe('Dashboard', () => {
    it('Component Renders', () => {
        shallow(<Dashboard jobId={properties.jobID} token={properties.token} apiKey={properties.apiKey} />);
    });
    it('Component Accepts props', () => {
        const wrapper = mount(
            <MemoryRouter>
                <Dashboard jobId={properties.jobID} token={properties.token} apiKey={properties.apiKey} />
            </MemoryRouter>,
        );
        expect(wrapper.find('Dashboard').props().jobID).toEqual(properties.jobId);
        expect(wrapper.find('Dashboard').props().token).toEqual(properties.token);
        expect(wrapper.find('Dashboard').props().apiKey).toEqual(properties.apiKey);
    });
});
