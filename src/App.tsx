import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import CitizenDashboard from './components/CitizenDashboard';
import AdminDashboard from './components/AdminDashboard';
import ReportIssue from './components/ReportIssue';
import IssueDetail from './components/IssueDetail';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import './App.css';

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={!user ? <HomePage /> : <Navigate to={user.role === 'citizen' ? '/citizen' : '/admin'} />} />
      <Route path="/citizen" element={user?.role === 'citizen' ? <CitizenDashboard /> : <Navigate to="/" />} />
      <Route path="/admin" element={user?.role !== 'citizen' ? <AdminDashboard /> : <Navigate to="/" />} />
      <Route path="/report" element={user ? <ReportIssue /> : <Navigate to="/" />} />
      <Route path="/issue/:id" element={user ? <IssueDetail /> : <Navigate to="/" />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <AppRoutes />
          </div>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;