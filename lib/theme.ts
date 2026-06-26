export type ThemeOption = {
  id: string;
  label: string;
  swatch: string;
};

export const THEME_OPTIONS: ThemeOption[] = [
  { id: 'violet', label: 'Violet', swatch: '#a78bfa' },
  { id: 'emerald', label: 'Emerald', swatch: '#23d97e' },
  { id: 'crimson', label: 'Crimson', swatch: '#f87171' },
  { id: 'amber', label: 'Amber', swatch: '#facc15' },
  { id: 'ocean', label: 'Ocean', swatch: '#60a5fa' },
  { id: 'rose', label: 'Rose', swatch: '#f472b6' }
];
