/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Menu, X, GraduationCap, ShieldCheck, UserCheck, Flame } from 'lucide-react';

interface HeaderProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  isAdminLoggedIn: boolean;
  onLogout: () => void;
}

export default function Header({ currentPage, setCurrentPage, isAdminLoggedIn, onLogout }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'mission', label: 'Mission & Vision' },
    { id: 'subjects', label: 'Subjects Offered' },
    { id: 'projects', label: 'Ongoing Projects' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'results', label: 'Results Sheet' },
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
          <span>📞 +234 803 456 7890</span>
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
            <div className="relative flex items-center justify-center w-11 h-11 rounded-full bg-white text-brand-green font-bold border-2 border-brand-oxblood shrink-0">
              <GraduationCap className="w-6.5 h-6.5 text-brand-green" />
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
          </nav>

          {/* Mobile Menu Buttons */}
          <div className="flex items-center lg:hidden space-x-2">
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
