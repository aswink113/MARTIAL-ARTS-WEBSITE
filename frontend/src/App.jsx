import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

// Pages
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Admission from './pages/Admission';
import Contact from './pages/Contact';
import PortalLogin from './pages/PortalLogin';
import ERPDashboard from './pages/ERPDashboard';
import NotFound from './pages/NotFound';

// Helper component to scroll to top on page navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Main layout that hides public Navbar, Footer, and Floating widgets on Login and Portal routes
const AppLayout = () => {
  const location = useLocation();
  const isPortalOrLogin = 
    location.pathname.startsWith('/portal') || 
    location.pathname === '/login' || 
    location.pathname === '/';

  return (
    <div className="app-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Show public website header only on public marketing pages */}
      {!isPortalOrLogin && <Navbar />}

      <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          {/* Root and /portal/login show the dedicated animated glass login */}
          <Route path="/" element={<PortalLogin />} />
          <Route path="/portal/login" element={<PortalLogin />} />
          <Route path="/login" element={<PortalLogin />} />

          {/* Full-Stack Professional Enterprise ERP Dashboard */}
          <Route path="/portal" element={<ERPDashboard />} />

          {/* Website Pages */}
          <Route path="/home" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:slug" element={<CourseDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/admission" element={<Admission />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!isPortalOrLogin && <Footer />}
      {!isPortalOrLogin && <WhatsAppButton />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <AppLayout />
      </Router>
    </AuthProvider>
  );
}

export default App;
