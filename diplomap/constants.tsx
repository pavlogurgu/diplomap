import { Icon } from '@iconify/react';
import { SideNavItem } from './types';
export const ITEMS_PER_PAGE = 10
export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: 'Головна',
    path: '/',
    icon: <Icon icon="lucide:home" width="24" height="24" />,
  },
  {
    title: 'Створити подорож',
    path: '/create',
    icon: <Icon icon="ant-design:plus-circle-outlined" width="24" height="24" />,
  },
  {
    title: 'Чат',
    path: '/chat',
    icon: <Icon icon="majesticons:chats-2-line" width="24" height="24" />,
  },
  {
    title: 'Мої подорожі',
    path: '/my-trips',
    icon: <Icon icon="cil:compass" width="24" height="24" />,
  },
  {
    title: 'Спільнота',
    path: '/friends',
    icon: <Icon icon="majesticons:users-line" width="24" height="24" />,
  },
  {
    title: 'Налаштування',
    path: '/settings',
    icon: <Icon icon="lucide:settings" width="24" height="24" />,
  },
];