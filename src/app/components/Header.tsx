import { useState } from 'react';
import { Phone, User, LogOut, Search, X, Moon, Sun } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
  currentView: string;
  onViewChange: (view: string) => void;
  onSearch: (query: string) => void;
}

export function Header({ onLoginClick, onRegisterClick, currentView, onViewChange, onSearch }: HeaderProps) {
  const { user, logout, isAuthenticated } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      onViewChange('search');
      setShowSearchBar(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setShowSearchBar(false);
  };

  const NavItem = ({ view, label }: { view: string; label: string }) => {
    const isActive = currentView === view;
    return (
      <button
        onClick={() => {
          onViewChange(view);
          handleClearSearch();
        }}
        className={`relative px-4 py-2 font-medium transition-colors ${
          isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
        }`}
      >
        {label}
        {isActive && (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
        )}
      </button>
    );
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className={`flex items-center h-16 ${isAuthenticated ? 'justify-between' : 'justify-center'}`}>
          {/* Guest View: Logo on Left */}
          {!isAuthenticated ? (
            <>
              {/* Left: Logo */}
              <button
                onClick={() => {
                  onViewChange('home');
                  handleClearSearch();
                }}
                className="flex items-center gap-2 flex-shrink-0"
              >
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">FIX&BIN</span>
              </button>

              {/* Right: Dark Mode Toggle + Auth Buttons */}
              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={toggleDarkMode}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title={isDarkMode ? 'Light mode' : 'Dark mode'}
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                <button
                  onClick={onLoginClick}
                  className="hidden sm:block px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium text-sm"
                >
                  Login
                </button>
                <button
                  onClick={onRegisterClick}
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium text-sm"
                >
                  Sign Up
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Logged-in View: Full Navbar */}
              {/* Left: Logo */}
              <button
                onClick={() => {
                  onViewChange('home');
                  handleClearSearch();
                }}
                className="flex items-center gap-2 flex-shrink-0"
              >
                <span className="text-xl font-bold text-gray-900 dark:text-white">FIX&BIN</span>
              </button>

              {/* Center: Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                {/* Only show Service Providers for customers */}
                {user?.role === 'customer' && (
                  <NavItem view="providers" label="Service Providers" />
                )}

                {isAuthenticated && (
                  <NavItem view="messages" label="Messages" />
                )}

                {isAuthenticated && user?.role === 'customer' && (
                  <NavItem view="track-service" label="Track My Service" />
                )}

                {isAuthenticated && user?.role === 'worker' && (
                  <NavItem view="provider-dashboard" label="Dashboard" />
                )}
              </nav>

              {/* Right: Actions */}
              <div className="flex items-center gap-3">
                {/* Dark Mode Toggle */}
                <button
                  onClick={toggleDarkMode}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title={isDarkMode ? 'Light mode' : 'Dark mode'}
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                {/* Search */}
                <button
                  onClick={() => setShowSearchBar(!showSearchBar)}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Search"
                >
                  <Search className="w-5 h-5" />
                </button>

                {/* Phone */}
                <a
                  href="tel:09615097697"
                  className="hidden lg:flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span className="text-sm font-medium">09615097697</span>
                </a>

                {/* User Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onViewChange('profile')}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="hidden lg:block text-sm font-medium text-gray-900 dark:text-white max-w-[120px] truncate">
                      {user?.name}
                    </span>
                  </button>
                  <button
                    onClick={logout}
                    className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Search Bar - Only show when authenticated */}
        {isAuthenticated && showSearchBar && (
          <div className="pb-4 pt-2">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for services..."
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}