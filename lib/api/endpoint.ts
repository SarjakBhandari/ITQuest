import { siteConfig } from '../site-config';

const baseUrl = siteConfig.apiBaseUrl.replace(/\/$/, '');

export const apiEndpoints = {
  login: `${baseUrl}/auth/login`,
  logout: `${baseUrl}/auth/logout`,
  me: `${baseUrl}/auth/me`,
  registrationRequestOtp: `${baseUrl}/auth/registration/request-otp`,
  registrationVerifyOtp: `${baseUrl}/auth/registration/verify-otp`,
  tasks: `${baseUrl}/tasks`,
  task: (id: string) => `${baseUrl}/tasks/${id}`,
  snoozeTask: (id: string) => `${baseUrl}/tasks/${id}/snooze`,
  sortTasksByPriority: `${baseUrl}/tasks/sort-by-priority`,
  enableExamMode: `${baseUrl}/tasks/exam-mode/enable`,
  disableExamMode: `${baseUrl}/tasks/exam-mode/disable`,
  dashboardSummary: (mode?: string) => `${baseUrl}/dashboard/summary${mode ? `?mode=${encodeURIComponent(mode)}` : ''}`,
  myGroup: `${baseUrl}/groups/me`,
  groups: `${baseUrl}/groups`,
  joinGroup: `${baseUrl}/groups/join`,
  leaveGroup: `${baseUrl}/groups/leave`,
  myStats: `${baseUrl}/stats/me`,
  mySettings: `${baseUrl}/settings/me`,
  updateProfile: `${baseUrl}/settings/profile`,
  updatePreferences: `${baseUrl}/settings/preferences`,
  changePassword: `${baseUrl}/settings/password`,
  notifications: `${baseUrl}/notifications`,
  markNotificationRead: (id: string) => `${baseUrl}/notifications/${id}/read`,
  markAllNotificationsRead: `${baseUrl}/notifications/read-all`,
  adminOverview: `${baseUrl}/admin/overview`,
  adminUsers: (search?: string) => `${baseUrl}/admin/users${search ? `?search=${encodeURIComponent(search)}` : ''}`,
  adminUser: (id: string) => `${baseUrl}/admin/users/${id}`,
  adminUserSuspension: (id: string) => `${baseUrl}/admin/users/${id}/suspension`,
  adminGuilds: `${baseUrl}/admin/guilds`,
  adminGuild: (id: string) => `${baseUrl}/admin/guilds/${id}`,
  adminGuildMember: (guildId: string, memberId: string) => `${baseUrl}/admin/guilds/${guildId}/members/${memberId}`,
  adminAnnouncements: `${baseUrl}/admin/announcements`
} as const;
