import {
  DashboardAnalysisCard,
  DashboardModeButtons,
  DashboardOverloadCard,
  DashboardPlaceholder,
  DashboardProgressCard,
  DashboardSectionDivider,
  DashboardSectionTitle,
  DashboardXpCard
} from '../../components/dashboard/DashboardElements';
import { DashboardSidebar } from '../../components/dashboard/DashboardSidebar';
import { DashboardTopBar } from '../../components/dashboard/DashboardTopBar';

export function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#141219] text-[#e6e0ea] antialiased">
      <DashboardSidebar />
      <DashboardTopBar />

      <main className="ml-[240px] pt-24 p-6 min-h-screen">
        <div className="fixed top-28 right-6 z-50 brutalist-card bg-[#141219] border-[#45dfa4] text-[#45dfa4] px-8 py-3 flex items-center gap-2">
          <span className="text-2xl font-bold uppercase tracking-widest">Login Success!</span>
        </div>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
            <DashboardProgressCard />

            <div className="flex items-center justify-between">
              <DashboardSectionTitle title="Priority Quests" />
              <DashboardSectionDivider />
            </div>

            <DashboardPlaceholder />

            <section className="mt-4">
              <DashboardSectionTitle title="Change Modes" />
              <div className="mt-6">
                <DashboardModeButtons />
              </div>
            </section>
          </div>

          <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
            <DashboardOverloadCard />
            <DashboardAnalysisCard />
            <DashboardXpCard />
          </div>
        </div>
      </main>
    </div>
  );
}