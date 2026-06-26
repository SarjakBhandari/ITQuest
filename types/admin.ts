export type AdminOverview = {
  totalUsers: number;
  totalGuilds: number;
  totalQuestsCompleted: number;
  suspendedUsers: number;
  activeUsersLast7Days: number;
  totalXpAwarded: number;
  signupsByDay: { date: string; count: number }[];
};

export type AdminUser = {
  id: string;
  heroName: string;
  email: string;
  xp: number;
  streak: number;
  freezesAvailable: number;
  maxActiveQuests: number;
  completedQuestsCount: number;
  isAdmin: boolean;
  suspended: boolean;
  suspendedReason: string | null;
  hasGuild: boolean;
  lastLoginAt: string | null;
  createdAt: string;
};

export type AdminGuildSummary = {
  id: string;
  name: string;
  code: string;
  ownerName: string;
  memberCount: number;
  createdAt: string;
};

export type AdminGuildMember = {
  id: string;
  heroName: string;
  email: string;
  xp: number;
  isOwner: boolean;
};

export type AdminGuildDetail = {
  id: string;
  name: string;
  code: string;
  ownerId: string;
  createdAt: string;
  members: AdminGuildMember[];
};

export type Announcement = {
  id: string;
  title: string;
  body: string;
  audience: 'all' | 'user';
  recipientCount: number;
  createdAt: string;
};
