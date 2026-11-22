import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Shield, 
  Menu, 
  X, 
  Phone, 
  User, 
  LogOut, 
  LayoutDashboard,
  Flame,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getSettings } from '../services/api';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    getSettings()
      .then(setSettings)
      .catch((err) => console.log('Settings loading fallback:', err));

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'ABOUT', path: '/about' },
    { name: 'CLASSES', path: '/courses' },
    { name: 'SCHEDULE', path: '/admission' },
    { name: 'GALLERY', path: '/gallery' },
    { name: 'CONTACT', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: '#0F1117',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: scrolled ? '0 4px 20px rgba(0, 0, 0, 0.4)' : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '78px' }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              backgroundColor: '#DC2626',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 0 15px rgba(220, 38, 38, 0.6)',
            }}
          >
            <Flame size={24} fill="white" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', color: '#FFFFFF', letterSpacing: '0.05em', lineHeight: '1.1' }}>
              WARRIOR
            </div>
            <div style={{ fontSize: '0.65rem', color: '#DC2626', fontWeight: 800, letterSpacing: '0.25em', textTransform: 'uppercase' }}>
              MARTIAL ARTS
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '2rem' }} className="desktop-nav">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              style={{
                fontSize: '0.875rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: isActive(link.path) ? '#DC2626' : '#E2E8F0',
                position: 'relative',
                padding: '0.25rem 0',
              }}
            >
              {link.name}
              {isActive(link.path) && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: '-4px',
                    left: 0,
                    width: '100%',
                    height: '2px',
                    backgroundColor: '#DC2626',
                  }}
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Action Buttons & Portal / ERP Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link
                to="/portal"
                className="btn btn-sm"
                style={{
                  backgroundColor: '#1E293B',
                  color: '#FFFFFF',
                  border: '1px solid #334155',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <LayoutDashboard size={16} color="#DC2626" />
                <span>ERP ({user?.role?.toUpperCase() || 'PORTAL'})</span>
              </Link>
              <button
                onClick={logout}
                title="Log Out"
                style={{
                  color: '#94A3B8',
                  padding: '0.4rem',
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '4px',
                }}
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link
              to="/portal/login"
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#94A3B8',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.4rem 0.75rem',
                border: '1px solid #334155',
                borderRadius: '4px',
              }}
            >
              <User size={15} />
              <span>LOGIN</span>
            </Link>
          )}

          <Link
            to="/admission"
            className="btn btn-primary"
            style={{
              padding: '0.6rem 1.4rem',
              fontSize: '0.85rem',
              display: 'inline-flex',
            }}
          >
            FREE TRIAL CLASS
          </Link>

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-toggle"
            style={{
              display: 'none',
              color: '#FFFFFF',
              padding: '0.5rem',
            }}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#14161F',
            borderTop: '1px solid #2D3748',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: isActive(link.path) ? '#DC2626' : '#FFFFFF',
                padding: '0.5rem 0',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              {link.name}
            </Link>
          ))}
          <div style={{ paddingTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link
              to="/admission"
              onClick={() => setMobileMenuOpen(false)}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              BOOK FREE TRIAL
            </Link>
            {!isAuthenticated ? (
              <Link
                to="/portal/login"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-outline"
                style={{ width: '100%' }}
              >
                STUDENT & STAFF LOGIN
              </Link>
            ) : (
              <Link
                to="/portal"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-secondary"
                style={{ width: '100%' }}
              >
                GO TO ERP DASHBOARD
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Responsive Inline CSS for media queries */}
      <style>{`
        @media (min-width: 992px) {
          .desktop-nav { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
        @media (max-width: 991px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
