import React from 'react';
import { shallow, mount } from 'enzyme';
import CardTablePopUp from 'CardTablePopUp';
import { MemoryRouter } from 'react-router-dom';
import { controlsFile } from './test_utils/controlsTestFile';
import StarIcon from '@material-ui/icons/Star';

const properties = {
    icon: <StarIcon style={{ fontSize: 120 }} />,
    analysisField: 'control_summary_rating',
    filter: 'fully',
    id: 'blah',
    showRemediation: true,
};

describe('CardTablePopUp Component', () => {
    it('Component Renders', () => {
        shallow(
            <CardTablePopUp
                icon={properties.icon}
                analysisField={properties.analysisField}
                dashboardFile={controlsFile}
                filter={properties.filter}
                id={properties.id}
                showRemediation={properties.showRemediation}
            />,
        );
    });
    it('Component Accepts props with Remediation', () => {
        const wrapper = mount(
            <MemoryRouter>
                <CardTablePopUp
                    icon={properties.icon}
                    analysisField={properties.analysisField}
                    dashboardFile={controlsFile}
                    filter={properties.filter}
                    id={properties.id}
                    showRemediation={properties.showRemediation}
                />
            </MemoryRouter>,
        );
        expect(wrapper.find('CardTablePopUp').props().icon).toEqual(properties.icon);
        expect(wrapper.find('CardTablePopUp').props().analysisField).toEqual(properties.analysisField);
        expect(wrapper.find('CardTablePopUp').props().dashboardFile).toEqual(controlsFile);
        expect(wrapper.find('CardTablePopUp').props().filter).toEqual(properties.filter);
        expect(wrapper.find('CardTablePopUp').props().id).toEqual(properties.id);
        expect(wrapper.find('CardTablePopUp').props().showRemediation).toEqual(properties.showRemediation);
    });
    it('Component Accepts props without Remediation', () => {
        const wrapper = mount(
            <MemoryRouter>
                <CardTablePopUp
                    icon={properties.icon}
                    analysisField={properties.analysisField}
                    dashboardFile={controlsFile}
                    filter={properties.filter}
                    id={properties.id}
                />
            </MemoryRouter>,
        );
        expect(wrapper.find('CardTablePopUp').props().showRemediation).toEqual(false);
    });
});
