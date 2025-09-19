import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import AuthProvider from './auth/AuthProvider';
import { AppProvider } from './store/AppContext';
import ProtectedRoute from './auth/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ProjectBoard from './pages/ProjectBoard';
import Loading from './components/Loading';
import './App.css';

function AppContent() {
  const { isLoading, isAuthenticated } = useAuth0();

  if (isLoading) {
    return <Loading message="Loading application..." />;
  }

  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            ) : (
              <LoginPage />
            )
          }
        />
        <Route
          path="/project/:projectId"
          element={
            <ProtectedRoute>
              <ProjectBoard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <AppContent />
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
