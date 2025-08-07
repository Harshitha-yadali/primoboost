import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, Menu, X, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onMobileMenuToggle?: () => void;
  showMobileMenu?: boolean;
  onShowProfile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onMobileMenuToggle,
  showMobileMenu,
  onShowProfile
}) => {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsLoggingOut(true);
    try {
      await logout();
      setShowUserMenu(false);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getUserDisplayName = () => {
    if (!user) return '';
    return user.name.split(' ')[0]; // First name only
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    const names = user.name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Only show loading spinner for initial load, not for every auth operation
  const showLoadingSpinner = isLoading && !isAuthenticated && !user;

  return (
    <>
      <header className="bg-dark-200/95 backdrop-blur-sm shadow-sm border-b border-dark-400 sticky top-0 z-40">
        <div className="container-responsive">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl overflow-hidden shadow-lg">
                <img
                  src="https://res.cloudinary.com/dlkovvlud/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1751536902/a-modern-logo-design-featuring-primoboos_XhhkS8E_Q5iOwxbAXB4CqQ_HnpCsJn4S1yrhb826jmMDw_nmycqj.jpg"
                  alt="PrimoBoost AI Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden xs:block">
                <h1 className="text-lg sm:text-xl font-bold text-gradient-neon">PrimoBoost AI</h1>
              </div>
              <div className="xs:hidden">
                <h1 className="text-base font-bold text-gradient-neon">PrimoBoost AI</h1>
              </div>
            </div>

            {/* Desktop Auth Only */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated && user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-3 bg-dark-300 hover:bg-dark-400 rounded-xl px-4 py-2.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-neon-400 border border-dark-500 shadow-sm min-h-touch"
                  >
                    <div className="bg-gradient-to-br from-neon-400 to-electric-400 w-9 h-9 rounded-full flex items-center justify-center text-dark-100 font-semibold text-sm shadow-md">
                      {getUserInitials()}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-dark-900">
                        {getGreeting()}, {getUserDisplayName()}!
                      </p>
                      <p className="text-xs text-dark-600 truncate max-w-[150px]">
                        {user.email}
                      </p>
                    </div>
                  </button>

                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-dark-200 rounded-2xl shadow-xl border border-dark-400 py-2 z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-dark-400 bg-gradient-to-r from-neon-400/10 to-electric-400/10">
                        <div className="flex items-center space-x-3">
                          <div className="bg-gradient-to-br from-neon-400 to-electric-400 w-10 h-10 rounded-full flex items-center justify-center text-dark-100 font-semibold shadow-md">
                            {getUserInitials()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-dark-900 truncate">{user.name}</p>
                            <p className="text-xs text-dark-600 truncate">{user.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Wrap these buttons in a Fragment */}
                      <>
                        {/* Profile Settings Option */}
                        <button
                          onClick={() => {
                            if (onShowProfile) {
                              onShowProfile();
                            }
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-3 text-sm text-dark-700 hover:bg-dark-300 hover:text-neon-400 transition-colors flex items-center space-x-3 min-h-touch"
                        >
                          <User className="w-4 h-4" />
                          <span>Profile Settings</span>
                        </button>
                      </> {/* End Fragment */}

                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-dark-300 transition-colors flex items-center space-x-3 disabled:opacity-50 min-h-touch"
                      >
                        {isLoggingOut ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <LogOut className="w-4 h-4" />
                        )}
                        <span>{isLoggingOut ? 'Signing Out...' : 'Sign Out'}</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => {}} // Will be handled by parent component
                  disabled={showLoadingSpinner}
                  className={`btn-primary px-6 py-2.5 rounded-xl flex items-center space-x-2 glow-neon active:scale-[0.98] ${
                    showLoadingSpinner ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {showLoadingSpinner ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                  <span>{showLoadingSpinner ? 'Loading...' : 'Sign In'}</span>
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={onMobileMenuToggle}
                className="min-w-touch min-h-touch p-2 text-dark-600 hover:text-neon-400 hover:bg-dark-300 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-neon-400"
              >
                {showMobileMenu ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
