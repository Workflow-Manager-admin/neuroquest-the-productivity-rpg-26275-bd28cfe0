import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';

// Global Theme and Audio customization providers
import { ThemeProvider } from "./theme/ThemeProvider";
import { AudioProvider } from "./components/AudioPlayer";

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
          <React.Suspense fallback={<div className="text-accent p-8 text-center neon-accent">Loading...</div>}>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/questlog" element={<QuestLog />} />
                <Route path="/bossbattle" element={<BossBattle />} />
                <Route path="/focus" element={<Focus />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/calendarsync" element={<CalendarSync />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
              <Route path="/login" element={<Login />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </React.Suspense>
        </Router>
      </AudioProvider>
    </ThemeProvider>
  );
}

export default App;
