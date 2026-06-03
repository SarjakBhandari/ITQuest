import { DashboardIcon } from '../../components/dashboard/DashboardIcon';
import { BrutalistCard } from '../../components/ui/BrutalistCard';
import { RetroButton } from '../../components/ui/RetroButton';

export function DashboardProgressCard() {
  return (
    <section className="brutalist-card flex flex-col gap-6 bg-[#211e25] p-6 sm:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <span className="text-2xl font-bold text-[#cebdff]">Level 1</span>
        <div className="flex flex-1 flex-col items-center">
          <div className="relative h-8 w-full max-w-xl overflow-hidden border-2 border-black bg-[#36343b]">
            <div className="h-full bg-[#45dfa4] w-[15%]" style={{ boxShadow: 'inset -4px 0 0 rgba(0,0,0,0.2)' }} />
          </div>
          <span className="text-sm font-bold text-[#ffc640] mt-1">50 / 5,000 XP</span>
        </div>
        <span className="text-2xl font-bold text-[#cebdff]">Level 2</span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
        <div className="flex items-center gap-6">
          <BrutalistCard className="flex h-24 w-24 items-center justify-center bg-[#ffc640]">
            <span className="text-5xl font-black text-black">1</span>
          </BrutalistCard>
          <div className="flex flex-col">
            <span className="flex items-center gap-2 font-bold text-[#ffc640] uppercase">
              <DashboardIcon filled name="local_fire_department" />
              Streak
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-3 md:items-end">
          <span className="flex items-center gap-2 font-bold text-[#45dfa4] uppercase">
            <DashboardIcon name="ac_unit" />
            2 Freeze Available
          </span>
          <RetroButton className="bg-[#45dfa4] text-[#003825] px-12 py-2 font-bold uppercase tracking-widest">Normal Mode</RetroButton>
        </div>
      </div>
    </section>
  );
}

export function DashboardSectionTitle({ title }: { title: string }) {
  return <h3 className="text-2xl font-bold text-[#e6e0ea]">{title}</h3>;
}

export function DashboardSectionDivider() {
  return <div className="h-1 flex-1 mx-4 bg-[#36343b] border-b-2 border-black" />;
}

export function DashboardPlaceholder() {
  return (
    <div className="grid h-64 grid-cols-1 place-items-center gap-4 border-4 border-dashed border-[#494552] opacity-60">
      <p className="text-center text-sm font-bold uppercase tracking-widest text-[#cac4d4]">No active priority quests</p>
    </div>
  );
}

export function DashboardModeButtons() {
  return (
    <div className="brutalist-card flex flex-wrap gap-4 bg-[#211e25] p-6">
      <RetroButton className="min-w-[120px] flex-1 justify-center bg-[#45dfa4] font-black uppercase text-[#003825]">Normal</RetroButton>
      <RetroButton className="min-w-[120px] flex-1 justify-center bg-[#ffc640] font-black uppercase text-[#261a00]">Certs</RetroButton>
      <RetroButton className="min-w-[120px] flex-1 justify-center bg-[#ffb4ab] font-black uppercase text-[#690005]">Exam</RetroButton>
    </div>
  );
}

export function DashboardOverloadCard() {
  return (
    <BrutalistCard className="bg-[#211e25] p-6 border-red-400/30">
      <div className="flex items-center gap-2 text-[#ffb4ab] mb-6">
        <DashboardIcon name="warning" />
        <span className="text-2xl font-bold uppercase">System Overload</span>
      </div>
      <div className="relative w-40 h-40 mx-auto flex items-center justify-center mb-6">
        <svg className="w-full h-full transform -rotate-90">
          <circle className="text-[#36343b]" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeWidth="12" />
          <circle className="text-[#ffb4ab]" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeDasharray="440" strokeDashoffset="440" strokeWidth="12" />
        </svg>
        <span className="absolute text-4xl font-black">0%</span>
      </div>
      <p className="text-center text-[#cac4d4]">You’re new here. Jump into a quest and start your adventure.</p>
    </BrutalistCard>
  );
}

export function DashboardAnalysisCard() {
  return (
    <BrutalistCard className="bg-[#211e25] p-6">
      <h4 className="text-sm font-bold uppercase tracking-widest text-[#cac4d4] mb-6">Workload Analysis</h4>
      <div className="flex items-center gap-8">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full" viewBox="0 0 36 36">
            <circle cx="18" cy="18" fill="transparent" r="15.9" stroke="#ffc640" strokeDasharray="100 0" strokeWidth="4" />
            <circle cx="18" cy="18" fill="transparent" r="15.9" stroke="#45dfa4" strokeDasharray="75 25" strokeDashoffset="0" strokeWidth="4" />
            <circle cx="18" cy="18" fill="transparent" r="15.9" stroke="#cebdff" strokeDasharray="45 55" strokeDashoffset="0" strokeWidth="4" />
            <circle cx="18" cy="18" fill="#211e25" r="12" />
          </svg>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#cebdff] border border-black" />
            <span className="text-xs font-bold text-[#cac4d4]">Classes (45%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#45dfa4] border border-black" />
            <span className="text-xs font-bold text-[#cac4d4]">Certs (30%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#ffc640] border border-black" />
            <span className="text-xs font-bold text-[#cac4d4]">Projects (25%)</span>
          </div>
        </div>
      </div>
    </BrutalistCard>
  );
}

export function DashboardXpCard() {
  return (
    <BrutalistCard className="bg-[#a78bfa] p-6 text-[#3c1989]">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-bold uppercase tracking-widest opacity-80">Weekly XP Potential</h4>
        <DashboardIcon name="trending_up" />
      </div>
      <span className="text-5xl font-black mb-4 block">+340 XP</span>
      <p className="text-sm opacity-90">No quests for now! You can earn your XP simply by logging in!</p>
    </BrutalistCard>
  );
}