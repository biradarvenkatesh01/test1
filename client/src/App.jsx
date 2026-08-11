import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Generate from './pages/Generate';
import MyCards from './pages/MyCards';
import { LoadingState } from './components/StatusIndicators';
import './App.css';

/**
 * Route protection wrapper.
 * Redirects unauthenticated users to the Home page where they can sign in.
 */
function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <div className="app-loader-container">
        <LoadingState message="Checking authentication..." />
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        {/* Navigation Bar */}
        <Navbar />

        {/* Main Content Area */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            
            <Route 
              path="/generate" 
              element={
                <ProtectedRoute>
                  <Generate />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/my-cards" 
              element={
                <ProtectedRoute>
                  <MyCards />
                </ProtectedRoute>
              } 
            />
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Decorative Divider */}
        <div className="ticks"></div>

        {/* Global Footer */}
        <footer className="global-footer">
          <p>© {new Date().getFullYear()} FlashAI. </p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
