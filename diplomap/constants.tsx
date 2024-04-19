import { Icon } from '@iconify/react';

import { SideNavItem } from './types';

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: 'Home',
    path: '/',
    icon: <Icon icon="lucide:home" width="24" height="24" />,
  },
  {
    title: 'Create Trip',
    path: '/create',
    icon: <Icon icon="lucide:folder" width="24" height="24" />,
  },
  {
    title: 'Friends',
    path: '/friends',
    icon: <Icon icon="lucide:mail" width="24" height="24" />,
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: <Icon icon="lucide:settings" width="24" height="24" />,
  },
  {
    title: 'History',
    path: '/history',
    icon: <Icon icon="lucide:help-circle" width="24" height="24" />,
  },
];