import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import CitizenDashboard from './components/CitizenDashboard';
import AdminDashboard from './components/AdminDashboard';
import ReportIssue from './components/ReportIssue';
import IssueDetail from './components/IssueDetail';
import CurrentIssues from './components/CurrentIssues';
import JuryPresentation from './components/JuryPresentation';
import PerformanceMetrics from './components/PerformanceMetrics';
import TechnicalDemo from './components/TechnicalDemo';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import './App.css';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/citizen" element={<CitizenDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/report" element={<ReportIssue />} />
          <Route path="/issue/:id" element={<IssueDetail />} />
          <Route path="/issues" element={<CurrentIssues />} />
          <Route path="/presentation" element={<JuryPresentation />} />
              <Route path="/performance" element={<PerformanceMetrics />} />
              <Route path="/technical" element={<TechnicalDemo />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;