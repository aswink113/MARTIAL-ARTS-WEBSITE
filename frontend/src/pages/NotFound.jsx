import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '4rem 1.5rem',
        backgroundColor: 'var(--light-bg)',
      }}
    >
      <div className="light-card" style={{ maxWidth: '520px', padding: '3.5rem 2.5rem', backgroundColor: '#FFFFFF' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#FEE2E2',
            color: '#DC2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}
        >
          <Flame size={32} />
        </div>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '5rem', color: '#DC2626', lineHeight: 1 }}>
          404
        </div>
        <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
          LOST IN THE DOJO?
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '2rem' }}>
          The page or kata you are seeking does not exist or has been moved to another training hall.
        </p>
        <Link to="/" className="btn btn-primary">
          <ArrowLeft size={16} /> RETURN TO HOME
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
