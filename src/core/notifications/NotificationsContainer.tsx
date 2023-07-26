import React, { useCallback, useEffect } from 'react';

import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { useRecoilValue } from 'recoil';

import { useDequeueNotifications, useHideCurrentNotification } from './hooks';
import {
  isNotificationVisibleState,
  notificationsState,
  pendingNotificationsState,
} from './state';

export const NotificationsContainer: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const currentNotification = useRecoilValue(notificationsState);
  const isNotificationVisible = useRecoilValue(isNotificationVisibleState);
  const notifications = useRecoilValue(pendingNotificationsState);

  const hideNotification = useHideCurrentNotification();
  const dequeueNotification = useDequeueNotifications();

  useEffect(() => {
    if (notifications.pending.length && !isNotificationVisible) {
      dequeueNotification();
    }
  }, [notifications, dequeueNotification, isNotificationVisible]);

  const handleClose = useCallback(
    (_: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') {
        return;
      }

      hideNotification();
      dequeueNotification();
    },
    [dequeueNotification, hideNotification],
  );

  const handleExited = () => {
    hideNotification();
  };

  return (
    <>
      {children}
      <Snackbar
        key={currentNotification.message}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={isNotificationVisible}
        autoHideDuration={6000}
        onClose={handleClose}
        TransitionProps={{ onExited: handleExited }}
      >
        <Alert
          onClose={handleClose}
          severity={currentNotification.type}
          variant="filled"
          sx={{ width: '100%' }}
          elevation={6}
        >
          {currentNotification.message}
        </Alert>
      </Snackbar>
    </>
  );
};
