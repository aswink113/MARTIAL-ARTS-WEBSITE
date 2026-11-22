import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle, 
  Clock, 
  Send, 
  CheckCircle, 
  ExternalLink 
} from 'lucide-react';
import { InstagramIcon, FacebookIcon } from '../components/SocialIcons';
import { getSettings, submitAdmissionEnquiry } from '../services/api';

const Contact = () => {
  const [settings, setSettings] = useState(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getSettings()
      .then(setSettings)
      .catch((err) => console.log('Contact settings error:', err));
  }, []);

  const address = settings?.academy_address || '123 Warrior Way, Martial City, NY 10001, USA';
  const phone = settings?.contact_number || '+1 (123) 456-7890';
  const email = settings?.email || 'info@warriormartialarts.com';
  const whatsapp = (settings?.whatsapp_number || '+11234567890').replace(/[^0-9]/g, '');
  const hours = settings?.operating_hours || 'Mon - Fri: 6:00 AM - 9:00 PM | Sat: 8:00 AM - 2:00 PM | Sun: Closed';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.phone || !contactForm.email) return;

    setLoading(true);
    try {
      // Connect to backend admission enquiry / contact endpoint
      await submitAdmissionEnquiry({
        student_name: contactForm.name,
        student_age: 25, // default general enquiry age
        phone: contactForm.phone,
        email: contactForm.email,
        message: contactForm.message || 'General contact enquiry from website',
        preferred_batch: 'General Query',
      });
      setSent(true);
      setContactForm({ name: '', phone: '', email: '', message: '' });
    } catch (err) {
      console.error('Contact form submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      {/* Header */}
      <div
        style={{
          backgroundColor: '#0F1117',
          color: '#FFFFFF',
          padding: '4.5rem 0 3.5rem',
          textAlign: 'center',
          borderBottom: '1px solid #1E293B',
        }}
      >
        <div className="container">
          <span className="section-subtitle">GET IN TOUCH</span>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#FFFFFF', marginBottom: '0.75rem' }}>
            VISIT OUR DOJO & CONTACT US
          </h1>
          <p style={{ color: '#94A3B8', maxWidth: '640px', margin: '0 auto', fontSize: '1.05rem' }}>
            Have questions about our belt curriculum, youth classes, or personal training? Reach out anytime!
          </p>
        </div>
      </div>

      <div className="section-padding" style={{ backgroundColor: 'var(--light-bg)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3.5rem',
              alignItems: 'flex-start',
            }}
          >
            {/* Left: Contact Info Cards */}
            <div>
              <h2 className="section-title" style={{ textAlign: 'left', fontSize: '2.4rem', marginBottom: '1.5rem' }}>
                DOJO HEADQUARTERS
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
                {/* Address Card */}
                <div
                  className="light-card"
                  style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      backgroundColor: '#FEE2E2',
                      color: '#DC2626',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <MapPin size={22} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                      LOCATION ADDRESS
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                      {address}
                    </div>
                  </div>
                </div>

                {/* Direct Phone Card */}
                <div
                  className="light-card"
                  style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        backgroundColor: '#FEE2E2',
                        color: '#DC2626',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Phone size={22} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                        PHONE CALL
                      </div>
                      <a href={`tel:${phone}`} style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        {phone}
                      </a>
                    </div>
                  </div>
                  <a href={`tel:${phone}`} className="btn btn-primary btn-sm">
                    CALL NOW
                  </a>
                </div>

                {/* WhatsApp Chat Card */}
                <div
                  className="light-card"
                  style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        backgroundColor: '#DCFCE7',
                        color: '#16A34A',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <MessageCircle size={22} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                        WHATSAPP SUPPORT
                      </div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Instant Chat & Enquiry
                      </div>
                    </div>
                  </div>
                  <a
                    href={`https://wa.me/${whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm"
                    style={{ backgroundColor: '#25D366', color: '#FFFFFF' }}
                  >
                    CHAT
                  </a>
                </div>

                {/* Hours Card */}
                <div
                  className="light-card"
                  style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      backgroundColor: '#F1F5F9',
                      color: 'var(--text-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Clock size={22} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                      OPERATING HOURS
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                      {hours}
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>FOLLOW OUR JOURNEY</h4>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <a
                    href={settings?.instagram_url || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary btn-sm"
                  >
                    <InstagramIcon size={16} /> INSTAGRAM
                  </a>
                  <a
                    href={settings?.facebook_url || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary btn-sm"
                  >
                    <FacebookIcon size={16} /> FACEBOOK
                  </a>
                </div>
              </div>
            </div>

            {/* Right: Contact Enquiry Form & Google Maps Card */}
            <div>
              <div
                className="light-card"
                style={{
                  padding: '2.5rem',
                  backgroundColor: '#FFFFFF',
                  marginBottom: '2rem',
                }}
              >
                <h3 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  SEND A QUICK MESSAGE
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  Leave your details and our team will get back to you promptly.
                </p>

                {sent ? (
                  <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                    <CheckCircle size={40} color="#16A34A" style={{ margin: '0 auto 1rem' }} />
                    <h4 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                      Message Sent!
                    </h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                      Thank you for contacting Warrior Martial Arts. We will reply shortly.
                    </p>
                    <button onClick={() => setSent(false)} className="btn btn-secondary btn-sm">
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label className="form-label">Your Name *</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        placeholder="John Doe"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Phone Number *</label>
                        <input
                          type="tel"
                          required
                          className="form-control"
                          placeholder="+1 (555) 000-0000"
                          value={contactForm.phone}
                          onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Email Address *</label>
                        <input
                          type="email"
                          required
                          className="form-control"
                          placeholder="name@example.com"
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Message / Inquiry</label>
                      <textarea
                        rows="3"
                        className="form-control"
                        placeholder="Ask us anything about programs, trial sessions, or schedules..."
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary"
                      style={{ width: '100%', padding: '0.85rem' }}
                    >
                      <Send size={18} />
                      <span>{loading ? 'SENDING...' : 'SEND MESSAGE'}</span>
                    </button>
                  </form>
                )}
              </div>

              {/* Embedded Interactive Map Card */}
              <div
                className="light-card"
                style={{
                  overflow: 'hidden',
                  borderRadius: 'var(--radius-md)',
                  height: '260px',
                  position: 'relative',
                }}
              >
                <iframe
                  title="Academy Location"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src="https://maps.google.com/maps?q=Times+Square,+New+York,+NY&t=&z=13&ie=UTF8&iwloc=&output=embed"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
