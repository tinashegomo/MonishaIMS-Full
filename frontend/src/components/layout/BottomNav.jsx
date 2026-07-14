import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { PRIMARY_LINKS, DROPDOWN_LINKS } from './NavLinks';
import { useGetCurrentUser } from '../../hooks/InventoryHooks';
import { removeToken } from '../../utils/tokenUtils';

export default function BottomNav() {
  const { data: user } = useGetCurrentUser();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'U';
    const words = name.split(' ');
    return words.map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  const initials = getInitials(user?.userName);

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  const handleNavigate = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface-default border-t border-border-default shadow-[0_-1px_3px_rgba(0,0,0,0.05)] flex items-center justify-around px-2 pt-1 pb-[calc(env(safe-area-inset-bottom)+0.25rem)] z-50 lg:hidden">
      {/* pb uses env(safe-area-inset-bottom) so the nav sits above the gesture bar on phones with no home button. */}

      {/* Primary Links */}
      {PRIMARY_LINKS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-0.5 w-14 py-1 rounded-lg transition-colors ${
              isActive
                ? 'text-brand-primary'
                : 'text-text-muted hover:text-text-primary'
            }`
          }
        >
          {item.icon}
          <span className="text-[10px] font-medium leading-tight">{item.label.split(' ')[0]}</span>
        </NavLink>
      ))}

      {/* Profile Dropdown */}
      <div
        className="relative"
        tabIndex={-1}
        onBlur={(e) => {
          if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget)) {
            setMenuOpen(false);
          }
        }}
      >
        <button
          type="button"
          onFocus={() => setMenuOpen(true)}
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex flex-col items-center justify-center gap-0.5 w-14 py-1 rounded-lg transition-colors text-text-muted hover:text-text-primary"
          aria-label="Profile menu"
          aria-expanded={menuOpen}
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white font-bold text-[9px]">
            {initials}
          </div>
          <span className="text-[10px] font-medium leading-tight">More</span>
        </button>

        {menuOpen && (
          <div className="absolute bottom-full right-0 mb-2 w-52 bg-surface-default border border-border-default rounded-xl shadow-lg overflow-hidden outline-none">
            {/* User info header */}
            <div className="px-4 py-3 border-b border-border-default">
              <p className="text-sm font-semibold text-text-primary m-0">{user?.userName || 'User'}</p>
              <p className="text-xs text-text-muted m-0">{user?.userRole || 'user'}</p>
            </div>

            {/* Navigation links */}
            <div className="py-1">
              {DROPDOWN_LINKS.filter((item) => !item.adminOnly || user?.userRole === "ADMIN").map((item) => (
                <button
                  key={item.to}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleNavigate(item.to);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-muted transition-colors"
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>

            {/* Sign Out */}
            <div className="border-t border-border-default py-1">
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleLogout();
                }}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-danger-main hover:bg-danger-bg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
