import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, Flame, AlertCircle, ArrowRight, CheckCircle2, HelpCircle, X, Mail, Phone, Eye, EyeOff, Shield, ArrowLeft, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PortalLogin = () => {
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('erp_saved_username') || '';
  });
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(() => {
    return localStorage.getItem('erp_remember_me') === 'true';
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [identifiedRole, setIdentifiedRole] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  // Background floating embers / particles animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle pool with warm fiery glow
    const particles = [];
    const particleCount = 55;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2.4 + 0.8,
        color: Math.random() > 0.4 ? 'rgba(239, 68, 68, ' : 'rgba(245, 158, 11, ',
        alpha: Math.random() * 0.75 + 0.2,
        speedX: (Math.random() - 0.5) * 0.7,
        speedY: -(Math.random() * 1.1 + 0.35),
        pulsing: Math.random() * 0.02 + 0.015,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.alpha += Math.sin(Date.now() * p.pulsing) * 0.012;

        if (p.y < -15) {
          p.y = canvas.height + 15;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -15) p.x = canvas.width + 15;
        if (p.x > canvas.width + 15) p.x = -15;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.max(0.12, Math.min(0.9, p.alpha)) + ')';
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#EF4444';
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!username.trim() || !password) {
      setError('Please enter your credentials and password.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      if (rememberMe) {
        localStorage.setItem('erp_remember_me', 'true');
        localStorage.setItem('erp_saved_username', username.trim());
      } else {
        localStorage.removeItem('erp_remember_me');
        localStorage.removeItem('erp_saved_username');
      }

      const data = await login(username.trim(), password);
      const role = data?.user?.role || 'user';
      setIdentifiedRole(role);

      setTimeout(() => {
        navigate('/portal');
      }, 500);
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid credentials. Please verify your Email, Staff ID, Student ID, or Username and password.');
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100vw',
        overflow: 'hidden',
        backgroundColor: '#07090E',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
      }}
    >
      {/* Background Canvas Particles */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Atmospheric Japanese Kanji Watermark (武 - Martial Spirit) */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '32vw',
          fontFamily: '"Cinzel", "Noto Serif JP", serif',
          color: 'rgba(220, 38, 38, 0.032)',
          userSelect: 'none',
          pointerEvents: 'none',
          zIndex: 0,
          lineHeight: 1,
        }}
      >
        武
      </div>

      {/* Animated Ambient Glowing Orbs */}
      <div
        className="floating-orb orb-1"
        style={{
          position: 'absolute',
          top: '8%',
          left: '12%',
          width: '540px',
          height: '540px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(220, 38, 38, 0.42) 0%, rgba(220, 38, 38, 0) 70%)',
          filter: 'blur(75px)',
          pointerEvents: 'none',
          zIndex: 0,
          animation: 'floatOrb1 16s ease-in-out infinite alternate',
        }}
      />

      <div
        className="floating-orb orb-2"
        style={{
          position: 'absolute',
          bottom: '8%',
          right: '12%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.35) 0%, rgba(245, 158, 11, 0) 70%)',
          filter: 'blur(75px)',
          pointerEvents: 'none',
          zIndex: 0,
          animation: 'floatOrb2 18s ease-in-out infinite alternate',
        }}
      />

      <div
        className="floating-orb orb-3"
        style={{
          position: 'absolute',
          top: '45%',
          right: '20%',
          width: '440px',
          height: '440px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(185, 28, 28, 0.3) 0%, rgba(185, 28, 28, 0) 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 0,
          animation: 'floatOrb3 20s ease-in-out infinite alternate',
        }}
      />

      {/* Subtle Geometric Ambient Grid Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* =========================================================================
          CRYSTALLINE FROSTED GLASS CARD WRAPPER
          ========================================================================= */}
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '470px', width: '100%' }}>
        {/* Pulsing Concentrated Backing Aura */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            height: '92%',
            background: 'radial-gradient(ellipse at center, rgba(220, 38, 38, 0.32) 0%, rgba(239, 68, 68, 0.12) 50%, transparent 75%)',
            filter: 'blur(45px)',
            pointerEvents: 'none',
            zIndex: -1,
            animation: 'pulseAura 5s ease-in-out infinite alternate',
          }}
        />

        {/* The Glassmorphism Card */}
        <div
          className="glass-card"
          style={{
            position: 'relative',
            padding: '2.85rem 2.45rem',
            borderRadius: '26px',
            background: 'linear-gradient(145deg, rgba(24, 29, 46, 0.68) 0%, rgba(12, 16, 27, 0.8) 100%)',
            backdropFilter: 'blur(32px) saturate(210%)',
            WebkitBackdropFilter: 'blur(32px) saturate(210%)',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            boxShadow: `
              0 0 0 1px rgba(255, 255, 255, 0.09) inset,
              0 1px 0 0 rgba(255, 255, 255, 0.28) inset,
              0 35px 80px -15px rgba(0, 0, 0, 0.9),
              0 0 50px rgba(220, 38, 38, 0.24)
            `,
            color: '#FFFFFF',
            overflow: 'hidden',
          }}
        >
          {/* Top Edge Specular Glow Beam */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '15%',
              right: '15%',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), rgba(239, 68, 68, 0.8), transparent)',
            }}
          />

          {/* Card Header & Brand Emblem */}
          <div style={{ textAlign: 'center', marginBottom: '2.1rem', position: 'relative' }}>
            {/* Small Dojo Pill Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '4px 12px',
                borderRadius: '9999px',
                background: 'rgba(220, 38, 38, 0.16)',
                border: '1px solid rgba(239, 68, 68, 0.38)',
                color: '#FCA5A5',
                fontSize: '0.72rem',
                fontWeight: 800,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                marginBottom: '1.25rem',
                boxShadow: '0 0 15px rgba(220, 38, 38, 0.25)',
              }}
            >
              <Shield size={13} color="#EF4444" />
              <span>WARRIOR ACADEMY ERP</span>
            </div>

            {/* Glowing 3D Emblem */}
            <div
              style={{
                position: 'relative',
                width: '70px',
                height: '70px',
                margin: '0 auto 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Outer Pulsing Aura */}
              <div
                style={{
                  position: 'absolute',
                  inset: '-6px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #EF4444, #F59E0B)',
                  filter: 'blur(10px)',
                  opacity: 0.85,
                  animation: 'pulseGlow 3s infinite alternate',
                }}
              />
              {/* Outer Rotating Metallic Ring */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  border: '2px solid rgba(255, 255, 255, 0.35)',
                  boxShadow: '0 0 20px rgba(239, 68, 68, 0.6)',
                }}
              />
              {/* Inner Crimson Gem Circle */}
              <div
                style={{
                  position: 'relative',
                  width: '62px',
                  height: '62px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 50%, #991B1B 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.4), inset 0 -3px 8px rgba(0, 0, 0, 0.4)',
                }}
              >
                <Flame size={34} fill="white" />
              </div>
            </div>

            {/* Title */}
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '2.5rem',
                letterSpacing: '0.06em',
                lineHeight: 1,
                margin: '0 auto',
                background: 'linear-gradient(180deg, #FFFFFF 25%, #F1F5F9 65%, #CBD5E1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 4px 20px rgba(220, 38, 38, 0.45)',
              }}
            >
              DOJO ERP PORTAL
            </h2>
          </div>

          {/* Error Alert */}
          {error && (
            <div
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.18)',
                border: '1px solid rgba(239, 68, 68, 0.55)',
                color: '#FCA5A5',
                padding: '0.85rem 1rem',
                borderRadius: '14px',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                fontSize: '0.86rem',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 15px rgba(239, 68, 68, 0.2)',
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0, color: '#EF4444' }} />
              <span>{error}</span>
            </div>
          )}

          {/* Role Identification Feedback */}
          {identifiedRole && (
            <div
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid rgba(16, 185, 129, 0.55)',
                color: '#6EE7B7',
                padding: '0.85rem 1rem',
                borderRadius: '14px',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                fontSize: '0.88rem',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.25)',
              }}
            >
              <CheckCircle2 size={18} style={{ flexShrink: 0, color: '#10B981' }} />
              <span>
                Identified as <strong>{identifiedRole.toUpperCase()}</strong>! Unlocking workspace...
              </span>
            </div>
          )}

          {/* Universal Single Sign-In Form */}
          <form onSubmit={handleLogin}>
            {/* Username / Email / Staff ID / Student ID Input */}
            <div style={{ marginBottom: '1.4rem' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginBottom: '0.55rem',
                  letterSpacing: '0.02em',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#EF4444',
                    boxShadow: '0 0 8px #EF4444',
                  }}
                />
                <span>Username / Email / Staff ID / Student ID</span>
              </label>

              <div className="glass-input-wrapper">
                <div className="input-icon-left">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  className="modern-glass-input"
                  placeholder="e.g. STF-002, STU-1001, email or username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password Input */}
            <div style={{ marginBottom: '1.35rem' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginBottom: '0.55rem',
                  letterSpacing: '0.02em',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#EF4444',
                    boxShadow: '0 0 8px #EF4444',
                  }}
                />
                <span>Password</span>
              </label>

              <div className="glass-input-wrapper">
                <div className="input-icon-left">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="modern-glass-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  style={{ paddingRight: '3rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle-btn"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Credentials Checkbox & Forgot Password Option */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.85rem',
                fontSize: '0.85rem',
              }}
            >
              {/* Custom Styled Remember Credentials */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  cursor: 'pointer',
                  color: 'rgba(255, 255, 255, 0.85)',
                  userSelect: 'none',
                  fontWeight: 500,
                }}
              >
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ display: 'none' }}
                />
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '5px',
                    border: rememberMe ? '1px solid #EF4444' : '1px solid rgba(255, 255, 255, 0.25)',
                    backgroundColor: rememberMe ? '#DC2626' : 'rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: rememberMe ? '0 0 10px rgba(220, 38, 38, 0.5)' : 'inset 0 1px 3px rgba(0,0,0,0.3)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {rememberMe && (
                    <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                      <path d="M1 4.5L4.5 8L11 1.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span>Remember Credentials</span>
              </label>

              {/* Forgot Password Option */}
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="forgot-password-link"
              >
                Forgot Password?
              </button>
            </div>

            {/* Quick Demo Credentials Autofill */}
            <div style={{ marginBottom: '1.4rem', padding: '0.75rem', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '0.45rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Sparkles size={12} color="#EF4444" />
                <span>Quick Fill Credentials:</span>
              </div>
              <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => { setUsername('admin'); setPassword('admin'); setError(''); }}
                  style={{
                    background: username === 'admin' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                    border: username === 'admin' ? '1px solid #EF4444' : '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#FFFFFF',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Admin (admin / admin)
                </button>
                <button
                  type="button"
                  onClick={() => { setUsername('STF-001'); setPassword('staff123'); setError(''); }}
                  style={{
                    background: username === 'STF-001' ? 'rgba(59, 130, 246, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                    border: username === 'STF-001' ? '1px solid #3B82F6' : '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#93C5FD',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Sensei (STF-001 / staff123)
                </button>
                <button
                  type="button"
                  onClick={() => { setUsername('STU-1001'); setPassword('student123'); setError(''); }}
                  style={{
                    background: username === 'STU-1001' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                    border: username === 'STU-1001' ? '1px solid #10B981' : '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#6EE7B7',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Student (STU-1001 / student123)
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="premium-submit-btn"
            >
              <div className="btn-shimmer" />
              {loading ? (
                <span>AUTHENTICATING & IDENTIFYING ROLE...</span>
              ) : (
                <>
                  <span>SIGN IN TO ERP</span>
                  <ArrowRight size={18} className="btn-arrow-icon" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back to Public Academy Website Link */}
        <div style={{ marginTop: '1.6rem', textAlign: 'center' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '0.85rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'color 0.2s ease',
              padding: '0.4rem 0.8rem',
              borderRadius: '8px',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)')}
          >
            <ArrowLeft size={15} />
            <span>Return to Warrior Martial Arts Academy</span>
          </Link>
        </div>
      </div>

      {/* =========================================================================
          FORGOT PASSWORD FROSTED GLASS MODAL
          ========================================================================= */}
      {showForgotModal && (
        <div
          onClick={() => setShowForgotModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '430px',
              width: '100%',
              padding: '2.5rem',
              borderRadius: '24px',
              backgroundColor: 'rgba(18, 22, 38, 0.92)',
              backdropFilter: 'blur(35px) saturate(200%)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(220, 38, 38, 0.35)',
              color: '#FFFFFF',
            }}
          >
            <button
              onClick={() => setShowForgotModal(false)}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                color: 'rgba(255, 255, 255, 0.6)',
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.16)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)')}
            >
              <X size={18} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(220, 38, 38, 0.2)',
                  color: '#EF4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.85rem',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  boxShadow: '0 0 15px rgba(239, 68, 68, 0.3)',
                }}
              >
                <HelpCircle size={28} />
              </div>
              <h3 style={{ fontSize: '1.65rem', color: '#FFFFFF', marginBottom: '0.25rem', fontFamily: 'var(--font-heading)' }}>
                RESET CREDENTIALS
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.85rem' }}>
                Recover your Dojo ERP access
              </p>
            </div>

            <p style={{ color: 'rgba(255, 255, 255, 0.82)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              For student and staff security, credential resets are managed by your Dojo Administrator or Chief Sensei. Contact the front desk directly:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.75rem' }}>
              <div
                style={{
                  padding: '0.85rem 1.1rem',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  fontSize: '0.88rem',
                }}
              >
                <Phone size={18} color="#EF4444" />
                <span>Call Dojo: <strong>+1 (123) 456-7890</strong></span>
              </div>
              <div
                style={{
                  padding: '0.85rem 1.1rem',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  fontSize: '0.88rem',
                }}
              >
                <Mail size={18} color="#EF4444" />
                <span>Email: <strong>sensei@warriormartialarts.com</strong></span>
              </div>
            </div>

            <button
              onClick={() => setShowForgotModal(false)}
              className="premium-submit-btn"
              style={{ width: '100%', padding: '0.85rem', borderRadius: '12px' }}
            >
              GOT IT / CLOSE
            </button>
          </div>
        </div>
      )}

      {/* Embedded High-End Glassmorphism Styles */}
      <style>{`
        /* Modern Glass Input Wrapper */
        .glass-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          border-radius: 14px;
          background: rgba(14, 18, 30, 0.72);
          border: 1px solid rgba(255, 255, 255, 0.14);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.35) inset, 0 1px 0 rgba(255, 255, 255, 0.08);
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .glass-input-wrapper:hover {
          border-color: rgba(255, 255, 255, 0.25);
          background: rgba(16, 21, 35, 0.82);
        }

        .glass-input-wrapper:focus-within {
          border-color: #EF4444;
          background: rgba(20, 26, 44, 0.9);
          box-shadow: 
            0 0 0 3px rgba(239, 68, 68, 0.28), 
            0 0 25px rgba(220, 38, 38, 0.45),
            0 4px 15px rgba(0, 0, 0, 0.4) inset;
        }

        .glass-input-wrapper:focus-within .input-icon-left {
          color: #EF4444;
          transform: translateY(-50%) scale(1.08);
        }

        .input-icon-left {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.55);
          pointer-events: none;
          transition: all 0.25s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modern-glass-input {
          width: 100% !important;
          padding: 0.92rem 1rem 0.92rem 2.85rem !important;
          font-size: 0.96rem !important;
          border-radius: 14px !important;
          background: transparent !important;
          border: none !important;
          color: #FFFFFF !important;
          outline: none !important;
          letter-spacing: 0.01em !important;
        }

        .modern-glass-input::placeholder {
          color: rgba(255, 255, 255, 0.42) !important;
          font-size: 0.9rem !important;
        }

        /* Password Toggle Button */
        .password-toggle-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.5);
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          transition: color 0.2s, background 0.2s;
        }

        .password-toggle-btn:hover {
          color: #FFFFFF;
          background: rgba(255, 255, 255, 0.08);
        }

        /* Prevent Chrome/Opera/Edge Autofill from turning inputs white */
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px rgba(16, 21, 35, 0.95) inset !important;
          -webkit-text-fill-color: #FFFFFF !important;
          border: none !important;
          transition: background-color 5000s ease-in-out 0s !important;
          border-radius: 14px !important;
        }

        /* Forgot Password Link */
        .forgot-password-link {
          color: #F87171;
          font-weight: 600;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.85rem;
          padding: 2px 0;
          position: relative;
          transition: color 0.2s ease;
        }

        .forgot-password-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 1px;
          background: #EF4444;
          transition: width 0.25s ease;
        }

        .forgot-password-link:hover {
          color: #FFFFFF;
        }

        .forgot-password-link:hover::after {
          width: 100%;
        }

        /* Premium Submit Button with Shimmer Sweep */
        .premium-submit-btn {
          position: relative;
          width: 100%;
          padding: 1.05rem;
          font-size: 1rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border-radius: 14px;
          background: linear-gradient(135deg, #EF4444 0%, #DC2626 50%, #991B1B 100%);
          color: #FFFFFF;
          border: 1px solid rgba(255, 255, 255, 0.32);
          box-shadow: 
            0 10px 30px -5px rgba(220, 38, 38, 0.7),
            0 0 20px rgba(239, 68, 68, 0.4) inset,
            0 1px 0 rgba(255, 255, 255, 0.4) inset;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: '0.6rem';
        }

        .premium-submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 14px 38px -4px rgba(220, 38, 38, 0.85),
            0 0 25px rgba(239, 68, 68, 0.6) inset,
            0 1px 0 rgba(255, 255, 255, 0.6) inset;
          border-color: rgba(255, 255, 255, 0.5);
        }

        .premium-submit-btn:active {
          transform: translateY(1px);
        }

        .premium-submit-btn:hover .btn-arrow-icon {
          transform: translateX(4px);
        }

        .btn-arrow-icon {
          transition: transform 0.2s ease;
          margin-left: 0.4rem;
        }

        /* Button Continuous Shimmer Light Beam */
        .btn-shimmer {
          position: absolute;
          top: 0;
          left: -100%;
          width: 60%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent);
          transform: skewX(-25deg);
          animation: shimmerBeam 4.5s infinite;
          pointer-events: none;
        }

        @keyframes shimmerBeam {
          0% { left: -100%; }
          25% { left: 180%; }
          100% { left: 180%; }
        }

        /* Ambient Keyframes */
        @keyframes floatOrb1 {
          0% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(70px, 60px) scale(1.15); }
          100% { transform: translate(-40px, 80px) scale(0.95); }
        }
        @keyframes floatOrb2 {
          0% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(-80px, -60px) scale(1.18); }
          100% { transform: translate(50px, -40px) scale(0.92); }
        }
        @keyframes floatOrb3 {
          0% { transform: translate(0px, 0px) scale(0.92); }
          50% { transform: translate(-50px, 70px) scale(1.1); }
          100% { transform: translate(60px, -30px) scale(1); }
        }
        @keyframes pulseGlow {
          0% { transform: scale(0.94); opacity: 0.65; }
          100% { transform: scale(1.14); opacity: 1; }
        }
        @keyframes pulseAura {
          0% { transform: translate(-50%, -50%) scale(0.95); opacity: 0.7; }
          100% { transform: translate(-50%, -50%) scale(1.08); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default PortalLogin;
