import React, { useState, useRef, useEffect } from 'react';
import {  User, Search, ChevronDown, Menu, X, Sun, Moon, LogOut } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

import { Link } from 'react-router-dom';
import NexaFlowLogo from '../../common/NexaFlowLogo';

interface HeaderProps {
  onMenuToggle: () => void;
  isSidebarOpen: boolean;
  onSearch: (query: string) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, isSidebarOpen, onSearch, isDarkMode, toggleTheme }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl transition-all duration-300 h-20 mb-6 ${
      isDarkMode 
        ? 'bg-[#050505]/95 border-b border-[#262626]' 
        : 'bg-white/95 border-b border-gray-200/50'
    }`}>
      <div className="flex items-center justify-between px-4 lg:px-8 h-20">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuToggle}
          className={`lg:hidden p-2 rounded-lg transition-all duration-200 ${
            isDarkMode 
              ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
          <NexaFlowLogo className="w-9 h-9 sm:w-10 sm:h-10 transition-transform duration-200 group-hover:scale-105" />
          <span className={`font-light text-xl sm:text-2xl tracking-tight text-white font-['Inter']`}>
            NexaFlow <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#8A66E6]">AI</span>
          </span>
        </Link>
        {/* Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4 lg:mx-8">
          <div className="relative w-full">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-400'
            }`} />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search tools, features..."
              className={`w-full rounded-full pl-11 pr-4 py-2 text-sm placeholder-gray-500 focus:outline-none transition-all duration-200 ${
                isDarkMode 
                  ? 'bg-[#050505] border border-[#262626] text-gray-100 placeholder-gray-500 focus:border-[#2640D9]' 
                  : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500 focus:border-gray-900'
              }`}
            />
          </div>
        </div>

        {/* Welcome Message */}
        <div className="hidden xl:block flex-shrink-0">
          <div className="text-right">
            <h2 className={`text-lg font-medium flex items-center justify-end ${
              isDarkMode ? 'text-gray-100' : 'text-gray-900'
            }`}>
              Hi {user?.username}
            </h2>
             <p className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>Ready to automate?</p>

          </div>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center space-x-2 lg:space-x-3 ml-2 lg:ml-6">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className={`p-2.5 rounded-lg transition-all duration-200 ${
              isDarkMode 
                ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            title="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          {/* User Profile Dropdown */}
          <div className={`relative flex items-center space-x-2 lg:space-x-3 ml-2 lg:ml-4 pl-2 lg:pl-4 border-l ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <button
              className={`w-9 h-9 rounded-full flex items-center justify-center focus:outline-none transition-colors ${
                isDarkMode ? 'bg-[#2640D9] hover:bg-[#6633E6]' : 'bg-gray-900'
              }`}
              onClick={() => setDropdownOpen((v) => !v)}
              aria-haspopup="true"
              aria-label="Profile menu"
            >
              <User className="w-4 h-4 text-white" />
            </button>
            <ChevronDown className={`w-4 h-4 cursor-pointer ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`} onClick={() => setDropdownOpen((v) => !v)} tabIndex={0} role="button" aria-label="Toggle profile menu" />
            {dropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute right-0 top-full mt-2 w-56 bg-[#0b0b0f] rounded-2xl shadow-2xl py-3 z-50 border border-[#262626] flex flex-col gap-1 animate-fadeIn"
                style={{ minWidth: 200 }}
                role="menu"
              >
                <div className="flex items-center gap-3 px-5 pb-2 border-b border-[#262626]">
                  <div className="bg-[#2640D9] rounded-full w-9 h-9 flex items-center justify-center text-white font-bold text-base shadow-md">
                    {user?.username?.[0]?.toUpperCase() || <User className="w-5 h-5" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-white text-sm">{user?.username}</span>
                    {user?.email && <span className="text-xs text-gray-300">{user.email}</span>}
                  </div>
                </div>
               
                <button
                  className="flex items-center gap-2 px-5 py-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors duration-150 text-sm font-semibold"
                  onClick={logout}
                  role="menuitem"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
