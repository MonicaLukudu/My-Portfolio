import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, LogOut, ExternalLink } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const isManagementSide = pathname.startsWith('/dashboard') || pathname.startsWith('/settings');

  const visitorLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  const managementLinks = [
    { name: 'Dashboard', path: '/dashboard' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-panel shadow-xs border-b border-neutral-100/50 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        
        {/* Brand/Logo */}
        <Link to="/" className="flex items-center gap-2">
          <motion.span 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-display text-xl font-bold tracking-tight text-neutral-800"
          >
            Monica David Lukudu
          </motion.span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-8">
          {isManagementSide ? (
            // Management Side Links
            <div className="flex items-center gap-6">
              {managementLinks.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`relative py-1 font-sans text-sm font-medium transition-colors ${
                      isActive ? 'text-primary-500' : 'text-neutral-500 hover:text-neutral-800'
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <motion.div
                        layoutId="active-nav-line"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
              
              {/* Public Site Link from Admin */}
              <Link
                to="/"
                className="flex items-center gap-1 font-sans text-sm font-medium text-neutral-500 hover:text-neutral-800 transition-colors"
              >
                <span>View Public Site</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          ) : (
            // Visitor Side Links
            <div className="flex items-center gap-6">
              {visitorLinks.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`relative py-1 font-sans text-sm font-medium transition-colors ${
                      isActive ? 'text-primary-500' : 'text-neutral-500 hover:text-neutral-800'
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <motion.div
                        layoutId="active-nav-line"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </nav>

        {/* Right Section: Profile Icon / Actions */}
        <div className="flex items-center gap-4">
          {isManagementSide ? (
            <>
              {/* Profile/Settings Icon (Strictly Management Side) */}
              <button
                onClick={() => navigate('/settings')}
                className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all ${
                  pathname === '/settings' 
                    ? 'border-primary-500 bg-primary-50 text-primary-500' 
                    : 'border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
                title="Settings"
              >
                <User className="h-5 w-5" />
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all"
                title="Logout Admin"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : null}
        </div>

      </div>
    </header>
  );
};
