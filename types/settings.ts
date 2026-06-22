export type UserSettings = {
  heroName: string;
  email: string;
  avatarColor: string | null;
  maxActiveQuests: number;
  emailNudgesEnabled: boolean;
};

export type SettingsResponse = {
  ok: boolean;
  message?: string;
  settings: UserSettings;
};
