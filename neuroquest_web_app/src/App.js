import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import "./tailwind-glass.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import FloatingOrb from "./components/FloatingOrb";
import LottieAnim from "./components/LottieAnim";
import LoaderAnim from "./assets/lottie/loader.json";

// Lazy-load major pages for route split.
const Login = lazy(() => import("./pages/Login"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const QuestLog = lazy(() => import("./pages/QuestLog"));
const BossBattle = lazy(() => import("./pages/BossBattle"));
const FocusEngine = lazy(() => import("./pages/FocusEngine"));
const Inventory = lazy(() => import("./pages/Inventory"));
const CalendarSync = lazy(() => import("./pages/CalendarSync"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center bg-kaviaDark text-kaviaAccent">
        <LottieAnim anim={LoaderAnim} height={72} />
        <div className="mt-4 neon-glow">Loading user...</div>
      </div>
    );
  }
  return user ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  // Overlay orb for RPG immersion.
  return (
    <div className="min-h-screen bg-rpg-gradient text-white relative pt-16 pb-8 font-sans">
      <Navbar />
      <FloatingOrb />
      <div className="container mx-auto px-4 pt-6 pb-12">
        <Suspense fallback={
          <div className="flex flex-col items-center pt-28 min-h-[50vh]">
            <LottieAnim anim={LoaderAnim} height={96} />
            <div className="mt-2 text-lg neon-glow">Loading...</div>
          </div>
        }>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/onboarding" element={
              <ProtectedRoute><Onboarding /></ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />
            <Route path="/quest-log" element={
              <ProtectedRoute><QuestLog /></ProtectedRoute>
            } />
            <Route path="/boss" element={
              <ProtectedRoute><BossBattle /></ProtectedRoute>
            } />
            <Route path="/focus" element={
              <ProtectedRoute><FocusEngine /></ProtectedRoute>
            } />
            <Route path="/inventory" element={
              <ProtectedRoute><Inventory /></ProtectedRoute>
            } />
            <Route path="/calendar-sync" element={
              <ProtectedRoute><CalendarSync /></ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute><Settings /></ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
