export type UserSettings = {
  heroName: string;
  email: string;
  avatarColor: string | null;
  theme: string;
  maxActiveQuests: number;
  emailNudgesEnabled: boolean;
  weeklyXpTarget: number;
};

export type SettingsResponse = {
  ok: boolean;
  message?: string;
  settings: UserSettings;
};
