import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Flame, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { InstagramIcon, FacebookIcon, YoutubeIcon } from './SocialIcons';
import { getSettings } from '../services/api';

const Footer = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    getSettings()
      .then(setSettings)
      .catch((err) => console.log('Footer settings error:', err));
  }, []);

  const academyName = settings?.academy_name || 'Warrior Martial Arts Academy';
  const address = settings?.academy_address || '123 Warrior Way, Martial City, NY 10001, USA';
  const phone = settings?.contact_number || '+1 (123) 456-7890';
  const email = settings?.email || 'info@warriormartialarts.com';
  const hours = settings?.operating_hours || 'Mon - Fri: 6:00 AM - 9:00 PM | Sat: 8:00 AM - 2:00 PM | Sun: Closed';

  return (
    <footer style={{ backgroundColor: '#0A0C10', color: '#CBD5E1', borderTop: '1px solid #1E293B', paddingTop: '4.5rem' }}>
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2.5rem',
            paddingBottom: '3.5rem',
          }}
        >
          {/* Column 1: Brand & Mission */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  backgroundColor: '#DC2626',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                }}
              >
                <Flame size={22} fill="white" />
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: '#FFFFFF', letterSpacing: '0.05em' }}>
                  WARRIOR
                </div>
                <div style={{ fontSize: '0.65rem', color: '#DC2626', fontWeight: 800, letterSpacing: '0.2em' }}>
                  MARTIAL ARTS
                </div>
              </div>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#94A3B8', lineHeight: '1.7', marginBottom: '1.5rem' }}>
              {settings?.academy_description ||
                'We empower individuals through martial arts training that builds strength, confidence, and character. Preparing minds and bodies for life.'}
            </p>
            {/* Social Links */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <a
                href={settings?.facebook_url || '#'}
                target="_blank"
                rel="noreferrer"
                style={{
                  width: '38px',
                  height: '38px',
                  backgroundColor: '#1E293B',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#CBD5E1',
                }}
              >
                <FacebookIcon size={18} />
              </a>
              <a
                href={settings?.instagram_url || '#'}
                target="_blank"
                rel="noreferrer"
                style={{
                  width: '38px',
                  height: '38px',
                  backgroundColor: '#1E293B',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#CBD5E1',
                }}
              >
                <InstagramIcon size={18} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: '38px',
                  height: '38px',
                  backgroundColor: '#1E293B',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#CBD5E1',
                }}
              >
                <YoutubeIcon size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1.25rem', marginBottom: '1.25rem', letterSpacing: '0.05em' }}>
              QUICK LINKS
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { name: 'Home', path: '/' },
                { name: 'About Us & Head Coach', path: '/about' },
                { name: 'All Martial Arts Classes', path: '/courses' },
                { name: 'Class Timetable & Schedule', path: '/admission' },
                { name: 'Photo & Video Gallery', path: '/gallery' },
                { name: 'Contact & Location', path: '/contact' },
                { name: 'Dojo ERP & Member Portal', path: '/portal/login' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.9rem',
                      color: '#94A3B8',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#DC2626')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
                  >
                    <ChevronRight size={14} color="#DC2626" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Class Schedule / Dojo Hours */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1.25rem', marginBottom: '1.25rem', letterSpacing: '0.05em' }}>
              CLASS SCHEDULE
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1E293B', paddingBottom: '0.5rem' }}>
                <span style={{ color: '#94A3B8' }}>Monday – Friday</span>
                <span style={{ color: '#FFFFFF', fontWeight: 600 }}>6:00 AM – 9:00 PM</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1E293B', paddingBottom: '0.5rem' }}>
                <span style={{ color: '#94A3B8' }}>Saturday</span>
                <span style={{ color: '#FFFFFF', fontWeight: 600 }}>8:00 AM – 2:00 PM</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1E293B', paddingBottom: '0.5rem' }}>
                <span style={{ color: '#94A3B8' }}>Sunday</span>
                <span style={{ color: '#EF4444', fontWeight: 600 }}>Closed (Private Seminars)</span>
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <Link to="/admission" className="btn btn-outline btn-sm" style={{ width: '100%' }}>
                  VIEW FULL TIMETABLE
                </Link>
              </div>
            </div>
          </div>

          {/* Column 4: Contact Us */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1.25rem', marginBottom: '1.25rem', letterSpacing: '0.05em' }}>
              CONTACT US
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <MapPin size={18} color="#DC2626" style={{ flexShrink: 0, marginTop: '3px' }} />
                <span>{address}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Phone size={18} color="#DC2626" style={{ flexShrink: 0 }} />
                <a href={`tel:${phone}`} style={{ color: '#FFFFFF', fontWeight: 600 }}>
                  {phone}
                </a>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Mail size={18} color="#DC2626" style={{ flexShrink: 0 }} />
                <a href={`mailto:${email}`} style={{ color: '#CBD5E1' }}>
                  {email}
                </a>
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <a
                  href={`https://wa.me/${(settings?.whatsapp_number || '11234567890').replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%' }}
                >
                  WHATSAPP ENQUIRY
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-footer Copyright */}
        <div
          style={{
            borderTop: '1px solid #1E293B',
            padding: '1.75rem 0',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            fontSize: '0.825rem',
            color: '#64748B',
          }}
        >
          <div>
            © {new Date().getFullYear()} {academyName}. All Rights Reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/portal/login" style={{ color: '#94A3B8' }}>Staff & Member Login</Link>
            <a href="http://127.0.0.1:8000/admin/" target="_blank" rel="noreferrer" style={{ color: '#94A3B8' }}>
              Django Admin
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
