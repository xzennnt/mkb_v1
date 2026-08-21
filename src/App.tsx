/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Study from './pages/Study';
import Leaderboard from './pages/Leaderboard';
import Admin from './pages/Admin';
import SetupProfile from './pages/SetupProfile';

const PrivateRoute = ({ children }: { children: React.ReactElement }) => {
  const { currentUser, userData, loading } = useAuth();
  
  if (loading || (currentUser && !userData)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F1F5F9]">
        <div className="text-slate-500 font-bold tracking-widest uppercase animate-pulse">Memuat...</div>
      </div>
    );
  }
  
  if (!currentUser) return <Navigate to="/login" />;
  if (!userData?.isProfileComplete) return <Navigate to="/setup-profile" />;
  
  if (userData?.role === 'admin') return <Navigate to="/admin" />;
  
  return children;
};

const AdminRoute = ({ children }: { children: React.ReactElement }) => {
  const { currentUser, userData, loading } = useAuth();
  
  if (loading || (currentUser && !userData)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F1F5F9]">
        <div className="text-slate-500 font-bold tracking-widest uppercase animate-pulse">Memuat...</div>
      </div>
    );
  }
  
  if (!currentUser) return <Navigate to="/login" />;
  if (!userData?.isProfileComplete) return <Navigate to="/setup-profile" />;
  
  return currentUser && userData?.role === 'admin' ? children : <Navigate to="/" />;
};

const SetupRoute = ({ children }: { children: React.ReactElement }) => {
  const { currentUser, userData, loading } = useAuth();
  
  if (loading || (currentUser && !userData)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F1F5F9]">
        <div className="text-slate-500 font-bold tracking-widest uppercase animate-pulse">Memuat...</div>
      </div>
    );
  }
  
  if (!currentUser) return <Navigate to="/login" />;
  if (userData?.isProfileComplete) return <Navigate to="/" />;
  
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#F1F5F9] text-slate-800 font-sans flex flex-col">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/setup-profile" element={<SetupRoute><SetupProfile /></SetupRoute>} />
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/study" element={<PrivateRoute><Study /></PrivateRoute>} />
            <Route path="/leaderboard" element={<PrivateRoute><Leaderboard /></PrivateRoute>} />
            <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}
