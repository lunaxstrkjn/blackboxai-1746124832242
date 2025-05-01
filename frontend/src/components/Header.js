import React from 'react';
import { Menu } from '@headlessui/react';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import useAuth from '../hooks/useAuth';

const Header = () => {
  const { logout } = useAuth();

  return (
    <header className="fixed top-0 right-0 left-64 h-16 bg-white border-b border-gray-200 z-20">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center">
          <h1 className="text-2xl font-display font-semibold text-primary-600">
            Koperasi Nurul Ulum
          </h1>
        </div>

        {/* User Menu */}
        <div className="relative">
          <Menu>
            <Menu.Button className="flex items-center space-x-2 hover:text-primary-600 transition-colors duration-200">
              <UserCircleIcon className="h-8 w-8" />
              <span className="font-medium">Admin</span>
            </Menu.Button>

            <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={logout}
                    className={`${
                      active ? 'bg-primary-50 text-primary-600' : 'text-gray-700'
                    } w-full text-left px-4 py-2 text-sm`}
                  >
                    <i className="fas fa-sign-out-alt mr-2"></i>
                    Logout
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Menu>
        </div>
      </div>
    </header>
  );
};

export default Header;
