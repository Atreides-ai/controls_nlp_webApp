import React from 'react';
import { shallow, mount } from 'enzyme';
import ControlsCardContent from './ControlsCardContent';
import { MemoryRouter } from 'react-router-dom';
import { controlsFile } from './test_utils/controlsTestFile';
import StarIcon from '@material-ui/icons/Star';

const properties = {
    icon: <StarIcon style={{ fontSize: 120 }} />,
    header: 'fully',
    column: 'control_summary_rating',
};

describe('Controls Card Content', () => {
    it('Component Renders', () => {
        shallow(
            <ControlsCardContent
                icon={properties.icon}
                header={properties.header}
                file={controlsFile}
                column={properties.column}
            />,
        );
    });
    it('Component Accepts props', () => {
        const wrapper = mount(
            <MemoryRouter>
                <ControlsCardContent
                    icon={properties.icon}
                    header={properties.header}
                    file={controlsFile}
                    column={properties.column}
                />
            </MemoryRouter>,
        );
        expect(wrapper.find('ControlsCardContent').props().icon).toEqual(properties.icon);
        expect(wrapper.find('ControlsCardContent').props().header).toEqual(properties.header);
        expect(wrapper.find('ControlsCardContent').props().file).toEqual(controlsFile);
        expect(wrapper.find('ControlsCardContent').props().column).toEqual(properties.column);
    });
});
