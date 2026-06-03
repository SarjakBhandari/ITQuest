import { landingActions } from '../../lib/site-content';

import { AppLogo } from '../../components/ui/AppLogo';
import { ActionLink } from '../../components/ui/ActionLink';

function HeroSpark() {
  return <div className="absolute -z-10 h-72 w-72 rounded-full bg-[#a78bfa]/20 blur-3xl" aria-hidden />;
}

function PlayIcon() {
  return (
    <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function ContinueIcon() {
  return (
    <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.908 3.152-1.928 4.176-1.024 1.024-2.616 2.12-5.912 2.12-5.32 0-9.444-4.328-9.444-9.652S7.16 1.192 12.48 1.192c2.872 0 5.104 1.136 6.64 2.584l2.312-2.312C19.264.144 16.328-1 12.48-1c-6.84 0-12.48 5.64-12.48 12.48S5.64 23.96 12.48 23.96c3.696 0 6.48-1.224 8.68-3.512 2.256-2.256 2.968-5.432 2.968-7.944 0-.768-.064-1.488-.184-2.12H12.48z" />
    </svg>
  );
}

const icons = {
  play: <PlayIcon />,
  continue: <ContinueIcon />,
  google: <GoogleIcon />
} as const;

export function LandingPage() {
  return (
    <main
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-10 sm:px-6"
      data-purpose="main-landing-container"
    >
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top,rgba(167,139,250,0.18),transparent_35%),radial-gradient(circle_at_bottom,rgba(69,223,164,0.1),transparent_25%)]" aria-hidden />
      <HeroSpark />

      <section className="relative w-full max-w-2xl rounded-2xl border-4 border-black bg-[#18151f]/95 p-6 sm:p-10 shadow-retro-sharp-lg backdrop-blur-sm">
        <header className="flex flex-col items-center gap-6 text-center" data-purpose="branding">
          <AppLogo className="logo-frame bg-white p-1 rounded-sm" priority sizeClassName="w-28 h-28 sm:w-36 sm:h-36" />
          <div className="space-y-3">
            <p className="text-xs font-black uppercase tracking-[0.45em] text-[#45dfa4]">Quest Mode Activated</p>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white" data-purpose="app-title">
              IT Quest
            </h1>
            <p className="mx-auto max-w-md text-base sm:text-lg font-medium text-gray-300" data-purpose="app-slogan">
              Level up your workload with a sharper, cleaner dashboard journey.
            </p>
          </div>
        </header>

        <nav className="mt-10 grid gap-4 sm:grid-cols-3" aria-label="Primary actions" data-purpose="navigation-actions">
          {landingActions.map((action) => {
            const iconNode = icons[action.icon as keyof typeof icons] ?? null;
            return (
              <ActionLink
                key={action.label}
                className={`w-full justify-center ${action.className ?? ''}`.trim()}
                href={action.href}
                icon={iconNode}
                tone={action.tone as 'purple' | 'green' | 'gray'}
              >
                {action.label}
              </ActionLink>
            );
          })}
        </nav>
      </section>
    </main>
  );
}