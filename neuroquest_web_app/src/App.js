import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';

// Global Theme and Audio customization providers
import { ThemeProvider } from "./theme/ThemeProvider";
import { AudioProvider } from "./components/AudioPlayer";
import ErrorBoundary from "./components/ErrorBoundary";

// Pages (placeholders are lazy-loaded)
const Login = React.lazy(() => import('./pages/LoginPage'));
const Onboarding = React.lazy(() => import('./pages/Onboarding'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const QuestLog = React.lazy(() => import('./pages/QuestLog'));
const BossBattle = React.lazy(() => import('./pages/BossBattle'));
const Focus = React.lazy(() => import('./pages/Focus'));
const Inventory = React.lazy(() => import('./pages/Inventory'));
const CalendarSync = React.lazy(() => import('./pages/CalendarSync'));
const Settings = React.lazy(() => import('./pages/Settings'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

// PUBLIC_INTERFACE
function App() {
  /**
   * Main application with global providers for:
   * - ThemeProvider: RPG neon, accent, light/dark/auto mode
   * - AudioProvider: Looping background RPG music and stubs for FX
   */
  return (
    <ThemeProvider>
      <AudioProvider>
        <Router>
          <ErrorBoundary>
            <React.Suspense fallback={<div className="text-accent p-8 text-center neon-accent">Loading...</div>}>
              <Routes>
                <Route element={<MainLayout />}>
                  <Route path="/" element={<ErrorBoundary><Dashboard /></ErrorBoundary>} />
                  <Route path="/dashboard" element={<ErrorBoundary><Dashboard /></ErrorBoundary>} />
                  <Route path="/questlog" element={<ErrorBoundary><QuestLog /></ErrorBoundary>} />
                  <Route path="/bossbattle" element={<ErrorBoundary><BossBattle /></ErrorBoundary>} />
                  <Route path="/focus" element={<ErrorBoundary><Focus /></ErrorBoundary>} />
                  <Route path="/inventory" element={<ErrorBoundary><Inventory /></ErrorBoundary>} />
                  <Route path="/calendarsync" element={<ErrorBoundary><CalendarSync /></ErrorBoundary>} />
                  <Route path="/settings" element={<ErrorBoundary><Settings /></ErrorBoundary>} />
                </Route>
                <Route path="/login" element={<ErrorBoundary><Login /></ErrorBoundary>} />
                <Route path="/onboarding" element={<ErrorBoundary><Onboarding /></ErrorBoundary>} />
                <Route path="*" element={<ErrorBoundary><NotFound /></ErrorBoundary>} />
              </Routes>
            </React.Suspense>
          </ErrorBoundary>
        </Router>
      </AudioProvider>
    </ThemeProvider>
  );
}

export default App;
