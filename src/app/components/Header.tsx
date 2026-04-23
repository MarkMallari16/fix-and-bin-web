import { useState } from 'react';
import { Phone, User, LogOut, Briefcase, Search, X, MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { SupabaseStatus } from './SupabaseStatus';

interface HeaderProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
  currentView: string;
  onViewChange: (view: string) => void;
  onSearch: (query: string) => void;
}

export function Header({ onLoginClick, onRegisterClick, currentView, onViewChange, onSearch }: HeaderProps) {
  const { user, logout, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      onViewChange('search');
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setShowSearchBar(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onViewChange('home');
                handleClearSearch();
                setTimeout(() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 100);
              }}
              className="group flex items-center gap-2 text-2xl font-bold text-blue-600 hover:text-blue-700 transition-all transform hover:scale-105 cursor-pointer"
              title="Go to Home"
            >
              <svg
                className="w-8 h-8 transition-transform group-hover:rotate-12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span className="relative">
                FIX&BIN
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
              </span>
            </button>

            {/* Supabase Status Indicator */}
            <SupabaseStatus />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8">
            <button
              onClick={() => {
                onViewChange('workers');
                handleClearSearch();
              }}
              className={`${currentView === 'workers' ? 'text-blue-600' : 'text-gray-700'} hover:text-blue-600 transition-colors`}
            >
              Workers
            </button>
            {isAuthenticated && (
              <button
                onClick={() => {
                  onViewChange('messages');
                  handleClearSearch();
                }}
                className={`flex items-center gap-1 ${currentView === 'messages' ? 'text-blue-600' : 'text-gray-700'} hover:text-blue-600 transition-colors`}
              >
                <MessageCircle className="w-4 h-4" />
                Messages
              </button>
            )}
            {isAuthenticated && user?.role === 'worker' && (
              <>
                <button
                  onClick={() => {
                    onViewChange('worker-dashboard');
                    handleClearSearch();
                  }}
                  className={`${currentView === 'worker-dashboard' ? 'text-blue-600' : 'text-gray-700'} hover:text-blue-600 transition-colors font-medium`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    onViewChange('tracker');
                    handleClearSearch();
                  }}
                  className={`${currentView === 'tracker' ? 'text-blue-600' : 'text-gray-700'} hover:text-blue-600 transition-colors`}
                >
                  Job Tracker
                </button>
              </>
            )}
            {isAuthenticated && user?.role === 'customer' && (
              <button
                onClick={() => {
                  onViewChange('my-ticket');
                  handleClearSearch();
                }}
                className={`${currentView === 'my-ticket' ? 'text-blue-600' : 'text-gray-700'} hover:text-blue-600 transition-colors`}
              >
                Track My Service
              </button>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <button
              onClick={() => setShowSearchBar(!showSearchBar)}
              className="p-2 text-gray-700 hover:text-blue-600 transition-colors"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <a href="tel:+1234567890" className="hidden sm:flex items-center text-blue-600 hover:text-blue-700">
              <Phone className="w-5 h-5 mr-2" />
              <span className="hidden md:inline">(123) 456-7890</span>
            </a>

            {isAuthenticated ? (
              <div className="flex items-center space-x-2 md:space-x-4">
                <button
                  onClick={() => {
                    onViewChange('profile');
                    handleClearSearch();
                  }}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  title="Edit Profile"
                >
                  {user?.role === 'worker' ? (
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  ) : (
                    <User className="w-5 h-5 text-blue-600" />
                  )}
                  <span className="text-sm font-medium text-gray-900 hidden md:inline">
                    {user?.name}
                  </span>
                </button>
                <button
                  onClick={logout}
                  className="flex items-center text-gray-700 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={onLoginClick}
                  className="px-3 md:px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors text-sm md:text-base"
                >
                  Login
                </button>
                <button
                  onClick={onRegisterClick}
                  className="px-3 md:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Search Bar */}
        {showSearchBar && (
          <div className="pb-4">
            <form onSubmit={handleSearch} className="relative flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for services or tutorials..."
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
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