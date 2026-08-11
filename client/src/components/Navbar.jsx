import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth, UserButton, SignInButton, SignUpButton } from '@clerk/clerk-react';
import { Menu, X, BookOpen, Sparkles, FolderHeart } from 'lucide-react';

export default function Navbar() {
  const { isSignedIn } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>
          <div className="brand-logo-container">
            <BookOpen className="brand-icon" size={24} />
          </div>
          <span className="brand-text">FlashAI</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-links desktop-only">
          {isSignedIn ? (
            <>
              <Link 
                to="/generate" 
                className={`nav-link ${isActive('/generate') ? 'active' : ''}`}
              >
                <Sparkles size={16} />
                <span>Generate</span>
              </Link>
              <Link 
                to="/my-cards" 
                className={`nav-link ${isActive('/my-cards') ? 'active' : ''}`}
              >
                <FolderHeart size={16} />
                <span>My Saved Cards</span>
              </Link>
            </>
          ) : (
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              <span>Home</span>
            </Link>
          )}
        </div>

        {/* Desktop Auth Controls */}
        <div className="navbar-auth desktop-only">
          {isSignedIn ? (
            <div className="user-button-wrapper">
              <UserButton afterSignOutUrl="/" />
            </div>
          ) : (
            <div className="auth-buttons">
              <SignInButton mode="modal">
                <button className="btn btn-secondary btn-sm">Log In</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="btn btn-primary btn-sm">Sign Up</button>
              </SignUpButton>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-menu-toggle" 
          onClick={toggleMobileMenu}
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <div className="mobile-drawer-links">
            {isSignedIn ? (
              <>
                <Link 
                  to="/generate" 
                  className={`mobile-nav-link ${isActive('/generate') ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  <Sparkles size={18} />
                  <span>Generate Flashcards</span>
                </Link>
                <Link 
                  to="/my-cards" 
                  className={`mobile-nav-link ${isActive('/my-cards') ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  <FolderHeart size={18} />
                  <span>My Saved Cards</span>
                </Link>
              </>
            ) : (
              <Link 
                to="/" 
                className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <span>Home</span>
              </Link>
            )}

            <div className="mobile-drawer-divider"></div>

            <div className="mobile-drawer-auth">
              {isSignedIn ? (
                <div className="mobile-user-profile">
                  <span>Signed in as:</span>
                  <UserButton afterSignOutUrl="/" />
                </div>
              ) : (
                <div className="mobile-auth-buttons">
                  <SignInButton mode="modal" onClick={closeMobileMenu}>
                    <button className="btn btn-secondary w-full">Log In</button>
                  </SignInButton>
                  <SignUpButton mode="modal" onClick={closeMobileMenu}>
                    <button className="btn btn-primary w-full">Sign Up</button>
                  </SignUpButton>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
