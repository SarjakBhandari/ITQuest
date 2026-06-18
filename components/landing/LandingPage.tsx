'use client';

import { landingActions } from '../../lib/site-content';

import { PublicNavbar } from '../ui/PublicNavbar';
import { ActionLink } from '../ui/ActionLink';
import { AppLogo } from '../ui/AppLogo';

function PlayIcon() {
  return (
    <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 5l7 7-7 7M20 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

const features = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
      </svg>
    ),
    color: '#9d7aff',
    shadowColor: '#312e81',
    label: 'CLARITY',
    title: 'One place to start',
    description:
      'Begin with a single primary action and keep your next step obvious. No hunting, no guesswork, just a clear path into the product.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    color: '#00c88c',
    shadowColor: '#065f46',
    label: 'TRUST',
    title: 'Low-friction decisions',
    description:
      'The page shows what each option does before you click it, which reduces uncertainty and makes choice faster.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    color: '#f5c842',
    shadowColor: '#78350f',
    label: 'SPEED',
    title: 'Short, readable blocks',
    description:
      'The content is grouped into small chunks so users can scan, compare, and act without cognitive overload.',
  },
];

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0f0f13] text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(157,122,255,0.16),transparent_32%),radial-gradient(circle_at_bottom,rgba(0,200,140,0.1),transparent_30%)]" aria-hidden />
      <div className="absolute left-0 top-24 h-72 w-72 rounded-full bg-[#9d7aff]/10 blur-3xl" aria-hidden />
      <div className="absolute bottom-10 right-0 h-72 w-72 rounded-full bg-[#00c88c]/10 blur-3xl" aria-hidden />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <PublicNavbar />

        <section className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:py-14">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#9d7aff]/30 bg-[#9d7aff]/10 px-3 py-1 text-xs font-black uppercase tracking-[0.35em] text-[#d8caff]">
              Built for focus
            </div>

            <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Level up your workload without losing your place.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-white/70 sm:text-lg">
              IT Quest keeps the next step obvious. Start fast, resume instantly, and stay oriented with a dashboard that reduces friction instead of adding it.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <ActionLink href="/signup" tone="purple" icon={<PlayIcon />} className="justify-center text-base sm:text-lg">
                Start a new quest
              </ActionLink>
              <ActionLink href="/login" tone="green" icon={<ArrowRightIcon />} className="justify-center text-base sm:text-lg">
                Resume existing account
              </ActionLink>
            </div>

            <div className="mt-5 flex flex-wrap gap-3 text-sm text-white/60">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Fast sign-up</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Clear next steps</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Low cognitive load</span>
            </div>
          </div>

          <aside className="rounded-[1.75rem] border-4 border-black bg-[#18151f]/95 p-6 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex flex-col items-center text-center">
              <div className="rounded-2xl border-4 border-black bg-white p-2 shadow-[6px_6px_0px_0px_rgba(157,122,255,1)]">
                <AppLogo priority sizeClassName="h-28 w-28 sm:h-32 sm:w-32" />
              </div>
              <p className="mt-6 text-sm font-bold uppercase tracking-[0.35em] text-[#00c88c]">Stay oriented</p>
              <h2 className="mt-3 text-2xl font-black text-white">A landing page that answers 3 questions immediately</h2>
              <p className="mt-3 text-sm leading-6 text-white/65">
                What is this? IT Quest. What do I do next? Pick an action above. Why trust it? The interface keeps choices simple and consistent.
              </p>
            </div>

            <div className="mt-6 grid gap-3 text-left sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-[#d8caff]">Primary path</p>
                <p className="mt-2 text-sm text-white/75">New users start with signup, with no extra branching or ambiguity.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-[#8ff0c8]">Secondary path</p>
                <p className="mt-2 text-sm text-white/75">Returning users get a visible login route right beside the primary CTA.</p>
              </div>
            </div>
          </aside>
        </section>

        <section className="pb-10 lg:pb-14">
          <div className="mb-5 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs font-black uppercase tracking-[0.35em] text-white/45">Why this works</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="flex h-full items-start gap-4 rounded-3xl border-2 border-black bg-[#1a1727] p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
              >
                <div className="flex-shrink-0 rounded-2xl p-3" style={{ backgroundColor: `${feature.color}22`, color: feature.color }}>
                  {feature.icon}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-black tracking-tight text-white">{feature.title}</h3>
                    <span className="rounded-full px-2 py-0.5 text-[11px] font-black tracking-[0.3em]" style={{ backgroundColor: `${feature.color}22`, color: feature.color }}>
                      {feature.label}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-white/65">{feature.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <footer className="pb-2 text-center text-sm text-white/45">
          <p>Less friction. Fewer choices. Clearer next steps.</p>
        </footer>
      </div>
    </main>
  );
}