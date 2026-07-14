import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun, LogOut } from 'lucide-react';
import { useGetCurrentUser } from '../../hooks/InventoryHooks';
import { removeToken } from '../../utils/tokenUtils';
import EditProfileForm from '../../components/profile/EditProfileForm';
import ChangePasswordForm from '../../components/profile/ChangePasswordForm';

export default function Profile() {
  // ─── Hooks ─────────────────────────────────────────────────────
  const { data: user, isLoading, isError } = useGetCurrentUser();
  const navigate = useNavigate();

  // ─── State: UI ─────────────────────────────────────────────────
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  // ─── Computed Values ─────────────────────────────────────────
  const initials = user?.userName
    ? user.userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  // ─── Functions: Handlers ───────────────────────────────────────
  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  // ─── Render ────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <h1 className="text-h2 font-bold text-text-primary mb-32">My Profile</h1>
        <div className="glass-panel min-h-[400px] flex items-center justify-center">
          <span className="text-body-normal text-text-muted">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="animate-fade-in">
        <h1 className="text-h2 font-bold text-text-primary mb-32">My Profile</h1>
        <div className="glass-panel min-h-[400px] flex items-center justify-center">
          <span className="text-body-normal text-danger-main">Failed to load profile.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-h2 font-bold text-text-primary mb-32">My Profile</h1>

      <div className="grid gap-16 md:grid-cols-2">
        {/* ── Section: User Info Card ─────────────────────────────── */}
        <div className="glass-panel p-16 md:p-20 animate-slide-up md:col-span-2">
          <div className="flex flex-col items-center gap-16 sm:flex-row sm:items-start">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary text-neutral-0 shadow-elevation-2">
              <span className="text-xl font-bold">{initials}</span>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <p className="text-h4 font-semibold text-text-primary">{user?.userName || 'Unknown'}</p>
              <p className="mt-4 text-body-small text-text-secondary capitalize">{user?.userRole || 'user'}</p>
            </div>
          </div>

          <div className="mt-16 grid gap-12 border-t border-border-default pt-16 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-ui-caption text-text-muted uppercase tracking-wide">Username</p>
              <p className="mt-4 text-body-small text-text-primary">{user?.userName || '—'}</p>
            </div>
            <div>
              <p className="text-ui-caption text-text-muted uppercase tracking-wide">Email</p>
              <p className="mt-4 text-body-small text-text-primary">{user?.userEmail || '—'}</p>
            </div>
            <div>
              <p className="text-ui-caption text-text-muted uppercase tracking-wide">Phone</p>
              <p className="mt-4 text-body-small text-text-primary">{user?.userPhoneNumber || '—'}</p>
            </div>
            <div>
              <p className="text-ui-caption text-text-muted uppercase tracking-wide">Role</p>
              <p className="mt-4 text-body-small text-text-primary capitalize">{user?.userRole || '—'}</p>
            </div>
          </div>
        </div>

        {/* ── Section: Edit Profile Form ──────────────────────────── */}
        <EditProfileForm user={user} />

        {/* ── Section: Change Password Form ───────────────────────── */}
        <ChangePasswordForm />

        {/* ── Section: Theme Toggle ───────────────────────────────── */}
        <div className="glass-panel p-16 animate-slide-up" style={{ animationDelay: '180ms' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-12">
              <div className="flex h-10 w-10 items-center justify-center rounded-input bg-surface-muted text-text-secondary">
                {isDark ? <Moon className="h-16 w-16" /> : <Sun className="h-16 w-16" />}
              </div>
              <div>
                <p className="text-body-small font-semibold text-text-primary">Dark Mode</p>
                <p className="text-ui-caption text-text-muted">
                  {isDark ? 'Currently using dark theme' : 'Currently using light theme'}
                </p>
              </div>
            </div>
            <button
              onClick={toggleDark}
              className={`relative inline-flex h-7 w-12 items-center rounded-pill transition-colors duration-200 ${
                isDark ? 'bg-brand-primary' : 'bg-surface-muted'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-neutral-0 shadow transition-transform duration-200 ${
                  isDark ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* ── Section: Logout ─────────────────────────────────────── */}
        <div className="glass-panel p-16 animate-slide-up" style={{ animationDelay: '240ms' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-12">
              <div className="flex h-10 w-10 items-center justify-center rounded-input bg-danger-bg text-danger-main">
                <LogOut className="h-16 w-16" />
              </div>
              <div>
                <p className="text-body-small font-semibold text-text-primary">Session</p>
                <p className="text-ui-caption text-text-muted">Sign out of your account</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-input bg-danger-main px-14 py-8 text-sm font-semibold text-neutral-0 hover:bg-danger-hover active:bg-danger-pressed press-scale transition-all duration-200"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
