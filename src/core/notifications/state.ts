import { atom, selector } from 'recoil';

import { NotificationsState, PendingNotificationsState } from './types';

export const notificationsState = atom<NotificationsState>({
  key: 'currentNotificationState', // unique ID (with respect to other atoms/selectors)
  default: {
    message: undefined,
    type: undefined,
  },
});

export const pendingNotificationsState = atom<PendingNotificationsState>({
  key: 'pendingNotificationsState', // unique ID (with respect to other atoms/selectors)
  default: {
    pending: [],
  },
});

export const isNotificationVisibleState = selector({
  key: 'isNotificationVisibleState',
  get: ({ get }) => {
    const currentNotification = get(notificationsState);
    return !!currentNotification.message;
  },
});
