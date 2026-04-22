import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Tutorials } from './components/Tutorials';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { WorkerTracker } from './components/WorkerTracker';
import { Ratings } from './components/Ratings';
import { SearchResults } from './components/SearchResults';
import { CustomerTracker } from './components/CustomerTracker';
import { EditProfile } from './components/EditProfile';
import { Workers } from './components/Workers';
import { MessagingSystem } from './components/MessagingSystem';
import { WorkerDashboard } from './components/WorkerDashboard';
import { WorkerApplication } from './components/WorkerApplication';
import { Toaster } from 'sonner';

function AppContent() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'tracker' | 'ratings' | 'search' | 'my-ticket' | 'profile' | 'workers' | 'messages' | 'worker-dashboard' | 'worker-application'>('home');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSwitchToRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  return (
    <div className="min-h-screen bg-white">
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
            <Services />
            <Tutorials />
            <About />
            <Contact />
          </>
        )}
        
        {currentView === 'tracker' && <WorkerTracker />}
        
        {currentView === 'ratings' && <Ratings />}
        
        {currentView === 'search' && <SearchResults searchQuery={searchQuery} />}
        
        {currentView === 'my-ticket' && <CustomerTracker />}
        
        {currentView === 'profile' && <EditProfile />}
        
        {currentView === 'workers' && <Workers onNavigateToMessages={() => setCurrentView('messages')} />}
        
        {currentView === 'messages' && <MessagingSystem />}

        {currentView === 'worker-dashboard' && <WorkerDashboard />}

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
    <AuthProvider>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </AuthProvider>
  );
}