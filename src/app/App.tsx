import { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { DatabaseSetup } from './components/DatabaseSetup';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Tutorials } from './components/Tutorials';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Ratings } from './components/Ratings';
import { SearchResults } from './components/SearchResults';
import { CustomerTracker } from './components/CustomerTracker';
import { EditProfile } from './components/EditProfile';
import { ServiceProviders } from './components/ServiceProviders';
import { ServiceProviderProfile } from './components/ServiceProviderProfile';
import { ProviderDashboardUpdated } from './components/ProviderDashboardUpdated';
import { MessagingSystem } from './components/MessagingSystem';
import { WorkerApplication } from './components/WorkerApplication';
import { BookingFormLocked } from './components/BookingFormLocked';
import { TrackMyService } from './components/TrackMyService';
import { mockProviders } from './data/mockProviders';
import { getServiceProviders } from './services/database';
import { ServiceProvider } from './types/serviceProvider';
import { Toaster } from 'sonner';

function AppContent() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showDatabaseSetup, setShowDatabaseSetup] = useState(false);
  const [databaseChecked, setDatabaseChecked] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'ratings' | 'search' | 'my-ticket' | 'profile' | 'providers' | 'provider-profile' | 'provider-dashboard' | 'messages' | 'worker-application' | 'booking' | 'track-service'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  const [allProviders, setAllProviders] = useState<ServiceProvider[]>([]);
  const [providersLoading, setProvidersLoading] = useState(false);
  const [activeWorkerId, setActiveWorkerId] = useState<string | null>(null);

  // Check if database setup screen has been dismissed
  useEffect(() => {
    const setupDismissed = localStorage.getItem('database_setup_dismissed');
    if (!setupDismissed) {
      setShowDatabaseSetup(true);
    } else {
      setDatabaseChecked(true);
    }
  }, []);

  // Fetch all providers (database + mock) when needed
  useEffect(() => {
    async function loadAllProviders() {
      if (currentView === 'providers' || currentView === 'provider-profile' || currentView === 'booking') {
        setProvidersLoading(true);
        try {
          const dbProviders = await getServiceProviders({ status: 'approved' });
          // Combine database providers with mock providers
          const combined = dbProviders && dbProviders.length > 0
            ? [...dbProviders, ...mockProviders.filter(p => p.status === 'approved')]
            : mockProviders.filter(p => p.status === 'approved');
          setAllProviders(combined);
        } catch (error) {
          console.error('Error loading providers:', error);
          // Fallback to mock providers on error
          setAllProviders(mockProviders.filter(p => p.status === 'approved'));
        } finally {
          setProvidersLoading(false);
        }
      }
    }
    loadAllProviders();
  }, [currentView]);

  const handleSwitchToRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  const handleDatabaseSetupComplete = () => {
    localStorage.setItem('database_setup_dismissed', 'true');
    setShowDatabaseSetup(false);
    setDatabaseChecked(true);
  };

  // Show database setup screen first
  if (showDatabaseSetup) {
    return <DatabaseSetup onComplete={handleDatabaseSetupComplete} />;
  }

  // Wait for database check before showing app
  if (!databaseChecked) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header
        onLoginClick={() => setShowLogin(true)}
        onRegisterClick={() => setShowRegister(true)}
        currentView={currentView}
        onViewChange={(view) => setCurrentView(view as any)}
        onSearch={(query) => setSearchQuery(query)}
      />
      
      <main>
        {currentView === 'home' && (
          <>
            <Hero />
            <Services onBookService={() => setCurrentView('providers')} />
            <Tutorials />
            <About />
            <Contact onBookingComplete={() => setCurrentView('track-service')} />
          </>
        )}

        {currentView === 'booking' && selectedProviderId && allProviders.find(p => p.id === selectedProviderId) && (
          <BookingFormLocked
            provider={allProviders.find(p => p.id === selectedProviderId)!}
            onBookingComplete={() => setCurrentView('my-ticket')}
            onCancel={() => setCurrentView('provider-profile')}
          />
        )}

        {currentView === 'booking' && selectedProviderId && !allProviders.find(p => p.id === selectedProviderId) && !providersLoading && (
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">Worker not available</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">This worker's profile could not be loaded. They may have been removed or their account may be inactive.</p>
              <button
                onClick={() => setCurrentView('providers')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Back to Providers
              </button>
            </div>
          </div>
        )}

        {currentView === 'booking' && !selectedProviderId && (
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">Please select a provider first</p>
              <button
                onClick={() => setCurrentView('providers')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Browse Service Providers
              </button>
            </div>
          </div>
        )}

        {currentView === 'ratings' && <Ratings />}

        {currentView === 'search' && <SearchResults searchQuery={searchQuery} />}

        {currentView === 'my-ticket' && <CustomerTracker onNavigateToMessages={() => {
          setActiveWorkerId(null);
          setCurrentView('messages');
        }} />}

        {currentView === 'track-service' && <TrackMyService onMessage={(workerId) => {
          setActiveWorkerId(workerId);
          setCurrentView('messages');
        }} />}

        {currentView === 'profile' && <EditProfile />}

        {currentView === 'providers' && (
          <ServiceProviders
            onSelectProvider={(providerId) => {
              setSelectedProviderId(providerId);
              setCurrentView('provider-profile');
            }}
            onMessage={() => {
              setActiveWorkerId(null);
              setCurrentView('messages');
            }}
          />
        )}

        {currentView === 'provider-profile' && selectedProviderId && allProviders.find(p => p.id === selectedProviderId) && (
          <ServiceProviderProfile
            provider={allProviders.find(p => p.id === selectedProviderId)!}
            onBook={() => {
              setSelectedProviderId(selectedProviderId);
              setCurrentView('booking');
            }}
            onMessage={() => {
              setActiveWorkerId(null);
              setCurrentView('messages');
            }}
          />
        )}

        {currentView === 'provider-profile' && selectedProviderId && !allProviders.find(p => p.id === selectedProviderId) && !providersLoading && (
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">Provider not found or unavailable</p>
              <button
                onClick={() => setCurrentView('providers')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Back to Providers
              </button>
            </div>
          </div>
        )}

        {currentView === 'provider-dashboard' && (
          <ProviderDashboardUpdated
            onNavigateToMessages={() => setCurrentView('messages')}
          />
        )}

        {currentView === 'messages' && <MessagingSystem initialChatId={activeWorkerId || undefined} />}

        {currentView === 'worker-application' && <WorkerApplication />}
      </main>
      
      <Toaster position="top-right" richColors />
      
      <Footer onViewChange={(view) => setCurrentView(view as any)} />

      {showLogin && (
        <Login 
          onClose={() => setShowLogin(false)}
          onSwitchToRegister={handleSwitchToRegister}
        />
      )}

      {showRegister && (
        <Register 
          onClose={() => setShowRegister(false)}
          onSwitchToLogin={handleSwitchToLogin}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ErrorBoundary>
          <AppContent />
        </ErrorBoundary>
      </AuthProvider>
    </ThemeProvider>
  );
}