/* eslint-disable react/jsx-key */
import React from 'react';
import { shallow, mount } from 'enzyme';
import HomeIcon from '@material-ui/icons/Home';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import FolderSharedIcon from '@material-ui/icons/FolderShared';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import AppLayout from 'AppLayout';
import { MemoryRouter } from 'react-router-dom';

const AppLayoutProps = {
    pageTitle: 'Test Title',
    listItems: ['Home', 'Dashboard', 'Company Controls', 'Upload'],
    listIcons: [<HomeIcon />, <DonutLargeIcon />, <FolderSharedIcon />, <CloudUploadIcon />],
    linkList: ['/home', '/dashboard', '/comp-controls', '/upload'],
    coreElement: <p></p>,
};

describe('AppLayout', () => {
    it('Component Renders', () => {
        shallow(
            <AppLayout
                pageTitle={AppLayoutProps.pageTitle}
                listItems={AppLayoutProps.listItems}
                listIcons={AppLayoutProps.listIcons}
                linkList={AppLayoutProps.linkList}
                coreElement={AppLayoutProps.coreElement}
            />,
        );
    });
    it('Component Accepts props', () => {
        const wrapper = mount(
            <MemoryRouter>
                <AppLayout
                    pageTitle={AppLayoutProps.pageTitle}
                    listItems={AppLayoutProps.listItems}
                    listIcons={AppLayoutProps.listIcons}
                    linkList={AppLayoutProps.linkList}
                    coreElement={AppLayoutProps.coreElement}
                />
            </MemoryRouter>,
        );
        expect(wrapper.find('AppLayout').props().pageTitle).toEqual(AppLayoutProps.pageTitle);
        expect(wrapper.find('AppLayout').props().listItems).toEqual(AppLayoutProps.listItems);
        expect(wrapper.find('AppLayout').props().listIcons).toEqual(AppLayoutProps.listIcons);
        expect(wrapper.find('AppLayout').props().linkList).toEqual(AppLayoutProps.linkList);
        expect(wrapper.find('AppLayout').props().coreElement).toEqual(AppLayoutProps.coreElement);
    });
});
