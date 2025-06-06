import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LoginForm } from './components/Auth/LoginForm';
import { Dashboard } from './components/Dashboard/Dashboard';

function AppRoutes() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={user ? <Navigate to="/\" replace /> : <LoginForm />} 
      />
      <Route 
        path="/" 
        element={user ? <Dashboard /> : <Navigate to="/login\" replace />} 
      />
      <Route 
        path="*" 
        element={<Navigate to="/\" replace />} 
      />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router basename="/ips">
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;