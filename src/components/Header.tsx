/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Menu, X, GraduationCap, ShieldCheck, UserCheck, Flame, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  isAdminLoggedIn: boolean;
  onLogout: () => void;
  theme?: 'light' | 'dark';
  toggleTheme?: () => void;
}

export default function Header({ 
  currentPage, 
  setCurrentPage, 
  isAdminLoggedIn, 
  onLogout,
  theme = 'light',
  toggleTheme 
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'mission', label: 'Mission & Vision' },
    { id: 'subjects', label: 'Subjects Offered' },
    { id: 'projects', label: 'Ongoing Projects' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'results', label: 'Results Sheet' },
    { id: 'payment', label: 'Fees & Payment' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleNavClick = (id: string) => {
    setCurrentPage(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-brand-green text-white border-b-4 border-brand-yellow shadow-md">
      {/* Top Banner (Address & Quick Info) - High Density Compact version */}
      <div className="bg-brand-oxblood text-white text-[10px] px-4 py-1.5 hidden md:flex justify-between items-center font-sans tracking-wide">
        <div className="flex items-center space-x-4">
          <span>📍 Ngozika Housing Estate, Awka, Anambra State, Nigeria.</span>
          <span>📞 07068986865, 09054145339</span>
        </div>
        <div className="flex items-center space-x-3 font-semibold">
          <span className="flex items-center space-x-1">
            <Flame className="w-3.5 h-3.5 text-brand-yellow animate-pulse" />
            <span className="text-brand-yellow">Character • Faith • Excellence</span>
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo & School Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleNavClick('home')}>
            <div className="relative flex items-center justify-center w-11 h-11 rounded-full bg-white text-brand-green font-bold border-2 border-brand-yellow overflow-hidden shrink-0 shadow-sm">
              <img
                src="https://i.ibb.co/HTP5dHHD/Whats-App-Image-2026-06-30-at-10-02-49-AM.jpg"
                alt="Holy Ghost Academy Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold font-heading text-white leading-none uppercase tracking-tight">
                Holy Ghost Academy
              </h1>
              <p className="text-[9px] uppercase tracking-widest text-brand-yellow font-bold mt-1">
                Secondary School, Awka
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-1 items-center">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-2.5 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                  currentPage === item.id
                    ? 'bg-brand-oxblood text-white border border-brand-yellow/30'
                    : 'text-white hover:text-brand-yellow hover:bg-white/10'
                }`}
              >
                {item.label}
              </button>
            ))}

            {/* Admin Dashboard Navigation Icon */}
            <button
              onClick={() => handleNavClick('admin')}
              title="Admin Portal"
              className={`ml-1.5 p-2 rounded transition-all duration-150 flex items-center justify-center cursor-pointer ${
                currentPage === 'admin'
                  ? 'bg-brand-oxblood text-brand-yellow border border-brand-yellow/30'
                  : 'text-white hover:text-brand-yellow hover:bg-white/10'
              }`}
            >
              {isAdminLoggedIn ? (
                <UserCheck className="w-4 h-4" />
              ) : (
                <ShieldCheck className="w-4 h-4" />
              )}
            </button>

            {/* Global Theme Toggle Button (Desktop) */}
            {toggleTheme && (
              <button
                type="button"
                onClick={toggleTheme}
                title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
                aria-label={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
                className="ml-1 p-2 rounded transition-all duration-150 flex items-center justify-center cursor-pointer text-white hover:text-brand-yellow hover:bg-white/10"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-brand-yellow" />
                ) : (
                  <Moon className="w-4 h-4 text-white" />
                )}
              </button>
            )}
          </nav>

          {/* Mobile Menu Buttons */}
          <div className="flex items-center lg:hidden space-x-2">
            {toggleTheme && (
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 rounded-full cursor-pointer bg-white/10 text-white hover:bg-white/20 transition"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle Portal Theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4.5 h-4.5 text-brand-yellow" />
                ) : (
                  <Moon className="w-4.5 h-4.5 text-white" />
                )}
              </button>
            )}

            <button
              onClick={() => handleNavClick('admin')}
              className={`p-2 rounded-full cursor-pointer ${
                currentPage === 'admin' ? 'bg-brand-oxblood text-white' : 'bg-white/10 text-white'
              }`}
              title="Admin Portal"
            >
              {isAdminLoggedIn ? (
                <UserCheck className="w-4.5 h-4.5" />
              ) : (
                <ShieldCheck className="w-4.5 h-4.5" />
              )}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-white hover:text-brand-yellow hover:bg-white/10 focus:outline-hidden cursor-pointer"
            >
              {isMobileMenuOpen ? (
                <X className="w-5.5 h-5.5" />
              ) : (
                <Menu className="w-5.5 h-5.5" />
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-brand-green border-t border-brand-yellow/35 py-2 px-4 space-y-1 shadow-inner animate-fade-in">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`block w-full text-left px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider cursor-pointer ${
                currentPage === item.id
                  ? 'bg-brand-oxblood text-white'
                  : 'text-white hover:text-brand-yellow hover:bg-white/10'
              }`}
            >
              {item.label}
            </button>
          ))}
          {toggleTheme && (
            <div className="pt-2 pb-1 border-t border-white/15">
              <button
                type="button"
                onClick={() => {
                  toggleTheme();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider bg-black/20 text-white hover:bg-black/30 transition cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  {theme === 'dark' ? (
                    <Sun className="w-4 h-4 text-brand-yellow" />
                  ) : (
                    <Moon className="w-4 h-4 text-brand-yellow" />
                  )}
                  <span>Theme: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-white/20 text-[10px] uppercase font-mono">
                  Switch to {theme === 'dark' ? 'Light' : 'Dark'}
                </span>
              </button>
            </div>
          )}
          {isAdminLoggedIn && (
            <button
              onClick={() => {
                onLogout();
                setIsMobileMenuOpen(false);
                setCurrentPage('home');
              }}
              className="block w-full text-left px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider text-red-200 hover:bg-white/10 cursor-pointer"
            >
              Logout Admin
            </button>
          )}
        </div>
      )}
    </header>
  );
}
