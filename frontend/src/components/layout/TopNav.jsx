import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { LogOut, ChevronDown } from 'lucide-react';
import { PRIMARY_LINKS, DROPDOWN_LINKS } from './NavLinks';
import { useGetCurrentUser } from '../../hooks/InventoryHooks';
import { removeToken } from '../../utils/tokenUtils';

export default function TopNav() {
  const { data: user } = useGetCurrentUser();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const initials = user?.userName
    ? user.userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const formattedRole = user?.userRole
    ? user.userRole.charAt(0).toUpperCase() + user.userRole.slice(1).toLowerCase()
    : 'User';

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
    <header className="hidden lg:flex items-center h-14 px-6 md:px-8 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm sticky top-0 z-40">

      {/* Left: Brand */}
      <div className="flex items-center gap-2 min-w-[160px]">
        <span className="text-xl md:text-2xl font-bold text-gray-900 leading-none">Monisha</span>
        <span className="text-sm font-medium text-gray-500 tracking-wider">IMS</span>
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
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Right: User Dropdown */}
      <div className="min-w-[180px] flex justify-end" ref={dropdownRef}>
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`flex items-center gap-2.5 p-1 pl-1 pr-3 rounded-full transition-colors press-scale ${
              dropdownOpen ? 'bg-gray-100' : 'hover:bg-gray-100'
            }`}
            aria-label="User menu"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {initials}
            </div>
            <span className="text-base font-medium text-gray-900 hidden xl:block">{user?.userName || 'User'}</span>
            <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
              {/* User info */}
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900 m-0">{user?.userName || 'User'}</p>
                <p className="text-xs text-gray-500 m-0">{formattedRole}</p>
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
          )}
        </div>
      </div>
    </header>
  );
}
