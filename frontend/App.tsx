import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { BetaDashboard } from './components/BetaDashboard';
import { Contacts } from './components/Contacts';
import { Campaigns } from './components/Campaigns';
import { Advisor } from './components/Advisor';
import { Tasks } from './components/Tasks';
import PredictiveAnalytics from './components/ai/PredictiveAnalytics';
import ContentIntelligence from './components/ai/ContentIntelligence';
import IntelligentAutomation from './components/ai/IntelligentAutomation';
import NaturalLanguageQuery from './components/ai/NaturalLanguageQuery';
import CompetitiveIntelligence from './components/ai/CompetitiveIntelligence';
import ClientIntelligence from './components/ai/ClientIntelligence';
import SmartDocumentProcessing from './components/ai/SmartDocumentProcessing';
import ConversationalReporting from './components/ai/ConversationalReporting';
import AITrainingCenter from './components/ai/AITrainingCenter';
import MultiAgentSystem from './components/ai/MultiAgentSystem';
import EchoIntelligenceHub from './components/ai/EchoIntelligenceHub';
import { ArrowLeft } from 'lucide-react';
import { Promotions } from './components/Promotions';
import { Automation } from './components/Automation';
import { Calendar } from './components/Calendar';
import { Assets } from './components/Assets';
import { Settings } from './components/Settings';
import { Projects } from './components/Projects';
import { Events } from './components/Events';
import { Social } from './components/Social';
import { Forms } from './components/Forms';
import { Deals } from './components/Deals';
import { Infographics } from './components/Infographics';
import Files from './components/Files';
import { DepartmentHub } from './components/DepartmentHub';
import LegacyMigration from './components/LegacyMigration';
import { AppView, CountryCode, Theme, User } from './types';
import { COUNTRIES, retrieveDashboardData, subscribeToStateChanges, initializeDatabase, getCurrentUser } from './services/data';
import { Login } from './components/Login';
import { SignUp } from './components/SignUp';
import { ActivationPage } from './components/ActivationPage';
import { WelcomeModal } from './components/WelcomeModal';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { FeatureFlagProvider, useFeatureFlags } from './context/FeatureFlagContext';

// Theme Definitions for Dynamic Style Injection
const THEMES: Record<Theme, { primary: string; hover: string; light: string; soft: string }> = {
  indigo: { primary: '#4f46e5', hover: '#4338ca', light: '#e0e7ff', soft: '#eef2ff' },
  rose: { primary: '#e11d48', hover: '#be123c', light: '#ffe4e6', soft: '#fff1f2' },
  emerald: { primary: '#059669', hover: '#047857', light: '#d1fae5', soft: '#ecfdf5' },
  amber: { primary: '#d97706', hover: '#b45309', light: '#fef3c7', soft: '#fffbeb' },
  violet: { primary: '#7c3aed', hover: '#6d28d9', light: '#ede9fe', soft: '#f5f3ff' },
  sky: { primary: '#0284c7', hover: '#0369a1', light: '#e0f2fe', soft: '#f0f9ff' },
  slate: { primary: '#475569', hover: '#334155', light: '#f1f5f9', soft: '#f8fafc' },
};

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  public state: { hasError: boolean; error: Error | null };

  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-red-50 text-red-900 h-screen flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <pre className="bg-white p-4 rounded border border-red-200 text-sm overflow-auto max-w-2xl">
            {this.state.error?.toString()}
          </pre>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const [currentView, setCurrentView] = useState<AppView>(() => {
    const hash = window.location.hash.slice(1);
    const view = hash.split('/')[0] as AppView;
    if (view && view.length > 0) return view;
    return (localStorage.getItem('activeView') as AppView) || 'dashboard';
  });

  useEffect(() => {
    localStorage.setItem('activeView', currentView);
    // Only update hash if the top-level view has changed, preserving sub-routes
    const currentHashView = window.location.hash.slice(1).split('/')[0];
    if (currentHashView !== currentView) {
      window.location.hash = currentView;
    }
  }, [currentView]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      const view = hash.split('/')[0] as AppView;
      if (view && view !== currentView) {
        setCurrentView(view);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentView]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>('Global');
  const [currentTheme, setCurrentTheme] = useState<Theme>('indigo');
  const [countries, setCountries] = useState(COUNTRIES);

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activationToken, setActivationToken] = useState<string | null>(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between Login and Sign Up

  // Real-time badge count
  const [taskCount, setTaskCount] = useState(0);

  useEffect(() => {
    initializeDatabase();

    // Check for activation token
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      setActivationToken(token);
    }

    // Check for persisted auth
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);
      setIsAuthenticated(true);

      // Set default country based on user role/assignments
      if (user.role !== 'Super Admin' && user.assignedCountries && user.assignedCountries.length > 0) {
        setSelectedCountry(user.assignedCountries[0] as CountryCode);
      }
    }
  }, []);

  // Update country when user changes (e.g. after fresh login)
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role !== 'Super Admin' && currentUser.assignedCountries && currentUser.assignedCountries.length > 0) {
        // Only override if currently selected is Global or not in assigned list
        if (selectedCountry === 'Global' || !currentUser.assignedCountries.includes(selectedCountry)) {
          setSelectedCountry(currentUser.assignedCountries[0] as CountryCode);
        }
      }
    }
  }, [currentUser]);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setActivationToken(null);
    localStorage.setItem('currentUser', JSON.stringify(user));

    // Remove token from URL
    window.history.replaceState({}, document.title, window.location.pathname);

    if (!user.hasCompletedOnboarding) {
      setShowWelcomeModal(true);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
    setCurrentView('dashboard'); // Reset view
  };

  const startTour = () => {
    const driverObj = driver({
      showProgress: true,
      steps: [
        { element: 'header', popover: { title: 'Navigation', description: 'Access global search, notifications, and your profile here.' } },
        { element: 'aside nav', popover: { title: 'Sidebar', description: 'Navigate between different modules like Projects, Campaigns, and Settings.' } },
        { element: '.country-selector', popover: { title: 'Country Context', description: 'Switch between different country views to see localized data.' } },
        { element: 'main', popover: { title: 'Workspace', description: 'This is where your main work happens. Dashboards, tables, and forms appear here.' } },
      ]
    });
    driverObj.drive();
  };

  useEffect(() => {
    const updateCounts = () => {
      const data = retrieveDashboardData(selectedCountry);
      setTaskCount(data.tasks.filter(t => !t.completed).length);
      setCurrentTheme(data.theme);
      if (data.countries) setCountries(data.countries);

      // Enforce country access
      const user = getCurrentUser();
      if (user && user.role !== 'Super Admin') {
        if (!user.assignedCountries.includes(selectedCountry) && selectedCountry !== 'Global') {
          // If current selection is invalid, switch to first assigned
          if (user.assignedCountries.length > 0) {
            setSelectedCountry(user.assignedCountries[0]);
          }
        }
      }
    };

    updateCounts();
    // Subscribe to DB changes (includes theme changes from Settings)
    return subscribeToStateChanges(updateCounts);
  }, [selectedCountry]);

  if (activationToken) {
    return <ActivationPage token={activationToken} onSuccess={handleLoginSuccess} />;
  }

  if (!isAuthenticated) {
    if (isSignUp) {
      return <SignUp onSuccess={handleLoginSuccess} onSwitchToLogin={() => setIsSignUp(false)} />;
    }
    return <Login onSuccess={handleLoginSuccess} onSwitchToSignUp={() => setIsSignUp(true)} />;
  }

  return (
    <FeatureFlagProvider>
      {/* Dynamic Style Injection for Theming */}
      <style>{`
        :root {
            --primary: ${THEMES[currentTheme].primary};
            --primary-hover: ${THEMES[currentTheme].hover};
            --primary-light: ${THEMES[currentTheme].light};
            --primary-soft: ${THEMES[currentTheme].soft};
        }
      `}</style>

      {showWelcomeModal && currentUser && (
        <WelcomeModal
          user={currentUser}
          onStartTour={startTour}
          onClose={() => setShowWelcomeModal(false)}
        />
      )}

      <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-slate-900/50 backdrop-blur-sm lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <Sidebar
          isOpen={isSidebarOpen}
          activeView={currentView}
          onViewChange={setCurrentView}
          onCloseSidebar={() => setIsSidebarOpen(false)}
          taskCount={taskCount}
          currentTheme={currentTheme}
          selectedCountry={selectedCountry}
        />

        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden bg-white/50">
          <Header
            currentUser={currentUser}
            selectedCountry={selectedCountry}
            countries={countries}
            onSidebarToggle={() => setIsSidebarOpen(true)}
            onCountryChange={setSelectedCountry}
            onLogout={handleLogout}
            onViewChange={setCurrentView}
          />

          {/* Main View Area */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth">
            <div className="mx-auto max-w-7xl h-full">
              {(currentView === 'advisor' || (currentView.startsWith('ai_') && currentView !== 'ai_hub')) && (
                <button
                  onClick={() => setCurrentView('ai_hub')}
                  className="mb-6 flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-all shadow-sm w-fit"
                >
                  <ArrowLeft size={16} />
                  Back to AI Intelligence Hub
                </button>
              )}
              {currentView === 'dashboard' && <Dashboard country={selectedCountry} />}
              {currentView === 'beta_dashboard' && <BetaDashboard country={selectedCountry} />}
              {currentView === 'projects' && <Projects country={selectedCountry} />}
              {currentView === 'contacts' && <Contacts country={selectedCountry} />}
              {currentView === 'campaigns' && <Campaigns country={selectedCountry} />}
              {currentView === 'events' && <Events country={selectedCountry} />}
              {currentView === 'promotions' && <Promotions country={selectedCountry} />}
              {currentView === 'tasks' && <Tasks country={selectedCountry} />}
              {currentView === 'advisor' && <Advisor />}
              {currentView === 'automation' && <Automation country={selectedCountry} />}
              {currentView === 'calendar' && <Calendar country={selectedCountry} />}
              {currentView === 'assets' && <Assets country={selectedCountry} />}
              {currentView === 'settings' && <Settings country={selectedCountry} currentUser={currentUser} />}
              {currentView === 'social' && <Social country={selectedCountry} />}
              {currentView === 'forms' && <Forms country={selectedCountry} />}
              {currentView === 'deals' && <Deals country={selectedCountry} />}
              {currentView === 'infographics' && <Infographics />}
              {currentView === 'files' && <Files />}
              {currentView === 'departments' && <DepartmentHub country={selectedCountry} />}
              {currentView === 'migration' && <LegacyMigration />}
              {currentView === 'ai_hub' && <EchoIntelligenceHub />}
              {currentView === 'ai_predictive' && <PredictiveAnalytics />}
              {currentView === 'ai_content' && <ContentIntelligence />}
              {currentView === 'ai_automation' && <IntelligentAutomation />}
              {currentView === 'ai_query' && <NaturalLanguageQuery />}
              {currentView === 'ai_competitive' && <CompetitiveIntelligence />}
              {currentView === 'ai_clients' && <ClientIntelligence />}
              {currentView === 'ai_documents' && <SmartDocumentProcessing />}
              {currentView === 'ai_reporting' && <ConversationalReporting />}
              {currentView === 'ai_training' && <AITrainingCenter />}
              {currentView === 'ai_agents' && <MultiAgentSystem />}
            </div>
          </main>
        </div>
      </div>
    </FeatureFlagProvider>
  );
}

export default function AppWrapper() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
