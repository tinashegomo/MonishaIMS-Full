import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Moon, Sun, LogOut, Loader2, Save, Lock } from 'lucide-react';
import { useGetCurrentUser, useUpdateUser, useChangePassword } from '../../hooks/InventoryHooks';
import { removeToken } from '../../utils/tokenUtils';
import { updateUserSchema, updateUserDefaultValues } from '../../yupSchema/user/UpdateUserRequestDTO';
import { changePasswordSchema, changePasswordDefaultValues } from '../../yupSchema/user/ChangePasswordRequestDTO';

const inputBase = "w-full rounded-input border bg-surface-elevated px-16 py-12 text-body-normal text-text-primary placeholder:text-text-muted outline-none transition-all duration-200";
const inputOk = "border-border-default focus:border-border-focus focus-ring";
const inputErr = "border-danger-main focus:border-danger-main focus-ring-danger";

export default function Profile() {
  const { data: user, isLoading, isError } = useGetCurrentUser();
  const navigate = useNavigate();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  const { mutate: changePassword, isPending: isChangingPassword } = useChangePassword();

  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const [editSuccess, setEditSuccess] = useState('');
  const [editError, setEditError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { register: registerEdit, handleSubmit: handleSubmitEdit, reset: resetEdit, formState: { errors: errorsEdit } } = useForm({
    resolver: yupResolver(updateUserSchema),
  });

  const { register: registerPassword, handleSubmit: handleSubmitPassword, reset: resetPassword, formState: { errors: errorsPassword } } = useForm({
    resolver: yupResolver(changePasswordSchema),
  });

  useEffect(() => {
    if (user) {
      resetEdit({
        userName: user.userName || '',
        userEmail: user.userEmail || '',
        userPhoneNumber: user.userPhoneNumber || '',
      });
    }
  }, [user, resetEdit]);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  const onEditSubmit = (data) => {
    setEditSuccess('');
    setEditError('');
    updateUser({ id: user.userId, data }, {
      onSuccess: () => {
        setEditSuccess('Profile updated successfully');
        setTimeout(() => setEditSuccess(''), 3000);
      },
      onError: (err) => {
        setEditError(err.response?.data?.message || 'Failed to update profile');
      },
    });
  };

  const onPasswordSubmit = (data) => {
    setPasswordSuccess('');
    setPasswordError('');
    changePassword({ newPassword: data.newPassword }, {
      onSuccess: () => {
        setPasswordSuccess('Password changed successfully');
        resetPassword();
        setTimeout(() => setPasswordSuccess(''), 3000);
      },
      onError: (err) => {
        setPasswordError(err.response?.data?.message || 'Failed to change password');
      },
    });
  };

  const initials = user?.userName
    ? user.userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

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
        {/* User Info Card — full width */}
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

        {/* Edit Profile Card */}
        <div className="glass-panel p-16 md:p-20 animate-slide-up" style={{ animationDelay: '60ms' }}>
          <h2 className="text-body-normal font-semibold text-text-primary mb-16">Edit Profile</h2>

          {editSuccess && (
            <div className="mb-16 rounded-input border border-success-main bg-success-bg px-16 py-12 text-body-small text-success-main">
              {editSuccess}
            </div>
          )}
          {editError && (
            <div className="mb-16 rounded-input border border-danger-main bg-danger-bg px-16 py-12 text-body-small text-danger-main">
              {editError}
            </div>
          )}

          <form onSubmit={handleSubmitEdit(onEditSubmit)} className="space-y-16">
            <div>
              <label className="mb-8 block text-ui-label font-semibold text-text-secondary">Username</label>
              <input
                type="text"
                className={`${inputBase} ${errorsEdit.userName ? inputErr : inputOk}`}
                {...registerEdit("userName")}
              />
              {errorsEdit.userName && <p className="mt-4 text-body-small text-danger-main">{errorsEdit.userName.message}</p>}
            </div>
            <div>
              <label className="mb-8 block text-ui-label font-semibold text-text-secondary">Email</label>
              <input
                type="email"
                className={`${inputBase} ${errorsEdit.userEmail ? inputErr : inputOk}`}
                {...registerEdit("userEmail")}
              />
              {errorsEdit.userEmail && <p className="mt-4 text-body-small text-danger-main">{errorsEdit.userEmail.message}</p>}
            </div>
            <div>
              <label className="mb-8 block text-ui-label font-semibold text-text-secondary">Phone Number</label>
              <input
                type="text"
                className={`${inputBase} ${errorsEdit.userPhoneNumber ? inputErr : inputOk}`}
                {...registerEdit("userPhoneNumber")}
              />
              {errorsEdit.userPhoneNumber && <p className="mt-4 text-body-small text-danger-main">{errorsEdit.userPhoneNumber.message}</p>}
            </div>
            <button
              type="submit"
              disabled={isUpdating}
              className="inline-flex items-center gap-8 rounded-input bg-brand-primary px-14 py-8 text-sm font-semibold text-neutral-0 shadow-elevation-1 hover:bg-brand-hover hover:shadow-elevation-2 active:bg-brand-pressed press-scale transition-all duration-200 disabled:opacity-50"
            >
              {isUpdating ? <Loader2 className="h-16 w-16 animate-spin" /> : <Save className="h-16 w-16" />}
              Save Changes
            </button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="glass-panel p-16 md:p-20 animate-slide-up" style={{ animationDelay: '120ms' }}>
          <h2 className="text-body-normal font-semibold text-text-primary mb-16">Change Password</h2>

          {passwordSuccess && (
            <div className="mb-12 rounded-input border border-success-main bg-success-bg px-12 py-8 text-body-small text-success-main">
              {passwordSuccess}
            </div>
          )}
          {passwordError && (
            <div className="mb-12 rounded-input border border-danger-main bg-danger-bg px-12 py-8 text-body-small text-danger-main">
              {passwordError}
            </div>
          )}

          <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className="space-y-12">
            <div>
              <label className="mb-6 block text-ui-label font-semibold text-text-secondary">New Password</label>
              <input
                type="password"
                className={`${inputBase} ${errorsPassword.newPassword ? inputErr : inputOk}`}
                {...registerPassword("newPassword")}
              />
              {errorsPassword.newPassword && <p className="mt-4 text-body-small text-danger-main">{errorsPassword.newPassword.message}</p>}
            </div>
            <div>
              <label className="mb-6 block text-ui-label font-semibold text-text-secondary">Confirm New Password</label>
              <input
                type="password"
                className={`${inputBase} ${errorsPassword.confirmPassword ? inputErr : inputOk}`}
                {...registerPassword("confirmPassword")}
              />
              {errorsPassword.confirmPassword && <p className="mt-4 text-body-small text-danger-main">{errorsPassword.confirmPassword.message}</p>}
            </div>
            <button
              type="submit"
              disabled={isChangingPassword}
              className="inline-flex items-center gap-8 rounded-input bg-brand-primary px-14 py-8 text-sm font-semibold text-neutral-0 shadow-elevation-1 hover:bg-brand-hover hover:shadow-elevation-2 active:bg-brand-pressed press-scale transition-all duration-200 disabled:opacity-50"
            >
              {isChangingPassword ? <Loader2 className="h-16 w-16 animate-spin" /> : <Lock className="h-16 w-16" />}
              Update Password
            </button>
          </form>
        </div>

        {/* Theme Toggle Card */}
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
              onClick={() => setIsDark(!isDark)}
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

        {/* Logout Card */}
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
