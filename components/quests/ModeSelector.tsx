'use client';

import { Icon } from '../ui/Icon';
import { MODE_CONFIG, type QuestMode } from '../../lib/quests/mode';

type ModeBtnProps = {
  label: QuestMode;
  icon: string;
  active: boolean;
  color: string;
  shadowColor: string;
  compact?: boolean;
  onClick: () => void;
};

function ModeBtn({ label, icon, active, color, shadowColor, compact, onClick }: ModeBtnProps) {
  return (
    <button
      aria-pressed={active}
      className={`flex flex-1 items-center justify-center gap-2 border-4 border-black font-extrabold uppercase tracking-wide transition-all ${compact ? 'min-h-[40px] py-2 text-xs' : 'min-h-[52px] py-3 text-sm'}`}
      onClick={onClick}
      style={{
        backgroundColor: active ? color : '#1e1c24',
        color: active ? '#0f0f13' : color,
        boxShadow: active ? 'none' : `3px 3px 0px 0px ${shadowColor}`,
        transform: active ? 'translate(3px, 3px)' : undefined,
        outline: active ? `2px solid ${color}` : undefined
      }}
      type="button"
    >
      <Icon className={compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} name={icon} />
      {label}
    </button>
  );
}

type ModeSelectorProps = {
  mode: QuestMode;
  onChange: (mode: QuestMode) => void;
  compact?: boolean;
};

export function ModeSelector({ mode, onChange, compact }: ModeSelectorProps) {
  return (
    <div aria-label="Select quest mode" className="flex gap-3" role="group">
      {MODE_CONFIG.map((item) => (
        <ModeBtn
          key={item.label}
          active={mode === item.label}
          color={item.color}
          compact={compact}
          icon={item.icon}
          label={item.label}
          onClick={() => onChange(item.label)}
          shadowColor={item.shadow}
        />
      ))}
    </div>
  );
}
