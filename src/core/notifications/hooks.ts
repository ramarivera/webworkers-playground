import { useCallback } from 'react';

import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { notificationsState, pendingNotificationsState } from './state';
import { NotificationType } from './types';

export const useSetCurrentNotification = () => {
  const setCurrentNotification = useSetRecoilState(notificationsState);

  const setNotification = useCallback(
    (message?: string, type?: NotificationType) => {
      setCurrentNotification({
        message,
        type,
      });
    },
    [setCurrentNotification],
  );

  return setNotification;
};

export const useHideCurrentNotification = () => {
  const setCurrentNotification = useSetRecoilState(notificationsState);

  const hideNotifications = useCallback(() => {
    setCurrentNotification({
      message: undefined,
      type: undefined,
    });
  }, [setCurrentNotification]);

  return hideNotifications;
};

export const useDequeueNotifications = () => {
  const [notifications, setNotifications] = useRecoilState(
    pendingNotificationsState,
  );

  const setCurrentNotification = useSetCurrentNotification();

  const dequeueNotification = useCallback(() => {
    if (!notifications.pending.length) {
      return;
    }

    const nextNotification = notifications.pending[0];

    setNotifications((prev) => ({
      ...prev,
      pending: prev.pending.slice(1),
    }));

    setCurrentNotification(nextNotification.message, nextNotification.type);
  }, [setCurrentNotification, notifications, setNotifications]);

  return dequeueNotification;
};

export const useShowNotifications = () => {
  const [notifications, setNotifications] = useRecoilState(
    pendingNotificationsState,
  );
  const currentNotification = useRecoilValue(notificationsState);
  const hideCurrentNotification = useHideCurrentNotification();

  const addNotificationToQueue = useCallback(
    (message: string, type: NotificationType) => {
      const lastNotification = notifications.pending.at(-1);

      if (
        lastNotification?.message === message ||
        currentNotification?.message === message
      ) {
        return;
      }

      setNotifications((prevNotifications) => {
        return {
          ...prevNotifications,
          pending: [
            ...prevNotifications.pending,
            {
              message,
              type,
            },
          ],
        };
      });
    },
    [notifications, setNotifications, currentNotification],
  );

  const error = (notification: string) =>
    addNotificationToQueue(notification, 'error');

  const success = (notification: string) =>
    addNotificationToQueue(notification, 'success');

  const info = (notification: string) =>
    addNotificationToQueue(notification, 'info');

  const warning = (notification: string) =>
    addNotificationToQueue(notification, 'warning');

  return {
    hideCurrentNotification,
    success,
    info,
    warning,
    error,
  };
};
