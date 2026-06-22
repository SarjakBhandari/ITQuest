export const AVATAR_COLORS = ['#a78bfa', '#facc15', '#23d97e', '#60a5fa', '#f87171', '#45dfa4', '#f97316', '#cebdff'];

export function resolveAvatarColor(heroName: string, explicitColor?: string | null) {
  if (explicitColor) return explicitColor;
  let hash = 0;
  for (let i = 0; i < heroName.length; i += 1) hash = (hash + heroName.charCodeAt(i)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[hash];
}
