import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { PRIMARY_LINKS, DROPDOWN_LINKS } from './NavLinks';
import { useGetCurrentUser } from '../../hooks/InventoryHooks';
import { removeToken } from '../../utils/tokenUtils';

export default function BottomNav() {
  const { data: user } = useGetCurrentUser();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const initials = user?.userName
    ? user.userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-[0_-1px_3px_rgba(0,0,0,0.05)] flex items-center justify-around px-2 z-50 lg:hidden">
      {/* Primary Links */}
      {PRIMARY_LINKS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-0.5 w-14 py-1 rounded-lg transition-colors ${
              isActive
                ? 'text-red-600'
                : 'text-gray-500 hover:text-gray-900'
            }`
          }
        >
          {item.icon}
          <span className="text-[10px] font-medium leading-tight">{item.label.split(' ')[0]}</span>
        </NavLink>
      ))}

      {/* Profile Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className={`flex flex-col items-center justify-center gap-0.5 w-14 py-1 rounded-lg transition-colors ${
            dropdownOpen ? 'text-red-600' : 'text-gray-500 hover:text-gray-900'
          }`}
          aria-label="Profile menu"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white font-bold text-[9px]">
            {initials}
          </div>
          <span className="text-[10px] font-medium leading-tight">More</span>
        </button>

        {dropdownOpen && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />

            {/* Dropdown menu — positioned above bottom nav */}
            <div className="absolute bottom-full right-0 mb-2 w-52 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
              {/* User info */}
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900 m-0">{user?.userName || 'User'}</p>
                <p className="text-xs text-gray-500 m-0">{user?.userRole || 'user'}</p>
              </div>

              {/* Dropdown links */}
              <div className="py-1">
                {DROPDOWN_LINKS.filter((item) => !item.adminOnly || user?.userRole === "ADMIN").map((item) => (
                  <button
                    key={item.to}
                    onClick={() => { setDropdownOpen(false); navigate(item.to); }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Divider + Sign Out */}
              <div className="border-t border-gray-100 py-1">
                <button
                  onClick={() => { setDropdownOpen(false); handleLogout(); }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
