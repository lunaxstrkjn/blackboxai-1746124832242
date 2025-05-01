import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  {
    name: 'Dashboard',
    to: '/dashboard',
    icon: HomeIcon,
  },
  {
    name: 'Data Nasabah',
    to: '/nasabah',
    icon: UserGroupIcon,
  },
  {
    name: 'Data Pinjaman',
    to: '/pinjaman',
    icon: CurrencyDollarIcon,
  },
];

const Sidebar = () => {
  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-30">
      {/* Logo Section */}
      <div className="h-16 flex items-center justify-center border-b border-gray-200">
        <img
          src="https://via.placeholder.com/40x40"
          alt="Logo"
          className="h-10 w-10 rounded-full"
        />
      </div>

      {/* Navigation Links */}
      <nav className="mt-6 px-3">
        <div className="space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                }`
              }
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
        <div className="text-xs text-center text-gray-500">
          © {new Date().getFullYear()} Koperasi Nurul Ulum
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
