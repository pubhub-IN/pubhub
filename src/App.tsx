import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './lib/auth';
import { type User } from './lib/supabase';
import Hero from './components/Hero';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-green-500 rounded-xl mb-4 animate-pulse"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Hero />} />
        <Route 
          path="/onboarding" 
          element={
            user ? <Onboarding user={user} onComplete={setUser} /> : <Navigate to="/" />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            user ? <Dashboard user={user} /> : <Navigate to="/" />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;