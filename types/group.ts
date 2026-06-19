export type GroupLeaderboardEntry = {
  id: string;
  heroName: string;
  seasonXp: number;
  rank: number;
  isYou: boolean;
  isOwner: boolean;
};

export type GroupSeason = {
  name: string;
  endsAt: string;
};

export type GroupSummary = {
  id: string;
  name: string;
  code: string;
  ownerId: string;
  memberCount: number;
  leaderboard: GroupLeaderboardEntry[];
  season: GroupSeason;
};

export type GroupResponse = {
  ok: boolean;
  message?: string;
  group: GroupSummary | null;
};
