import { AlertColor } from '@mui/material/Alert';

export type NotificationType = AlertColor;

export interface NotificationItem {
  message?: string;
  type?: NotificationType;
}

export type NotificationsState = NotificationItem;

export interface PendingNotificationsState {
  pending: NotificationItem[];
}
