export type AppNotification = {
  id: string;
  type: string;
  title: string;
  body: string;
  icon: string;
  read: boolean;
  createdAt: string;
};

export type NotificationListResponse = {
  ok: boolean;
  message?: string;
  unreadCount: number;
  notifications: AppNotification[];
};
