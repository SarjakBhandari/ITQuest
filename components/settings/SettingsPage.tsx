'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { logout } from '../../lib/api/auth';
import { changePassword, getMySettings, updatePreferences, updateProfile } from '../../lib/api/settings';
import { getMyStats } from '../../lib/api/stats';
import { AVATAR_COLORS, resolveAvatarColor } from '../../lib/avatar';
import { THEME_OPTIONS } from '../../lib/theme';
import { DashboardSidebar } from '../dashboard/DashboardSidebar';
import { DashboardTopBar } from '../dashboard/DashboardTopBar';
import { Icon } from '../ui/Icon';
import { useToast } from '../ui/ToastProvider';

import type { UserSettings } from '../../types/settings';
import type { UserStats } from '../../types/stats';

function SettingsCard({
  title,
  icon,
  children
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-2 border-[#2a2733] bg-[#1e1c24] p-6">
      <h2 className="mb-5 flex items-center gap-2 text-sm font-extrabold uppercase tracking-widest text-[#a78bfa]">
        <Icon className="h-4 w-4" name={icon} />
        {title}
      </h2>
      {children}
    </section>
  );
}

export function SettingsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [overview, setOverview] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [heroNameInput, setHeroNameInput] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [maxActiveQuestsInput, setMaxActiveQuestsInput] = useState(5);
  const [emailNudgesInput, setEmailNudgesInput] = useState(true);
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getMySettings()
      .then(({ settings: fetched }) => {
        if (cancelled) return;
        setSettings(fetched);
        setHeroNameInput(fetched.heroName);
        setMaxActiveQuestsInput(fetched.maxActiveQuests);
        setEmailNudgesInput(fetched.emailNudgesEnabled);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Unable to load your settings.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    getMyStats()
      .then(({ stats }) => {
        if (!cancelled) setOverview(stats);
      })
      .catch(() => {
        /* profile overview is a nice-to-have, settings still work without it */
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      router.push('/login');
    }
  };

  const saveProfile = async () => {
    if (!settings) return;
    setIsSavingProfile(true);
    try {
      const { settings: updated } = await updateProfile({ heroName: heroNameInput });
      setSettings(updated);
      showToast('Profile updated.', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to update profile.', 'error');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const pickAvatarColor = async (color: string) => {
    if (!settings) return;
    try {
      const { settings: updated } = await updateProfile({ avatarColor: color });
      setSettings(updated);
      showToast('Avatar color updated.', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to update avatar.', 'error');
    }
  };

  const pickTheme = async (themeId: string) => {
    if (!settings) return;
    const previousTheme = settings.theme;
    document.documentElement.setAttribute('data-theme', themeId);
    setSettings({ ...settings, theme: themeId });
    try {
      const { settings: updated } = await updateProfile({ theme: themeId });
      setSettings(updated);
      showToast('Theme updated.', 'success');
    } catch (err) {
      document.documentElement.setAttribute('data-theme', previousTheme);
      setSettings({ ...settings, theme: previousTheme });
      showToast(err instanceof Error ? err.message : 'Unable to update theme.', 'error');
    }
  };

  const savePreferences = async () => {
    setIsSavingPreferences(true);
    try {
      const { settings: updated } = await updatePreferences({
        maxActiveQuests: maxActiveQuestsInput,
        emailNudgesEnabled: emailNudgesInput
      });
      setSettings(updated);
      showToast('Preferences updated.', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to update preferences.', 'error');
    } finally {
      setIsSavingPreferences(false);
    }
  };

  const savePassword = async () => {
    setPasswordError('');
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }
    setIsSavingPassword(true);
    try {
      await changePassword({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('Password changed.', 'success');
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Unable to change password.');
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0f0f13] text-[#e5e7eb]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <DashboardSidebar onLogout={handleLogout} />
      <DashboardTopBar title="Profile" />

      <div className="flex flex-1 flex-col overflow-auto pt-20 lg:ml-[240px] lg:pt-24">
        {error ? (
          <p className="border-b-2 border-[#f87171] bg-[#f87171]/10 px-6 py-2 text-sm text-[#fecaca]">{error}</p>
        ) : null}

        {isLoading || !settings ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="flex items-center gap-2 text-sm text-gray-500">
              <Icon className="h-4 w-4 animate-spin" name="schedule" />
              Loading your settings...
            </p>
          </div>
        ) : (
          <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-6">
            <section
              className="flex flex-wrap items-center gap-6 border-2 border-[var(--theme-accent)] bg-[#1e1c24] p-6 shadow-[6px_6px_0px_0px_#000]"
              aria-label="Profile overview"
            >
              <div
                className="flex h-20 w-20 flex-shrink-0 items-center justify-center border-4 border-black text-3xl font-extrabold text-[#0f0f13]"
                style={{ backgroundColor: resolveAvatarColor(settings.heroName, settings.avatarColor) }}
              >
                {settings.heroName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-2xl font-extrabold text-white">{settings.heroName}</p>
                <p className="text-sm text-gray-500">{settings.email}</p>
                {overview ? (
                  <div className="mt-3 flex flex-wrap gap-4 text-xs font-bold uppercase tracking-widest text-[#9ca3af]">
                    <span className="flex items-center gap-1.5" style={{ color: '#a78bfa' }}>
                      <Icon className="h-3.5 w-3.5" name="star" /> Level {overview.level}
                    </span>
                    <span className="flex items-center gap-1.5" style={{ color: '#f97316' }}>
                      <Icon className="h-3.5 w-3.5" name="local_fire_department" /> {overview.streak} day streak
                    </span>
                    <span className="flex items-center gap-1.5" style={{ color: '#45dfa4' }}>
                      <Icon className="h-3.5 w-3.5" name="task_alt" /> {overview.completedQuestsCount} completed
                    </span>
                    <span className="flex items-center gap-1.5" style={{ color: '#facc15' }}>
                      <Icon className="h-3.5 w-3.5" name="trophy" /> {overview.achievements.filter((a) => a.earned).length}/
                      {overview.achievements.length} badges
                    </span>
                  </div>
                ) : null}
              </div>
            </section>

            <SettingsCard icon="person" title="Edit Profile">
              <div className="mb-5 flex items-center gap-4">
                <div
                  className="flex h-16 w-16 flex-shrink-0 items-center justify-center border-2 border-black text-2xl font-extrabold text-[#0f0f13]"
                  style={{ backgroundColor: resolveAvatarColor(settings.heroName, settings.avatarColor) }}
                >
                  {settings.heroName.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-wrap gap-2">
                  {AVATAR_COLORS.map((color) => (
                    <button
                      key={color}
                      aria-label={`Use avatar color ${color}`}
                      aria-pressed={settings.avatarColor === color}
                      className="h-8 w-8 border-2 transition-transform hover:scale-110"
                      onClick={() => pickAvatarColor(color)}
                      style={{
                        backgroundColor: color,
                        borderColor: settings.avatarColor === color ? '#ffffff' : '#000000'
                      }}
                      type="button"
                    />
                  ))}
                </div>
              </div>

              <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-[#23d97e]" htmlFor="hero-name">
                Hero Name
              </label>
              <div className="flex gap-3">
                <input
                  id="hero-name"
                  className="flex-1 border-2 border-[#3f3d46] bg-[#2a2733] px-4 py-3 text-white placeholder-gray-600 focus:border-[#a78bfa] focus:outline-none"
                  maxLength={24}
                  minLength={3}
                  value={heroNameInput}
                  onChange={(event) => setHeroNameInput(event.target.value)}
                />
                <button
                  className="border-2 border-black bg-[#a78bfa] px-5 py-3 text-sm font-bold uppercase tracking-wide text-[#0f0f13] transition-all hover:brightness-110 disabled:opacity-60"
                  disabled={isSavingProfile || heroNameInput.trim().length < 3}
                  onClick={saveProfile}
                  type="button"
                >
                  {isSavingProfile ? 'Saving...' : 'Save'}
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500">{settings.email}</p>
            </SettingsCard>

            <SettingsCard icon="sparkle" title="Appearance">
              <p className="mb-4 text-sm text-gray-400">
                Pick an accent theme for the sidebar, navigation, and key cards across the app.
              </p>
              <div className="flex flex-wrap gap-3">
                {THEME_OPTIONS.map((theme) => (
                  <button
                    key={theme.id}
                    aria-label={`Use ${theme.label} theme`}
                    aria-pressed={settings.theme === theme.id}
                    className="flex w-24 flex-col items-center gap-2 border-2 p-3 transition-transform hover:scale-105"
                    onClick={() => pickTheme(theme.id)}
                    style={{
                      borderColor: settings.theme === theme.id ? theme.swatch : '#3f3d46',
                      backgroundColor: settings.theme === theme.id ? '#2a2733' : '#1a1827'
                    }}
                    type="button"
                  >
                    <span className="h-8 w-8 border-2 border-black" style={{ backgroundColor: theme.swatch }} />
                    <span
                      className="text-xs font-bold uppercase tracking-wide"
                      style={{ color: settings.theme === theme.id ? theme.swatch : '#9ca3af' }}
                    >
                      {theme.label}
                    </span>
                  </button>
                ))}
              </div>
            </SettingsCard>

            <SettingsCard icon="warning" title="Overload Threshold">
              <p className="mb-4 text-sm text-gray-400">
                The Quest Board and Dashboard flag you as overloaded once your active (In Progress) quests pass this
                number. Lower it if small workloads stress you out, raise it if you thrive on multitasking.
              </p>
              <div className="flex items-center gap-4">
                <input
                  aria-label="Max active quests before overload"
                  className="h-2 flex-1 cursor-pointer appearance-none outline-none"
                  max={20}
                  min={1}
                  onChange={(event) => setMaxActiveQuestsInput(Number(event.target.value))}
                  style={{
                    background: `linear-gradient(to right, #f87171 0%, #f87171 ${(maxActiveQuestsInput / 20) * 100}%, #3f3d46 ${(maxActiveQuestsInput / 20) * 100}%, #3f3d46 100%)`
                  }}
                  type="range"
                  value={maxActiveQuestsInput}
                />
                <span className="w-12 flex-shrink-0 text-center text-xl font-extrabold text-[#f87171]">
                  {maxActiveQuestsInput}
                </span>
              </div>

              <div className="mt-6 flex items-center justify-between border-t-2 border-[#2a2733] pt-5">
                <div>
                  <p className="text-sm font-bold text-white">Email nudges</p>
                  <p className="text-xs text-gray-500">Get an email if you go quiet for a few days or quests pile up.</p>
                </div>
                <button
                  aria-checked={emailNudgesInput}
                  aria-label="Toggle email nudges"
                  className="relative h-7 w-14 flex-shrink-0 border-2 border-black transition-colors"
                  onClick={() => setEmailNudgesInput((prev) => !prev)}
                  role="switch"
                  style={{ backgroundColor: emailNudgesInput ? '#23d97e' : '#2a2733' }}
                  type="button"
                >
                  <span
                    className="absolute top-0.5 h-5 w-5 bg-white transition-transform"
                    style={{ transform: emailNudgesInput ? 'translateX(28px)' : 'translateX(2px)' }}
                  />
                </button>
              </div>

              <button
                className="mt-6 w-full border-2 border-black bg-[#a78bfa] py-3 text-sm font-bold uppercase tracking-wide text-[#0f0f13] transition-all hover:brightness-110 disabled:opacity-60"
                disabled={isSavingPreferences}
                onClick={savePreferences}
                type="button"
              >
                {isSavingPreferences ? 'Saving...' : 'Save Preferences'}
              </button>
            </SettingsCard>

            <SettingsCard icon="lock" title="Security">
              <div className="flex flex-col gap-3">
                <input
                  className="border-2 border-[#3f3d46] bg-[#2a2733] px-4 py-3 text-white placeholder-gray-600 focus:border-[#a78bfa] focus:outline-none"
                  placeholder="Current password"
                  type="password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                />
                <input
                  className="border-2 border-[#3f3d46] bg-[#2a2733] px-4 py-3 text-white placeholder-gray-600 focus:border-[#a78bfa] focus:outline-none"
                  placeholder="New password"
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                />
                <input
                  className="border-2 border-[#3f3d46] bg-[#2a2733] px-4 py-3 text-white placeholder-gray-600 focus:border-[#a78bfa] focus:outline-none"
                  placeholder="Confirm new password"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
                {passwordError ? (
                  <p className="text-sm text-[#f87171]" role="alert">
                    {passwordError}
                  </p>
                ) : null}
                <button
                  className="border-2 border-black bg-[#f87171] py-3 text-sm font-bold uppercase tracking-wide text-[#0f0f13] transition-all hover:brightness-110 disabled:opacity-60"
                  disabled={isSavingPassword || !currentPassword || !newPassword}
                  onClick={savePassword}
                  type="button"
                >
                  {isSavingPassword ? 'Updating...' : 'Change Password'}
                </button>
              </div>
            </SettingsCard>
          </main>
        )}
      </div>
    </div>
  );
}
