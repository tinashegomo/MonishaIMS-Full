import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { LogOut, ChevronDown } from 'lucide-react';
import { PRIMARY_LINKS, DROPDOWN_LINKS } from './NavLinks';
import { useGetCurrentUser } from '../../hooks/InventoryHooks';
import { removeToken } from '../../utils/tokenUtils';

export default function TopNav() {
  const { data: user } = useGetCurrentUser();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'U';
    const words = name.split(' ');
    return words.map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  const initials = getInitials(user?.userName);

  const formatRole = (role) => {
    if (!role) return 'User';
    const lower = role.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  };

  const formattedRole = formatRole(user?.userRole);

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  const handleNavigate = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <header className="hidden lg:flex items-center h-14 px-6 md:px-8 bg-surface-default border-b border-border-default shadow-sm sticky top-0 z-40">

      {/* Left: Brand */}
      <div className="flex items-center gap-2 min-w-[160px]">
        <span className="text-xl md:text-2xl font-bold text-text-primary leading-none">Monisha</span>
        <span className="text-sm font-medium text-text-muted tracking-wider">IMS</span>
      </div>

      {/* Center: Primary Nav Links */}
      <nav className="flex-1 flex items-center justify-center gap-2">
        {PRIMARY_LINKS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-2 px-5 py-2.5 rounded-full text-base font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-brand-primary text-neutral-0 shadow-sm'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-muted'
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Right: User Profile Dropdown */}
      <div className="min-w-[180px] flex justify-end">
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
            className="flex items-center gap-2.5 p-1 pl-1 pr-3 rounded-full transition-colors hover:bg-surface-muted press-scale"
            aria-label="User menu"
            aria-expanded={menuOpen}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {initials}
            </div>
            <span className="text-base font-medium text-text-primary hidden xl:block">{user?.userName || 'User'}</span>
            <ChevronDown className={`w-5 h-5 text-text-muted transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-surface-default border border-border-default rounded-xl shadow-lg overflow-hidden outline-none">
              {/* User info header */}
              <div className="px-4 py-3 border-b border-border-default">
                <p className="text-sm font-semibold text-text-primary m-0">{user?.userName || 'User'}</p>
                <p className="text-xs text-text-muted m-0">{formattedRole}</p>
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
      </div>
    </header>
  );
}
